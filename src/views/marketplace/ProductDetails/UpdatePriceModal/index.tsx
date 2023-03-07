import React, { useEffect, useState } from 'react'
import { Modal, Input, message } from 'antd'
import './index.scss'
import { useTranslation } from 'react-i18next'
import { intlFloorFormat, multipliedBy, accurateAdd, minus } from 'Utils/bigNumber'
import { getLocalStorage, toPriceDecimals, debounce, getCookie, formatTokenId } from 'Utils/utils'
import useWeb3 from 'Src/hooks/useWeb3'
import { useHistory } from 'react-router-dom'
import config, { isProd, ContractType, CoinType } from 'Src/config/constants'
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
import { getHandlingFee, getUserAsset } from 'Src/api/user'

const UpdatePriceModal: React.FC<any> = (props) => {
	const { t } = useTranslation()
	const { data, useAmount = 1 } = props
	const { contractAddr, tokenId, contractType, moneyAddr = null, price, amount, orderId, leftAmount } = props.data
	const web3 = useWeb3()
	const history = useHistory()
	const account = getLocalStorage('wallet') || ''
	const token = getCookie('web-token') || ''
	const _chainId = window.provider?.chainId
	const chainId = parseInt(_chainId) //链id
	const marketPlaceContractAddr = (config as any)[chainId]?.MARKET_ADDRESS //市场合约地址
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
	const [amountNum, setAmountNum] = useState('') // 拥有数量
	const [updatePrice, setUpdatePrice] = useState('') // 价格
	const [defaultAmountNum, setDefaultAmountNum] = useState(leftAmount || '1')//上架数量
	const isERC721: boolean = contractType === ContractType.ERC721
	const walletAccount = localStorage.getItem('wallet') || ''
	const [messageVisible, setMessageVisible] = useState<boolean>(false)
	const [handlingFee, setHandlingFee] = useState(0) //手续费
	const [getPrice, setGetPrice] = useState('0')  //最终获得价格
	const [messageData, setMessageData] = useState<any>({
		tokenId: tokenId,
		collectionName: data?.collectionName,
		imageUrl: data?.nftMetadata?.imageUrl || data.imageUrl,
		name: data?.nftMetadata?.name || data?.name,
		contractAddr: contractAddr
	})

	// 初始化
	useEffect(() => {
		setIsModalVisible(props.isOpen)
		setUpdatePrice(price)
		// 获取手续费配置
		HandlingFeeData()
		if (price) {
			setDefaultAmountNum(leftAmount)
		}
		if (props?.sellOrderFlag) {
			setUpdatePrice('')
			setDefaultAmountNum(1)
		}
	}, [props])

	useEffect(() => {
		makeDealPrice(updatePrice, defaultAmountNum)
	}, [defaultAmountNum, updatePrice])

	const HandlingFeeData = async () => {
		const data: any = await getHandlingFee({ name: 'transaction_fee' })
		setHandlingFee(data.data.value)
		// 用户资产
		const asset: any = await getUserAsset({ contractAddr: contractAddr, tokenId: tokenId, ownerAddr: walletAccount })
		setAmountNum(asset?.data.amount)
	}

	// 关闭
	const onCancel = () => {
		props?.onCancel()
	}


	// 成交后价格计算 (价格 * 挂单数量) -  总价（版税+ 交易手续费）
	const makeDealPrice = (price: string, num: string | number) => {
		const orderPrice = multipliedBy(price, num)
		const royaltyFree = accurateAdd(handlingFee, data.royalty) / 100
		setGetPrice(minus(orderPrice, multipliedBy(orderPrice, royaltyFree)))
	}


	// 价格切换
	const handleChange = (event: any) => {
		const value = event.target.value
		const reg = /[^\d.]{1,18}/
		if (reg.test(value)) {
			message.error(t('hint.numbersOnly'))
			return
		}

		makeDealPrice(value, defaultAmountNum)

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
		if (value > amountNum) {
			message.error(t('marketplace.details.greaterAvailable'))
			return
		}
		if (value <= 0) {
			message.error(t('hint.numbersGreater'))
		}
		setDefaultAmountNum(value)
		makeDealPrice(updatePrice, value)
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
			// history.push('/login')
			return
		}
		if (chainId !== 1319 && isProd) {
			message.error(t('hint.switchMainnet'))
			return
		}
		const isApproval = isERC721
			? await getERC711IsApproved(tokenId, marketPlaceContractAddr)
			: await getIsApprovedForAll(account, marketPlaceContractAddr, contractAddr)
		let approvalRes: any = undefined
		let orderRes: any = undefined
		const _price = updatePrice
		instanceLoading.service()
		// 未授权，先授权
		if (!isApproval) {
			// ERC721 返回值为用户当前tokenid所授权的地址，如果未授权则返回 0x0000000000000000000000000000000000000000 地址
			approvalRes = isERC721
				? await getSetERC711ApprovalForAll(account, marketPlaceContractAddr, tokenId, contractAddr)
				: await getSetApprovalForAll(account, marketPlaceContractAddr, true, contractAddr)
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
				orderRes = await createMarketItem(obj)
			} catch (error: any) {
				instanceLoading.close()
			}
		}
		if (orderRes?.transactionHash) {
			// 上架通知后台
			setMessageVisible(true)
			message.success(t('hint.order'))
			setIsModalVisible(false)
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
			// history.push('/login')
			return
		}
		if (chainId !== 1319 && isProd) {
			message.error(t('hint.switchMainnet'))
			return
		}
		instanceLoading.service()
		try {
			const modifyPriceRes = await getModifyPrice(obj)
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
					// setMessageVisible(true)
					setIsModalVisible(false)
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
				<div className='PriceWpaer'>
					<section className='label'>{t('marketplace.details.unitPrice')}</section>
					<section className='inputWaper'>
						<Input
							maxLength={20}
							placeholder={t('marketplace.details.priceEnter') || undefined}
							className='num_box'
							defaultValue={updatePrice}
							onChange={debounce(handleChange)}
							suffix={CoinType.AITD}
						/>
						{/* <button>{CoinType.AITD}</button> */}
					</section>
				</div>
				{/* 如果合约是1155 才显示数量 */}
				{(data?.contractType === 'ERC1155') && (
					<div className='PriceWpaer'>
						<div className='label'>
							<span>{t('marketplace.details.amount')}</span>
							<span>{t('marketplace.details.available')}: {amountNum}</span>
						</div>
						<section className='inputWaper'>
							<Input
								type='Number'
								defaultValue={defaultAmountNum}
								className='num_box'
								placeholder={t('marketplace.details.enterAmounts') || undefined}
								onChange={debounce(handleNumChange)}
								disabled={props?.sellOrderFlag ? false : true}
								style={props?.sellOrderFlag ? { backgroundColor: '' } : { backgroundColor: '#f1f1f1' }}
							/>
						</section>
					</div>
				)}
				<div className='royalties-waper'>
					<div className='royalties-fee fee'><span>{t('common.royalty')}</span><span>{data.royalty} %</span></div>
					<div className='fee'><span>{t('marketplace.details.handlingFees')}</span><span>{handlingFee} %</span></div>
				</div>
				<div className='payWaper'>
					{(Number(updatePrice) > 0 && Number(getPrice) > 0) && <div className='title'>{t('marketplace.details.dollarsInfo', { price: updatePrice + 'AITD', getPrice: intlFloorFormat(getPrice, 4) + 'AITD' })}</div>}
					{/* <div className='info'>{t('marketplace.details.sellTips')}</div> */}
				</div>
				<div className='BuyBtn' onClick={getSellOrderOrUpdatePrice}>{t('marketplace.details.confirmListing')}</div>
			</Modal>
			{/*上架改价成功 过度弹窗 */}
			{(props?.sellOrderFlag && messageVisible) && <MessageModal visible={messageVisible} data={messageData} title={t('marketplace.details.successfullyLaunched')} />}

		</div>
	)
}

export default UpdatePriceModal
