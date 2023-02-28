import React, { useState } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { intlFloorFormat } from 'Utils/bigNumber'
import { formatTokenId, getCookie } from 'Utils/utils'
import config from 'Src/config/constants'
import './index.scss'
import { isProd } from 'Src/config/constants'
import UpdatePriceModal from 'Src/views/marketplace/ProductDetails/UpdatePriceModal'
import BugModal from 'Src/views/marketplace/ProductDetails/bugModal'
import instanceLoading from 'Utils/loading'
import { cancelMarketItem } from 'Src/hooks/marketplace'
import useWeb3 from 'Src/hooks/useWeb3'

interface PropsType {
  nftList: Array<any>
  owner?: boolean // 是否为个人账户
  isCollect?: boolean // 是否为集合nft
  handleItemChange?: Function
}


const CardNFT: React.FC<any> = (props: PropsType) => {
  const { t } = useTranslation()
  const history = useHistory()
  const web3 = useWeb3()
  const nftList = props.nftList || []
  const { owner = false, isCollect = false, handleItemChange } = props || {}
  const _chainId = window?.provider?.chainId
  const chainId = parseInt(_chainId, 16)
  const marketPlaceContractAddr = (config as any)[chainId]?.MARKET_ADDRESS
  const walletAccount: string = localStorage.getItem('wallet') || ''
  const [isOpen, setIsOpen] = useState(false)
  const [bugModalOpen, setBuyModalOpen] = useState(false)
  const token = getCookie('web-token') || ''
  const [detailData, setDetailData] = useState({})

  const handleJump = (item: any) => {
    const tokenId = item?.tokenId
    const contractAddr = item?.contractAddr
    history.push({
      pathname: "/asset",
      state: { tokenId, contractAddr }
    })
  }
  const OperateBtn = (item: any) => {
    const hasListing: boolean = item.status === 0
    return (
      <div className='btn' onClick={(e) => handleChange(e, item)}>
        {hasListing ? t('marketplace.details.cancel') : t('common.sell')}
      </div>
    )
  }
  // 售出 和取消上架
  const handleChange = (e: any, item: any) => {
    e.stopPropagation()
    // 下架
    if (item.status === 0) {
      getCancelSellOrder(item)
    } else {
      setIsOpen(true)
      setDetailData(item)
    }

  }
  // 取消上架 // 下架合约
  const getCancelSellOrder = async (item: any) => {
    if (!walletAccount || !token) {
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
        Number(item?.orderId),
        walletAccount,
        marketPlaceContractAddr,
      )
      if (cancelOrderRes?.transactionHash) {
        message.success(t('hint.cancellation'))
        handleItemChange && handleItemChange()
      }
      instanceLoading.close()
    } catch (error: any) {
      instanceLoading.close()
    }
  }
  const BuyBtn = (item: any) => {
    return (
      <div className='btn' onClick={(e) => handleBuyChange(e, item)}>
        {t('common.buyNow')}
      </div>
    )
  }
  const handleBuyChange = (e: any, item: any) => {
    e.stopPropagation()
    setBuyModalOpen(true)
    setDetailData(item)
  }

  return (
    <div className='cardItem'>
      {
        nftList.map((item: any, index: number) => {
          return (
            <div className='card' key={index}>
              <div onClick={() => handleJump(item)}>
                <div className='assets'>
                  <img src={item.imageUrl} alt='' />
                </div>
                <div className='assets-info'>
                  <div className='desc'>
                    <div className='name'>{formatTokenId(item.name, item.tokenId)}</div>
                  </div>
                  <div className='collection-name'>{item.collectionName}</div>
                  <div className='price'>
                    <div className='priceCenter'>
                      {item.status === 0 &&
                        <>
                          <img src={require('../../assets/coin/aitd.svg')} alt='' className='coin-img' />
                          {intlFloorFormat(item.price, 4)}
                        </>
                      }
                    </div>
                    {owner && item?.ownerAddr === walletAccount && OperateBtn(item)}
                    {isCollect && item?.ownerAddr !== walletAccount && item.price != null && BuyBtn(item)}
                  </div>
                </div>
              </div>
            </div>
          )
        })
      }
      {/* 上架 */}
      {
        isOpen && <UpdatePriceModal isOpen={isOpen} sellOrderFlag={true} data={detailData} onCancel={() => setIsOpen(false)} />
      }
      {/* 购买弹窗 */}
      {bugModalOpen && <BugModal visible={bugModalOpen} onCancel={() => setBuyModalOpen(false)} data={detailData} updateGoods={() => handleItemChange && handleItemChange()} />}
    </div>
  )
}

export default CardNFT