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
import { getOrderEventPage } from '../../../api/order'
import { getCollectionDetails } from '../../../api/collection'
import { getFans, getFansByGoodsId, removeFans } from '../../../api/fans'
import { getCookie, getLocalStorage, toPriceDecimals } from 'Utils/utils'
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
  const [orderId, setOrderId] = useState<number>()
  const [ownerAddr, setOwnerAddr] = useState('')
  const [accountAddress, setAccountAddress] = useState<string | null | undefined>(getLocalStorage('wallet'))
  const token = getCookie('web-token') || ''

  const [status, setStatus] = useState<Number>()
  const [userNftStatus, setUserNftStatus] = useState<Number>()
  const [fansNum, setFansNum] = useState(0)
  const [fansStatus, setFansStatus] = useState<number | string>('')
  const [price, setPrice] = useState(0)
  const [amount, setAmount] = useState(0) // nft的个数
  const [collectionsData, setCollectionsData] = useState({})
  const [tradingHistoryData, setTradingHistoryData] = useState([])
  const [collectGoodsData, setCollectGoodsData] = useState([])
  const [messageVisible, setMessageVisible] = useState(false)
  const history = useHistory()
  const {
    id: goodsId,
    tokenId: userTokenId,
    contractAddr: userContractAddr,
  } = useParams<{ id: string; tokenId: string; contractAddr: string }>() // 路由参数id tokenId
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [sellOrderFlag, setSellOrderFlag] = useState<boolean>(false)
  const [noticeStatus, setNoticeStatus] = useState<number | string>('')
  const [DetailData, setDetailData] = useState<any>({}) //详情数据
  const [detailMetadata, setDetailMetadata] = useState<any>({})
  const [contractType, setContractType] = useState(null)
  const [bugModalOpen, setBuyModalOpen] = useState(false)
  const [isAITD, setIsAITD] = useState<boolean>(false)

  //初始化数据
  useEffect(() => {
    // 详情
    init()
  }, [tokenId, goodsId])

  useEffect(() => {
    if (noticeStatus === '') return
    getFansByGoodsIdData(DetailData?.tokenId, DetailData?.contractAddr)
  }, [noticeStatus])

  useEffect(() => {
    if (DetailData?.collectionId) {
      getCollection()
    }
  }, [DetailData?.collectionId])
  const init = async () => {
    const params = {
      orderId: goodsId,
    }
    const useParams = {
      orderId: goodsId || '',
      tokenId: userTokenId,
      contractAddr: userContractAddr,
      marketAddr: marketPlaceContractAddr,
    }
    let { data } = userTokenId ? await getUserNFTDetail(useParams) : await getNFTDetail(params)
    setStatus(data.status) //售卖状态
    setAmount(data.amount)
    setDetailMetadata(data?.nftMetadata)
    setContractType(data?.contractType) // 暂时取外层的合约类型

    // 我的资产跳转过来, 获取当前nft订单
    if (data?.nftOrderVO && data?.nftOrderVO.length) {
      const orderObj = data?.nftOrderVO.filter((item: any) => item.contractAddr === userContractAddr)[0] || {}
      data = { ...data, ...orderObj }
      setUserNftStatus(orderObj?.status)
    }

    setDetailData(data)
    setOrderId(data.orderId)
    setOwnerAddr(data.ownerAddr) //用户钱包地址
    setIsAITD(data?.coin === CoinType.AITD)

    if (data?.tokenId || data?.tokenId == 0) {
      getFansByGoodsIdData(data?.tokenId, data?.contractAddr)
      getOrderPageData(data?.tokenId, data?.contractAddr)
    }

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
  // 获取合集详情信息
  const getCollection = async () => {
    const res: any = await getCollectionDetails(DetailData?.collectionId)
    setCollectionsData(res?.data)
    checkIsOwner()
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
  // 请求Trading History
  const getOrderPageData = async (tokenId: number, contractAddr: string) => {
    console.log(contractAddr, 'contractAddr')

    const obj = {
      tokenId: tokenId,
      page: 1,
      size: 20,
      contractAddr: contractAddr,
    }
    const res: any = await getOrderEventPage(obj)
    setTradingHistoryData(res?.data?.records)
  }
  const isOwner = () => {
    // 连接钱包，并且拥有者=登录账户
    return !!account && DetailData?.ownerAddr === accountAddress
  }
  const isCancelSell = () => {

    // 用户资产跳过来进行出售操作，刷新后用数量判断
    const canEdit = userTokenId && amount === 0
    // userNftStatus用于判断nft是否正在出售
    return isOwner() && (canEdit || userNftStatus === 0 || status === 0)
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
        updateGoods()
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
    history.push(`/collection/${DetailData?.collectionId}`)
  }

 
  const sellBtn = () => {
    // 用户资产跳转过来状态为用户撤单 或 个数不为0
    const canSell = userTokenId ? amount !== 0 || userNftStatus === 2 : true
    // 判断属于本人, status 不是正在出售
    if (isOwner() && canSell && status !== 0) {
      return <button onClick={getSetPriceOrder}>{t('common.sell')}</button>
    }
  }
  const cancelBtn = () => {
    if (isCancelSell()) {
      return (
        <>
          <button onClick={getCancelSellOrder} className={'cancebtn'}> {t('marketplace.details.cancelList')}</button>
          <button onClick={getUpdateLowerPriceOrder} className={'updateBtn'}>{t('marketplace.details.update')}</button>
        </>
      )
    }
  }
  const updateGoods = () => {
    init()
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

  const ownerLink = <Link to={`/account/0/${ownerAddr}`}> {t('marketplace.details.you')} </Link>
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
              <h1 className='name'>{detailMetadata?.name + '#' + (detailMetadata?.tokenId || DetailData.tokenId)}</h1>
              <div className='author'>
                <div className='auth'>
                  <img src={detailMetadata?.imageUrl} alt='' />
                  <span>{t('marketplace.Owner')} {isOwner() ? ownerLink : ownerAddress}</span>
                </div>
              </div>
              <div className='buy'>
                {DetailData?.price && (
                  <div className='price'>
                    <p>{t('marketplace.curPrice')}</p>
                    <p>
                      {intlFloorFormat(DetailData?.price, 4)} {DetailData?.coin || 'AITD'}
                    </p>
                  </div>
                )}
                {!isOwner() && (
                  <button disabled={!isBuyNow()} onClick={handeClickBuy}>
                    {t('common.buyNow')}
                  </button>
                )}
                {/* /上架售出 */}
                {sellBtn()}
                {/* 改价和下架 */}
                <div className='wrapper-btn'>
                  {cancelBtn()}
                </div>
              </div>
            </div>
            {/* Description List */}
            <DescInfo
              metadata={detailMetadata}
              description={detailMetadata?.description}
              contractAddr={DetailData.contractAddr}
              tokenId={DetailData.tokenId}
              collectionsData={collectionsData}
              DetailData={DetailData}
            />
          </div>
        </div>
        {/* trading */}
        <Trading tradingHistoryData={tradingHistoryData} />
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
