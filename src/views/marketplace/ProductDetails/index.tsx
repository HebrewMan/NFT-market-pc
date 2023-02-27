import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { ethers } from 'ethers'
import { DescInfo } from './DescInfo'
import { MoreCollects } from './More'
import { Trading } from './Trading'
import { message, Button } from 'antd'
import { useWeb3React } from '@web3-react/core'
import useWeb3 from '../../../hooks/useWeb3'
import { useTranslation } from 'react-i18next'
import { intlFloorFormat } from 'Utils/bigNumber'
import { cancelMarketItem } from 'Src/hooks/marketplace'
import {
  // getNFTDetail,
  // getUserNFTDetail,
  getGoodsByCollectionId,
} from '../../../api'
import { getUserAsset } from 'Src/api/user'
import { getOrderEventPage } from '../../../api/order'
import { getFans, getFansByGoodsId, removeFans } from '../../../api/fans'
import { getCookie, getLocalStorage, formatTokenId, } from 'Utils/utils'
import config, { USDT, ContractType, CoinType } from 'Src/config/constants'
import instanceLoading from 'Utils/loading'
import { isProd } from 'Src/config/constants'
import BugModal from './bugModal'
import UpdatePriceModal from './UpdatePriceModal'
import './index.scss'
import { getNftDetail } from 'Src/api/marketPlace'


export const ProductionDetails = () => {
  const web3 = useWeb3()
  const { t } = useTranslation()
  const _chainId = window?.ethereum?.chainId
  const chainId = parseInt(_chainId, 16)
  const marketPlaceContractAddr = (config as any)[chainId]?.MARKET_ADDRESS
  const { account } = useWeb3React()
  // const [tokenId, setTokenId] = useState<string>('') // token id
  // const [userContractAddr, setUserContractAddr] = useState('') // nft 合约地址
  const [ownerAddr, setOwnerAddr] = useState('')
  const [accountAddress, setAccountAddress] = useState<string | null | undefined>(getLocalStorage('wallet'))
  const token = getCookie('web-token') || ''

  const [status, setStatus] = useState<Number>()
  const [fansNum, setFansNum] = useState(0)
  const [fansStatus, setFansStatus] = useState<number | string>('')
  const [tradingHistoryData, setTradingHistoryData] = useState([])
  const [collectGoodsData, setCollectGoodsData] = useState([])
  const history = useHistory()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [sellOrderFlag, setSellOrderFlag] = useState<boolean>(false)
  const [noticeStatus, setNoticeStatus] = useState<number | string>('')
  const [bugModalOpen, setBuyModalOpen] = useState(false)
  const [useAmount, setUseAmount] = useState(0) // NFT可上架数量
  const [amountNum, setAmountNum] = useState(0) // 用户拥有Nft资产数量
  const [detailMetadata, setDetailMetadata] = useState<any>({}) //元数据info
  const [collectiondata, setCollectiondata] = useState<any>({}) //集合数据info
  const [orderData, setOrderData] = useState<any>({}) //订单数据
  const [DetailData, setDetailData] = useState<any>({}) //汇总数据
  //初始化数据
  useEffect(() => {
    const state: any = history.location.state
    getDetail(state?.tokenId, state?.contractAddr)
  }, [history.location.state])

  useEffect(() => {
    if (noticeStatus === '') return
    getFansByGoodsIdData(DetailData?.tokenId, DetailData?.contractAddr)
  }, [noticeStatus])

  // 获取nft详情
  const getDetail = async (tokenId: string, userContractAddr: string) => {
    const useParams = {
      tokenId: tokenId,
      contractAddr: userContractAddr,
    }
    const datas = await getNftDetail(useParams)
    const { data } = datas
    setDetailMetadata(data?.metadataVO) //元数据
    setCollectiondata(data?.collectionsVO) //集合数据
    setOrderData(data?.orderVO) //订单数据
    const summaryData = {
      ...data?.collectionsVO,
      ...data?.metadataVO,
      ...data?.orderVO,
    }
    setDetailData(summaryData)

    // 获取用户资产
    const asset: any = await getUserAsset({
      contractAddr: userContractAddr,
      tokenId: tokenId,
      ownerAddr: accountAddress ? accountAddress : '-1'
    })
    if (data?.orderVO != null) {
      setStatus(data?.orderVO.status) //售卖状态
      // 如果存在订单取当前订单里所属者。 否则取资产里的
      if (data?.orderVO.ownerAddr != null) {
        setOwnerAddr(data?.orderVO.ownerAddr)
      } else {
        setOwnerAddr(asset?.data.userAddr) //NFT拥有者钱包地址
      }
    }
    setUseAmount(asset?.data.amount)
    setAmountNum(asset?.data.amountTotal)
    // 获取粉丝数量
    getFansByGoodsIdData(tokenId, userContractAddr)
    // 交易历史
    // getOrderPageData(tokenId, userContractAddr)
    // 更多nft
    getMoreCollection(data?.collectionsVO.id)
  }


  // 获取粉丝数量
  const getFansByGoodsIdData = async (tokenId: string, contractAddr: string) => {
    const address = localStorage.getItem('wallet')
    const param = {
      tokenId: tokenId,
      contractAddr: contractAddr,
      ownerAddr: address,
    }
    // if (tokenId) {
    const res: any = await getFansByGoodsId(param)
    setFansNum(res?.data?.collectNum)
    setFansStatus(Number(res?.data?.collect))
    // }
  }

  // 获取当前集合下更多的nft
  const getMoreCollection = async (id: string) => {
    console.log(id, 'idid')
    const params = {
      data: {
        collectionId: id,
      },
      page: 1,
      size: 10,
    }
    const res: any = await getGoodsByCollectionId(params)
    setCollectGoodsData(res?.data?.records)
  }
  // // 请求Trading History
  const getOrderPageData = async (tokenId: string, contractAddr: string) => {
    const obj = {
      tokenId: tokenId,
      page: 1,
      size: 1000,
      contractAddr: contractAddr,
    }
    const res: any = await getOrderEventPage(obj)
    setTradingHistoryData(res?.data?.records)
  }
  const isOwner = () => {
    // 连接钱包，并且拥有者=登录账户
    return !!account && ownerAddr === accountAddress
  }

  const isBuyNow = () => {
    // 正在出售 状态：0-正在出售；1-已售空；2-已取消
    return status === 0
  }
  const getSetPriceOrder = () => {
    // 上架
    setIsOpen(true)
    setSellOrderFlag(true)
  }
  const updateClose = (open: boolean) => {
    setIsOpen(open)
  }
  // 取消上架 // 下架合约
  const getCancelSellOrder = async () => {
    if (!accountAddress || !token) {
      message.error(t('hint.switchMainnet'))
      history.push('/login')
      return
    }
    if (chainId !== 1319 && isProd) {
      message.success(t('hint.cancellation'))
      return
    }
    instanceLoading.service()
    try {
      const cancelOrderRes = await cancelMarketItem(
        Number(DetailData?.orderId),
        accountAddress,
        marketPlaceContractAddr,
      )
      if (cancelOrderRes?.transactionHash) {
        message.success(t('hint.cancellation'))
        history.push(`/account/0/${accountAddress}`)
        // updateGoods()
      }
      instanceLoading.close()
    } catch (error: any) {
      instanceLoading.close()
    }
  }
  const getUpdateLowerPriceOrder = () => {
    // 修改价格
    setIsOpen(true)
    setSellOrderFlag(false)
  }
  const toggleFansCollected = () => {
    fansStatus
      ? removeFansData(DetailData?.tokenId, DetailData?.contractAddr)
      : fansCollected(DetailData?.tokenId, DetailData?.contractAddr)
  }
  // 取消收藏
  const removeFansData = async (tokenId: string, contractAddr: string) => {
    const res: any = await removeFans(tokenId, contractAddr)
    if (res?.message === 'success') {
      getFansByGoodsIdData(tokenId, contractAddr)
      // checkIsOwner()
    }
  }
  // 添加收藏
  const fansCollected = async (tokenId: string, contractAddr: string) => {
    const res: any = await getFans(tokenId, contractAddr)
    if (res?.message === 'success') {
      getFansByGoodsIdData(tokenId, contractAddr)
      // checkIsOwner()
    }
  }
  const handleToCollection = () => {
    history.push(`/collection/${DetailData?.linkCollection}`)
  }


  const sellBtn = () => {
    // 只要用户可用数量>1 就能继续上架
    if (isOwner() && useAmount >= 1) {
      return <button onClick={getSetPriceOrder}>{t('common.sell')}</button>
    }
    else {
      return (isOwner() && status != null) && cancelBtn()
    }
  }
  const cancelBtn = () => {
    // if (isCancelSell()) {
    return (
      <div className='wrapper-btn'>
        <button onClick={getCancelSellOrder} className={'cancebtn'}> {t('marketplace.details.cancelList')}</button>
        <button onClick={getUpdateLowerPriceOrder} className={'updateBtn'}>{t('marketplace.details.update')}</button>
      </div>
    )
    // }
  }
  const updateGoods = () => {
    // init(orderId)
    getFansByGoodsIdData(DetailData?.tokenId, DetailData?.contractAddr)

  }
  const notify = (status: number | string) => {
    setFansStatus(status)
    setNoticeStatus(status)
  }
  // 购买按钮
  const handeClickBuy = () => {
    setBuyModalOpen(true)
  }

  const ownerLink = (
    <Link to={`/account/0/${ownerAddr}`}>
      {amountNum && amountNum > 0 ? t('marketplace.details.you') : null}
    </Link>
  )
  const ownerAddress = (
    <Link to={`/account/0/${ownerAddr}`}>
      {ownerAddr?.startsWith('0x') ? ownerAddr?.substring(2, 8) : ownerAddr?.substring(0, 6)}
    </Link>
  )
  return (
    <div className='personal-details content-wrap-top'>
      <div className='details-wrapper'>
        <div className='wrapper-header'>
          <div className='header-pic'>
            <div className='header-image'>
              <div className='prod-image'>
                <img src={detailMetadata?.imageUrl} alt='' className='cover' />
                <div className='fav'>
                  <img
                    className={!fansStatus ? 'favorite_border_gray' : 'favorite_red'}
                    src={!fansStatus ? require('Src/assets/marketPlace/icon-collection.png') : require('Src/assets/marketPlace/icon-collection-active.png')}
                    onClick={() => toggleFansCollected()}
                    alt=''
                  />
                  <span>{fansNum}</span>
                </div>
              </div>
            </div>
          </div>
          {/* desc */}
          <div className='header-information'>
            <div className='information-top'>
              <div className='name-waper'>
                <h1 className='name'>{formatTokenId(detailMetadata?.name, detailMetadata?.tokenId)}</h1>
                <p className='collections-name' onClick={handleToCollection}>
                  {collectiondata?.collectionName}
                </p>
              </div>


              <div className='author'>
                <div className='auth'>
                  <img src={detailMetadata?.imageUrl} alt='' />
                  <span>{t('marketplace.Owner')} {detailMetadata.contractType == 'ERC1155' && amountNum} {isOwner() ? ownerLink : ownerAddress}</span>
                </div>
              </div>
              <div className='buy'>
                {(orderData?.price && status == 0) && (
                  <div className='price'>
                    <p>{t('marketplace.curPrice')}</p>
                    <p>
                      {intlFloorFormat(orderData?.price, 4)} {orderData?.coin || 'AITD'}
                    </p>
                  </div>
                )}
                {(status != null && !isOwner()) && (
                  <button disabled={!isBuyNow()} onClick={handeClickBuy}>
                    {t('common.buyNow')}
                  </button>
                )}
                {/* /上架售出 改价和下架  */}
                {sellBtn()}
                {/* */}
                {/* <div className='wrapper-btn'>
                  {cancelBtn()}
                </div> */}
              </div>
            </div>
            {/* Description List */}
            <DescInfo metadata={detailMetadata} />
          </div>
        </div>
        {/* trading */}
        <Trading tokenId={DetailData?.tokenId} contractAddr={DetailData?.contractAddr} />
        <MoreCollects collectGoodsData={collectGoodsData} notify={notify} />
        {/* 上架改价 */}
        {isOpen && <UpdatePriceModal isOpen={isOpen} sellOrderFlag={sellOrderFlag} data={DetailData} onCancel={() => setIsOpen(false)} updateGoods={updateGoods} />}
        {/* 购买弹窗 */}
        {bugModalOpen && <BugModal visible={bugModalOpen} onCancel={() => setBuyModalOpen(false)} data={DetailData} updateGoods={updateGoods} />}
      </div>
    </div>
  )
}
