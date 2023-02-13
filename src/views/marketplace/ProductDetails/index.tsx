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
  getNFTDetail,
  getUserNFTDetail,
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


export const ProductionDetails = () => {
  const web3 = useWeb3()
  const { t } = useTranslation()
  const _chainId = window?.ethereum?.chainId
  const chainId = parseInt(_chainId, 16)
  const marketPlaceContractAddr = (config as any)[chainId]?.MARKET_ADDRESS
  const { account } = useWeb3React()
  const [tokenId, setTokenId] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')
  const [userContractAddr, setUserContractAddr] = useState('')
  const [ownerAddr, setOwnerAddr] = useState('')
  const [accountAddress, setAccountAddress] = useState<string | null | undefined>(getLocalStorage('wallet'))
  const token = getCookie('web-token') || ''

  const [status, setStatus] = useState<Number>()
  const [userNftStatus, setUserNftStatus] = useState<Number>()
  const [fansNum, setFansNum] = useState(0)
  const [fansStatus, setFansStatus] = useState<number | string>('')
  const [collectionsData, setCollectionsData] = useState({})
  const [tradingHistoryData, setTradingHistoryData] = useState([])
  const [collectGoodsData, setCollectGoodsData] = useState([])
  const history = useHistory()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [sellOrderFlag, setSellOrderFlag] = useState<boolean>(false)
  const [noticeStatus, setNoticeStatus] = useState<number | string>('')
  const [DetailData, setDetailData] = useState<any>({}) //详情数据
  const [detailMetadata, setDetailMetadata] = useState<any>({})
  const [contractType, setContractType] = useState(null)
  const [bugModalOpen, setBuyModalOpen] = useState(false)
  const [isAITD, setIsAITD] = useState<boolean>(false)
  const [useAmount, setUseAmount] = useState(0) // NFT可上架数量
  const [amountNum, setAmountNum] = useState(0) // 用户拥有Nft资产数量
  const [NFTOwner, setNFTOwner] = useState('')
  //初始化数据
  useEffect(() => {
    const state: any = history.location.state
    setOrderId(state?.orderId)
    setTokenId(state?.tokenId)
    setUserContractAddr(state?.contractAddr)
    // 详情
    init(state?.orderId)
  }, [history.location.state])

  useEffect(() => {
    if (noticeStatus === '') return
    getFansByGoodsIdData(DetailData?.tokenId, DetailData?.contractAddr)
  }, [noticeStatus])

  useEffect(() => {
    if (DetailData?.collectionId) {
      checkIsOwner()
    }
  }, [DetailData?.collectionId])
  const init = async (orderId: string) => {
    const state: any = history.location.state
    const params = {
      orderId: orderId,
    }
    const useParams = {
      tokenId: state?.tokenId,
      contractAddr: state?.contractAddr,
    }
    let datas: any = {}
    //1 如果是从资产跳转过来  并且没有 order id
    if (state?.source === 'assets' && orderId == null) {
      datas = await getUserNFTDetail(useParams)
    } else {
      datas = await getNFTDetail(orderId == null ? useParams : params)
    }
    let { data } = datas
    setStatus(data.status) //售卖状态
    setDetailMetadata(data?.nftMetadata)
    setContractType(data?.contractType) // 暂时取外层的合约类型

    setDetailData(data)
    setOrderId(data.orderId)
    setIsAITD(data?.coin === CoinType.AITD)
    if (data?.tokenId || data?.tokenId == 0) {
      getFansByGoodsIdData(data?.tokenId, data?.contractAddr)
      getOrderPageData(data?.tokenId, data?.contractAddr)
    }
    // 用户资产
    const asset: any = await getUserAsset({
      contractAddr: data?.contractAddr,
      tokenId: data?.tokenId,
      ownerAddr: accountAddress ? accountAddress : '-1'
    })
    // 如果存在orderid 取订单里所属者。 否则取资产里的
    if (orderId != null) {
      setOwnerAddr(data?.ownerAddr)
    } else {
      setOwnerAddr(asset?.data.userAddr) //NFT拥有者钱包地址
    }
    setUseAmount(asset?.data.amount)
    setAmountNum(asset?.data.amountTotal)
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

  // 判断当前合集id是否是当前登录用户的  && 获取商品列表
  const checkIsOwner = async () => {
    const params = {
      data: {
        collectionId: DetailData?.collectionId,
      },
      page: 1,
      size: 10,
    }

    const res: any = await getGoodsByCollectionId(params)
    setCollectGoodsData(res?.data?.records)
  }
  // // 请求Trading History
  const getOrderPageData = async (tokenId: number, contractAddr: string) => {
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
        web3,
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
      checkIsOwner()
    }
  }
  // 添加收藏
  const fansCollected = async (tokenId: string, contractAddr: string) => {
    const res: any = await getFans(tokenId, contractAddr)
    if (res?.message === 'success') {
      getFansByGoodsIdData(tokenId, contractAddr)
      checkIsOwner()
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
    init(orderId)
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
    <div className='personal-details'>
      <div className='details-wrapper'>
        <div className='wrapper-header'>
          <div className='header-pic'>
            <div className='header-image'>
              <div className='prod-image'>
                <img src={detailMetadata?.imageUrl} alt='' />
                <div className='fav'>
                  <img
                    className={!fansStatus ? 'favorite_border_gray' : 'favorite_red'}
                    src={!fansStatus ? require('../../../assets/fg.png') : require('../../../assets/fr.png')}
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
              <p className='collections-name' onClick={handleToCollection}>
                {DetailData?.collectionName}
              </p>
              <h1 className='name'>{formatTokenId(detailMetadata?.name, (detailMetadata?.tokenId || DetailData.tokenId))}</h1>
              <div className='author'>
                <div className='auth'>
                  <img src={detailMetadata?.imageUrl} alt='' />
                  <span>{t('marketplace.Owner')} {DetailData.contractType == 'ERC1155' && amountNum} {isOwner() ? ownerLink : ownerAddress}</span>
                </div>
              </div>
              <div className='buy'>
                {(DetailData?.price && DetailData?.status == 0) && (
                  <div className='price'>
                    <p>{t('marketplace.curPrice')}</p>
                    <p>
                      {intlFloorFormat(DetailData?.price, 4)} {DetailData?.coin || 'AITD'}
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
            <DescInfo
              metadata={detailMetadata}
              description={detailMetadata?.description}
              contractAddr={DetailData.contractAddr}
              tokenId={DetailData.tokenId}
              DetailData={DetailData}
            />
          </div>
        </div>
        {/* trading */}
        {tradingHistoryData.length > 0 && <Trading tradingHistoryData={tradingHistoryData} />}
        <MoreCollects
          collectGoodsData={collectGoodsData}
          collectionId={DetailData?.collectionId}
          notify={notify}
        />
        {/* 上架改价 */}
        {isOpen && <UpdatePriceModal isOpen={isOpen} sellOrderFlag={sellOrderFlag} data={DetailData} onCancel={() => setIsOpen(false)} updateGoods={updateGoods} />}
        {/* 购买弹窗 */}
        {bugModalOpen && <BugModal visible={bugModalOpen} onCancel={() => setBuyModalOpen(false)} data={DetailData} updateGoods={updateGoods} />}
      </div>
    </div>
  )
}
