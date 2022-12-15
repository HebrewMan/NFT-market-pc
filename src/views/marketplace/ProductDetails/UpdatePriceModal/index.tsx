import React, { useEffect, useState } from 'react'
import { Modal, Input, message } from 'antd'
import './index.scss'
import { useTranslation } from 'react-i18next'
import { multipliedBy } from 'Utils/bigNumber'
import { getLocalStorage, toPriceDecimals, debounce, getCookie, formatTokenId } from 'Utils/utils'
import useWeb3 from 'Src/hooks/useWeb3'
import { useHistory } from 'react-router-dom'
import config, { isProd, ContractType } from 'Src/config/constants'
import {
	getIsApprovedForAll,
	getSetApprovalForAll,
	getSetERC711ApprovalForAll,
	getERC711IsApproved,
} from 'Src/hooks/web3Utils'
import instanceLoading from 'Utils/loading'
import { getModifyPrice, createMarketItem } from 'Src/hooks/marketplace'
import { getUpdateLowerPrice } from 'Src/api/index'
import MessageModal from '../MessageModal'
import _ from 'lodash'
import { getHandlingFee } from 'Src/api/user'

const UpdatePriceModal: React.FC<any> = (props) => {
	const { t } = useTranslation()
	const { data } = props
	const { contractAddr, tokenId, contractType, moneyAddr = null, price, amount, orderId } = props.data
	const web3 = useWeb3()
	const history = useHistory()
	const account = getLocalStorage('wallet') || ''
	const token = getCookie('web-token') || ''
	const _chainId = window?.ethereum?.chainId
	const chainId = parseInt(_chainId) //链id
	const marketPlaceContractAddr = (config as any)[chainId]?.MARKET_ADDRESS //市场合约地址
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
	const [amountNum, setAmountNum] = useState('') // 拥有数量
	const [updatePrice, setUpdatePrice] = useState('') // 价格
	const [defaultAmountNum, setDefaultAmountNum] = useState(1)//上架数量
	const isERC721: boolean = contractType === ContractType.ERC721
	const walletAccount = localStorage.getItem('wallet') || ''
	const [messageVisible, setMessageVisible] = useState<boolean>(false)
	const [handlingFee, setHandlingFee] = useState(0)

	// 过渡弹窗 显示字段
	const MessageData = {
		tokenId: tokenId,
		collectionName: data?.collectionName,
		imageUrl: data?.nftMetadata?.imageUrl,
		name: data?.nftMetadata?.name
	}

	// 初始化
	useEffect(() => {
		setIsModalVisible(props.isOpen)
		setUpdatePrice(price)
		console.log(typeof (updatePrice), 'updatePrice')

		setAmountNum(amount)
		// 获取手续费配置
		HandlingFeeData()
	}, [props])

	const HandlingFeeData = async () => {
		const data: any = await getHandlingFee({ name: 'transaction_fee' })
		setHandlingFee(data.data.value)
	}

	// 当数量变化时，价格重新计算
	useEffect(() => {
		setUpdatePrice(multipliedBy(updatePrice, defaultAmountNum, 18))
	}, [defaultAmountNum])
	// 关闭
	const onCancel = () => {
		props?.onCancel()
	}

	// 价格切换
	const handleChange = (event: any) => {
		const value = event.target.value
		const reg = /[^\d.]{1,18}/

		if (reg.test(value)) {
			message.error(t('hint.numbersOnly'))
			return
		}
		const posDot = value.indexOf('.')
		if (posDot < 0) {
			if (value.length < 18) {
				setUpdatePrice(value)
				return
			} else {
				if (value.length > 18) {
					setUpdatePrice(value.substring(0, 18))
				}
				return
			}
		}
		if (value <= 0) {
			message.error(t('hint.numbersGreater'))
			setUpdatePrice('')
			return
		}
		setUpdatePrice(value.substring(0, posDot + 19))
	}
	// 数量
	const handleNumChange = (event: any) => {
		const value = event.target.value
		if (value > data.amount) {
			message.error(t('不能大于拥有数量'))
			return
		}
		if (value <= 0) {
			message.error('Please only enter numbers greater than zero!')
		}
		setDefaultAmountNum(value)
	}
	const getSellOrderOrUpdatePrice = () => {
		if (props?.sellOrderFlag) {
			if (Number(updatePrice) <= 0 || _.isUndefined(updatePrice)) {
				message.error(t('hint.numbersGreater'))
			} else {
				getSellOrder()
			}

		} else {
			getUpdatePrice()
		}
	}
	// NFT上架     // 上架
	const getSellOrder = async () => {
		if (!account || !token) {
			message.error(t('hint.pleaseLog'))
			history.push('/login')
			return
		}
		if (chainId !== 1319 && isProd) {
			message.error(t('hint.switchMainnet'))
			return
		}
		const isApproval = isERC721
			? await getERC711IsApproved(tokenId, marketPlaceContractAddr, web3)
			: await getIsApprovedForAll(account, marketPlaceContractAddr, contractAddr, web3)
		let approvalRes: any = undefined
		let orderRes: any = undefined
		const _price = updatePrice
		instanceLoading.service()
		// 未授权，先授权
		if (!isApproval) {
			// ERC721 返回值为用户当前tokenid所授权的地址，如果未授权则返回 0x0000000000000000000000000000000000000000 地址
			approvalRes = isERC721
				? await getSetERC711ApprovalForAll(account, marketPlaceContractAddr, tokenId, contractAddr, web3)
				: await getSetApprovalForAll(account, marketPlaceContractAddr, true, contractAddr, web3)
		}

		// 已授权，调用上架合约
		if (isApproval || approvalRes?.transactionHash) {
			const obj = {
				moneyMintAddress: moneyAddr || (config as any)?.ZERO_ADDRESS, // 后台返回币种地址，否则默认原生币
				tokenId, // nft ID
				price: toPriceDecimals(_price, 18), // nft 价格
				Erc1155ContractAddr: contractAddr,
				marketPlaceContractAddr,
				account,
				ctype: contractType || data.contractType,
				amounts: defaultAmountNum,
			}
			try {
				orderRes = await createMarketItem(web3, obj)
			} catch (error: any) {
				instanceLoading.close()
			}
		}
		if (orderRes?.transactionHash) {
			// 上架通知后台
			message.success(t('hint.order'))
			setMessageVisible(true)
			// 上架成功 跳转到个人资产
			// history.push(`/account/0/${walletAccount}`)
			props?.onCancel()
			props?.updateGoods()

		}
		instanceLoading.close()
	}

	// 改价
	const getUpdatePrice = async () => {
		const _price = updatePrice
		const obj = {
			orderId, // 订单id
			newPrice: toPriceDecimals(_price, 18), // 价格
			marketType: 2, // 二级市场
			marketPlaceContractAddr,
			account,
		}
		if (!account || !token) {
			message.error(t('hint.pleaseLog'))
			history.push('/login')
			return
		}
		if (chainId !== 1319 && isProd) {
			message.error(t('hint.switchMainnet'))
			return
		}
		instanceLoading.service()
		try {
			const modifyPriceRes = await getModifyPrice(web3, obj)
			if (modifyPriceRes?.transactionHash) {
				// 修改价格通知后台
				const updateObj = {
					id: Number(orderId),
					tokenId,
					price: _price,
				}
				updateLowerPrice(updateObj)
			}
		} catch (error: any) {
			instanceLoading.close()
		}
		instanceLoading.close()
	}
	// 更新价格，给后台传goodsId和价格
	const updateLowerPrice = async (updateObj: any) => {
		getUpdateLowerPrice(updateObj)
			.then((res: any) => {
				if (res?.message === 'success') {
					props?.onCancel()
					props?.updateGoods()
				}
			})
			.catch((err: any) => {
			})
	}

	return (
		<div className='modalWaper'>
			<Modal
				title={props?.sellOrderFlag ? t('marketplace.details.setPrice') : t('marketplace.details.updateListPrice')}
				visible={isModalVisible}
				footer={null}
				onCancel={onCancel}
			>
				<div className='modalContent'>
					<div className='contentLeft'>
						<img src={data?.nftMetadata?.imageUrl || data.imageUrl} alt='' />
					</div>
					<div className='contentRight'>
						<div className='name'>{data?.collectionName}</div>
						<div className='info'>
							<section className='fontWeight'>{formatTokenId((data?.nftMetadata?.name || data?.name), data?.tokenId)}</section>
						</div>
					</div>
				</div>
				{props?.sellOrderFlag &&
					<div className='royalties'>
						<div className='royalties-fee fee'><span>版税</span><span>{data.royalty} %</span></div>
						<div className='fee'><span>手续费</span><span>{handlingFee} %</span></div>
					</div>
				}

				<div className='PriceWpaer'>
					<section className='label'>价格</section>
					<section className='inputWaper'>
						<Input type='number' placeholder={t('marketplace.details.priceEnter') || undefined} className='num_box' defaultValue={updatePrice} onChange={debounce(handleChange)} />
						<button>AITD</button>
					</section>
				</div>
				{/* 如果合约是1155 才显示数量 */}
				{(data?.contractType === 'ERC1155' && props?.sellOrderFlag) && (
					<div className='PriceWpaer'>
						<div className='label'>
							<span>数量</span>
							<span>拥有: {data?.leftAmount || amountNum}</span>
						</div>
						<section className='inputWaper'>
							<Input type='Number' defaultValue={defaultAmountNum} className='num_box' placeholder={t('marketplace.details.amountEnter') || undefined} onChange={debounce(handleNumChange)} />
						</section>
					</div>
				)}

				<div className='payWaper'>
					{Number(updatePrice) > 0 && <div className='title'>以 {updatePrice} USDT 的价格上架</div>}
					<div className='info'>{t('marketplace.details.sellTips')}</div>
				</div>
				<div className='BuyBtn' onClick={getSellOrderOrUpdatePrice}>确认上架</div>
			</Modal>
			{/*上架改价成功 过度弹窗 */}
			<MessageModal data={MessageData} visible={messageVisible} title={props?.sellOrderFlag ? '上架成功' : '改价成功'} />
		</div>
	)
}

export default UpdatePriceModal
