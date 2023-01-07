import React, { useEffect, useState } from 'react'
import { Button, Modal, message } from 'antd'
import { useWeb3React } from '@web3-react/core'
import useWeb3 from 'Src/hooks/useWeb3'
import { ethers } from 'ethers'
import { Link, useHistory, useParams } from 'react-router-dom'
import { isProd } from 'Src/config/constants'
import config, { USDT, ContractType, CoinType } from 'Src/config/constants'
import { getCookie, getLocalStorage, toPriceDecimals } from 'Utils/utils'
import { useTranslation } from 'react-i18next'
import './index.scss'
const decreaseImg = require('../../../../assets/marketPlace/decrease.png')
const increaseImg = require('../../../../assets/marketPlace/increase.png')
import instanceLoading from 'Utils/loading'
import { createMarketSale } from 'Src/hooks/marketplace'
import { getApproval, getIsApproved } from 'Src/hooks/web3Utils'
import MessageModal from '../MessageModal'
import { intlFloorFormat } from "Utils/bigNumber"

const ReceiveModal: React.FC<any> = (props) => {
  const web3 = useWeb3()
  const { t } = useTranslation()
  const history = useHistory()
  const { data } = props
  const { orderId, price, contractAddr, moneyAddr, tokenId, leftAmount, coin = 'AITD', marketAddr, contractType } = props.data
  const [accountAddress, setAccountAddress] = useState<string | null | undefined>(getLocalStorage('wallet'))
  const _chainId = window?.ethereum?.chainId
  const chainId = parseInt(_chainId, 16)
  const marketPlaceContractAddr = (config as any)[chainId]?.MARKET_ADDRESS
  const { account } = useWeb3React()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [subNum, setSubNum] = useState(1) //购买数量
  const [paymentPrice, setPaymentPrice] = useState(0)
  const token = getCookie('web-token') || ''
  const [isAITD, setIsAITD] = useState<boolean>(false)
  const [messageVisible, setMessageVisible] = useState<boolean>(false)
  const MessageData = {
    tokenId: tokenId,
    collectionName: data?.collectionName,
    imageUrl: data?.nftMetadata?.imageUrl || data?.imageUrl,
    name: data?.nftMetadata?.name || data?.name
  }
  // 初始化
  useEffect(() => {
    setIsModalOpen(props.visible)
    setPaymentPrice(price)
    setIsAITD(coin === CoinType.AITD)
  }, [props])

  // 关闭
  const onCancel = () => {
    props?.onCancel()
  }

  useEffect(() => {
    setPaymentPrice(intlFloorFormat(Number(price * subNum), 4))
  }, [subNum])
  // 增加
  const increase = () => {
    if (subNum >= 0) {
      setSubNum(subNum + 1)
    }
  }
  // 减少
  const decrease = () => {
    if (subNum != 1) {
      setSubNum(subNum - 1)
    }
  }

  // 买nft合约
  const getBuy = async () => {
    if (subNum > leftAmount) {
      message.error(t('marketplace.details.NFTAmount'))
      return
    }
    // 未链接钱包跳转
    if (!account) {
      return history.push(`/login`)
    }
    const Erc20ContractAddr = USDT.address || ''
    let approvedRes: any = undefined
    let fillOrderRes: any = undefined
    let allowance = 0

    const obj = {
      orderId, // 订单id
      price: toPriceDecimals(price, 18), // nft 价格 USDT.decimals
      // marketType: 2, // 用于标注二级市场
      Erc1155ContractAddr: contractAddr,
      moneyMintAddress: moneyAddr,
      marketPlaceContractAddr: marketAddr,
      account: accountAddress,
      tokenId: tokenId,
      ctype: contractType === ContractType.ERC721 ? 0 : 1,
      amounts: subNum, // 购买数量
      coin: coin,
    }

    if (!accountAddress || !token || !Erc20ContractAddr) {
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
      // 非原生币需要授权
      if (isAITD) {
        fillOrderRes = await createMarketSale(web3, obj)
      } else {
        // 查看erc20是否已授权, 获取授权余额
        const _allowance = await getIsApproved(accountAddress, marketPlaceContractAddr, Erc20ContractAddr, web3)
        allowance = Number(_allowance) - Number(price)
        if (allowance <= 0) {
          // 授权erc20 币种到市场合约
          approvedRes = await getApproval(
            accountAddress,
            marketPlaceContractAddr,
            ethers.constants.MaxUint256,
            Erc20ContractAddr,
            web3,
          )
        }
        if (allowance > 0 || !!approvedRes?.transactionHash) {
          fillOrderRes = await createMarketSale(web3, obj)
        }
      }
      if (!!fillOrderRes?.transactionHash) {
        message.success(t('hint.purchaseSuccess'))
        setMessageVisible(true)
        setIsModalOpen(false)
        // props?.onCancel()
        // props?.updateGoods()
      }
      instanceLoading.close()
    } catch (error) {
      props?.onCancel()
      instanceLoading.close()
    }

  }

  return (
    <div className='modalWaper'>
      <Modal title={t('marketplace.details.purchaseNFT')} visible={isModalOpen} footer={null} onCancel={onCancel}>
        <div className='modalContent'>
          <div className='contentLeft'>
            <img src={data?.nftMetadata?.imageUrl || data?.imageUrl} alt='' />
          </div>
          <div className='contentRight'>
            <div className='name'>{data?.collectionName}</div>
            <div className='info'>
              <section className='fontWeight'>{data?.nftMetadata?.name || data?.name}</section>
              <section>{data?.price} AITD</section>
            </div>
          </div>
        </div>
        {/* 如果合约是1155 才显示数量 */}
        {data?.contractType === 'ERC1155' && (
          <div className='numberWaper'>
            <div onClick={decrease}>
              <img src={decreaseImg} alt='' />
            </div>
            <input type='text' className='num_box' value={subNum} />
            <div onClick={increase}>
              <img src={increaseImg} alt='' />
            </div>
          </div>
        )}

        <div className='pay'>
          <div className='name'>{t('marketplace.details.payAmount')}</div>
          <div className='price'>{paymentPrice} AITD</div>
        </div>
        <div className='BuyBtn' onClick={getBuy}>{t('marketplace.details.pay')}</div>
      </Modal>
      {/* 购买成功& 上架改加成功 过度弹窗 */}
      <MessageModal data={MessageData} visible={messageVisible} title={t('marketplace.details.buysuccessfullyInfo')} />
    </div>
  )
}

export default ReceiveModal
