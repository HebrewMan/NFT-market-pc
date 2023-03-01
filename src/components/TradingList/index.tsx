import React, { useEffect, useState } from 'react'
import { Table, ConfigProvider } from 'antd'
import AEmpty from "Src/components/Empty"
import './index.scss'
import { useTranslation } from 'react-i18next'
import { intlFloorFormat } from 'Utils/bigNumber'
import config from 'Src/config/constants'
import { useHistory } from 'react-router-dom'
import { formatTime, formatTokenId } from 'Utils/utils'
import InfiniteScroll from "react-infinite-scroll-component"

const iconClass = (item: any) => {
  switch (item.method) {
    case 8:
      return 'minto'
    case 0:
      return 'listing'
    case 1:
      return 'cancel'
    case 2:
      return 'match'
    case 4:
      return 'minto'
    case 5:
      return 'listing'
    case 3:
    case 4:
    case 6:
    case 7:
    case 10:
      return 'transfer'
    default:
      return 'minto'
  }
}

export const TradingList = (props: any) => {
  const { handleMoreChange, total = 0 } = props || {}
  const { t } = useTranslation()
  const history = useHistory()
  const _chainId = window?.provider?.chainId
  const chainId = parseInt(_chainId)
  const linkEth = (config as any)[chainId]?.BLOCKCHAIN_LINK
  const [tradingHistoryData, setTradingHistoryData] = useState<any>([])
  const [hasMore, setHasMore] = useState(true)
  useEffect(() => {
    setTradingHistoryData(props?.TradingData)
  }, [props])

  const showEventName = (method: any) => {
    switch (method) {
      case 8:
        return t('marketplace.details.mintTo')
      case 0:
        return t('marketplace.details.listings')
      case 1:
        return t('marketplace.details.cancel')
      case 2:
        return t('marketplace.details.trade')
      case 8:
        return t('marketplace.details.batchMintTo')
      case 5:
        return t('marketplace.details.updatePrcie')
      case 3:
      case 4:
      case 6:
      case 7:
      case 10:
        return t('marketplace.details.transfer')
    }
  }

  const handleChangeFromRoute = (item: any) => {
    switch (item.method) {
      case 8:
        return false
      default:
        return history.push(`/account/0/${item?.fromAddr}`)
    }
  }
  const handleChangeToRoute = (item: any) => {
    return history.push(`/account/0/${item?.toAddr}`)
  }

  const fetchMoreData = () => {
    if (total <= 20) {
      setHasMore(false)
      return
    }
    setTimeout(() => {
      handleMoreChange && handleMoreChange()
    }, 500)
  }

  const columns: any = [
    {
      width: 150,
      title: t('marketplace.details.transaction'),
      render: (r: string, t: any) => {
        return <>
          <img src={require(`Src/assets/marketPlace/${iconClass(t)}.png`)} className='svg-img-16' alt='' />
          <span>{showEventName(t.method)}</span>
        </>
      }
    },
    {
      width: 120,
      title: 'Item',
      render: (r: string, t: any) => {
        return <div className='item-info'>
          <img src={t.imageUrl} className='svg-img-16' alt='' />
          <div className='info'>
            <p>{formatTokenId(t.nmName, t.tokenId)}</p>
            <span>{t.collectionName}</span>
          </div>
        </div>
      }
    },
    {
      width: 120,
      title: t('marketplace.price'),
      render: (r: string, t: any) => {
        return <>
          <img src={require('Src/assets/coin/aitd.svg')} alt='' className='svg-img' />
          {t.price == null ? '--' : intlFloorFormat(t.price, 4)}
        </>
      }
    },
    {
      width: 120,
      title: t('marketplace.details.amount'),
      dataIndex: 'amount',
    },
    {
      width: 120,
      title: t('marketplace.from'),
      render: (r: string, t: any) => {
        return <a onClick={() => handleChangeFromRoute(t)}>{t?.fromAddr?.substr(2, 6)}</a>
      }
    },
    {
      width: 120,
      title: t('marketplace.to'),
      render: (r: string, t: any) => {
        return <a onClick={() => handleChangeToRoute(t)}>{t?.toAddr?.substr(2, 6)}</a>
      }
    },
    {
      width: 120,
      title: t('common.date'),
      render: (_: any, item: any) => {
        return (
          <a
            href={item.txHash ? linkEth + 'tx/' + item.txHash : ''}
            target={item.txHash ? '_blank' : ''}
            rel='noreferrer'
            className='dataTime'
          >
            {formatTime(item.createDate)}
            {item.txHash && <img src={require('Src/assets//marketPlace/icon-link.png')} style={{ marginLeft: 10 }} alt='' />}
          </a>
        )
      },
    },

  ]

  return (
    <div className='trading-content'>
      <div className='trading-table'>
        {tradingHistoryData.length > 0 &&
          <InfiniteScroll
            dataLength={tradingHistoryData.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={false}
            height={tradingHistoryData.length > 8 ? 575 : "auto"}
          >
            <ConfigProvider renderEmpty={() => <AEmpty style={{ heigth: '200px' }} />}>
              <Table
                columns={columns}
                dataSource={tradingHistoryData}
                size="small"
                pagination={false}
                className={'tradingTable'}
              />
            </ConfigProvider>
          </InfiniteScroll>
        }
      </div>
    </div>
  )

}

export default TradingList