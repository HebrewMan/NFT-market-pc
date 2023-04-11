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
import { showConnectModal } from "Src/components/ConnectModal"

const ReceiveModal: React.FC<any> = (props) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { data } = props
  const { orderId, price, contractAddr, moneyAddr, tokenId, leftAmount, coin = 'AITD', marketAddr, contractType } = props.data
  const [accountAddress, setAccountAddress] = useState<string | null | undefined>(getLocalStorage('wallet'))
  const _chainId = window?.provider?.chainId
  const chainId = getLocalStorage('walletName') == 'WalletConnect' ? _chainId : parseInt(_chainId, 16)
  const marketPlaceContractAddr = (config as any)[chainId]?.MARKET_ADDRESS
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
    name: data?.nftMetadata?.name || data?.name,
    contractAddr: contractAddr
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
    const pirceAll = Number(price * subNum)
    setPaymentPrice(Number(intlFloorFormat(pirceAll, 4)))
  }, [subNum])

  // 增加
  const increase = () => {
    if (subNum > leftAmount) {
    }
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

  //
  const inputChange = (e: any) => {
    if (Number(e.target.value) > leftAmount) {
      setSubNum(leftAmount)
    } else {
      setSubNum(Number(e.target.value))
    }
  }
  const inputBlur = (e: any) => {
    if (e.target.value === '0') {
      setSubNum(1)
    }
  }

  // 买nft合约
  const getBuy = async () => {
    // 未链接钱包
    if (!window.provider || !accountAddress || !token) {
      showConnectModal(true)
      return
    }
    console.log(window.provider, chainId, isProd, '主网信息')
    if (chainId !== 1319 && isProd) {
      message.error(t('hint.switchMainnet'))
      return
    }
    if (subNum > leftAmount) {
      message.error(t('marketplace.details.NFTAmount'))
      return
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
    if (chainId !== 1319 && isProd) {
      message.error(t('hint.switchMainnet'))
      return
    }
    instanceLoading.service()
    try {
      // 非原生币需要授权
      if (isAITD) {
        fillOrderRes = await createMarketSale(obj)
      } else {

        // 查看erc20是否已授权, 获取授权余额
        const _allowance = await getIsApproved(accountAddress, marketPlaceContractAddr, Erc20ContractAddr)
        allowance = Number(_allowance) - Number(price)
        if (allowance <= 0) {
          // 授权erc20 币种到市场合约
          approvedRes = await getApproval(
            accountAddress,
            marketPlaceContractAddr,
            ethers.constants.MaxUint256,
            Erc20ContractAddr,
          )
        }
        if (allowance > 0 || !!approvedRes?.transactionHash) {
          fillOrderRes = await createMarketSale(obj)
        }
      }
      if (!!fillOrderRes?.transactionHash) {
        message.success(t('hint.purchaseSuccess'))
        setMessageVisible(true)
        setIsModalOpen(false)
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
              <section className='fontWeight'>{data?.name}</section>
              <section>{data?.price} AITD</section>
            </div>
          </div>
        </div>
        {/* 如果合约是1155 才显示数量 */}
        {data?.contractType === 'ERC1155' && (
          <div className='numberWaper'>
            <button onClick={decrease} disabled={subNum <= 1 ? true : false}>
              <img src={decreaseImg} alt='' />
            </button>
            <input
              type='text'
              className='num_box'
              value={subNum}
              onChange={inputChange}
              onBlur={inputBlur}
              disabled={subNum == leftAmount ? true : false} />
            <button onClick={increase} disabled={subNum >= leftAmount ? true : false}>
              <img src={increaseImg} alt='' />
            </button>
          </div>
        )}

        <div className='pay'>
          <div className='name'>{t('marketplace.details.payAmount')}</div>
          <div className='price'>{paymentPrice} AITD</div>
        </div>
        {/* 购买支付按钮 */}
        <div className='BuyBtn' onClick={getBuy}>{t('marketplace.details.pay')}</div>
      </Modal>
      {/* 购买成功& 上架改加成功 过度弹窗 */}
      <MessageModal data={MessageData} visible={messageVisible} title={t('marketplace.details.buysuccessfullyInfo')} />
    </div>
  )
}

export default ReceiveModal
