import React, { useEffect, useState } from 'react'
import { Table, ConfigProvider } from 'antd'
import AEmpty from "Src/components/Empty"
import './index.scss'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { intlFloorFormat } from 'Utils/bigNumber'
import config from 'Src/config/constants'
import { useHistory } from 'react-router-dom'
import { formatTokenId } from 'Utils/utils'
import InfiniteScroll from "react-infinite-scroll-component"
import { formatTime } from 'Src/views/marketplace/utils'
const ZERO_ADDRESS = (config as any)?.ZERO_ADDRESS
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
  const { handleMoreChange, total = 0, showTitle = false, handleFilter } = props || {}
  const { t } = useTranslation()
  const history = useHistory()
  const _chainId = window?.provider?.chainId
  const chainId = parseInt(_chainId)
  const linkEth = (config as any)[chainId]?.BLOCKCHAIN_LINK
  const [tradingHistoryData, setTradingHistoryData] = useState<any>([])
  const [hasMore, setHasMore] = useState(true)
  const [detailsState, setDetailsState] = useState(false)
  const [eventBtn, setEventBtn] = useState<any>([])
  const [filterList, setFilterList] = useState([
    { label: '8', name: t('marketplace.details.mintTo'), checked: false },
    { label: '0', name: t('marketplace.details.listings'), checked: false },
    { label: '1', name: t('marketplace.details.cancel'), checked: false },
    { label: '2', name: t('marketplace.details.trade'), checked: false },
    // { label: '8', name: t('marketplace.details.batchMintTo'), checked: false },
    { label: '3,4,6,7,10', name: t('marketplace.details.transfer'), checked: false },
  ])
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
  const showFliterName = (method: string) => {
    console.log(method, 'method')
    switch (method) {
      case '8':
        return t('marketplace.details.mintTo')
      case '0':
        return t('marketplace.details.listings')
      case '1':
        return t('marketplace.details.cancel')
      case '2':
        return t('marketplace.details.trade')
      case '5':
        return t('marketplace.details.updatePrcie')
      case '3,4,6,7,10':
        return t('marketplace.details.transfer')
    }
  }

  const handleChangeFromRoute = (item: any, addr: string) => {
    switch (item.method) {
      case 8:
        return false
      default:
        if (window.location.pathname.indexOf('/account') != -1) {
          history.replace(`/account/0/${addr}`)
        } else {
          // if(type === 'to' && _.isNull(item.toName))
          return history.push(`/account/0/${addr}`)
        }


    }
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
  const handleChangeValue = (e: any, index: any) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    const deepList = [...filterList]
    deepList[index].checked = !deepList[index].checked
    const eventList: Array<string> = deepList
      .map((item) => (item.checked ? item.label : ''))
      .filter((item) => item.trim())
    setFilterList([...deepList])
    console.log(eventList, 'eventList')
    setEventBtn(eventList)
    filterEventData(eventList)
  }
  const filterEventData = (eventList: any) => {
    const NewArr = [...eventList]
    let list: any[] = []
    NewArr.forEach((item: any) => {
      const res = item && item.split(',')
      list = [...list, ...res]
    })
    handleFilter && handleFilter(list)
  }

  const addreNull = (item: any, addr: string, name: any, type: string) => {
    const shownName = name && !name.startsWith('0x') ? name?.substr(0, 8) : addr?.substr(2, 6)
    return (
      <>
        {addr && addr !== ZERO_ADDRESS ? (
          <a onClick={() => handleChangeFromRoute(item, addr)}>{shownName}</a>
        ) : (
          <span>{shownName || '--'}</span>
        )}
      </>
    )
    // if (_.isNull(name) && _.isNull(addr)) {
    //   return '--'
    // } else {
    //   return <a onClick={() => handleChangeFromRoute(item, name,type)}>{name?.substr(2, 6)}</a>
    // }
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
        return addreNull(t, t.fromAddr, t.fromName, "form")
        // if (t.method == 8 && _.isNull(t.fromName)) {
        //   return t?.fromAddr?.substr(2, 6)
        // } else {
        //   return addreNull(t, t.fromAddr,"form")
        // }
      }
    },
    {
      width: 120,
      title: t('marketplace.to'),
      render: (r: string, t: any) => {
        // if (t.method == 8 && _.isNull(t.toName)) {
        //   return t?.fromAddr?.substr(2, 6)
        // } else {
        return addreNull(t, t.toAddr, t.toName, "to")
        // }
      }
    },
    {
      width: 160,
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
  const Uli = () => (
    <div className='filter-checkbox'>
      <ul id='filter-checkbox-select'>
        {filterList.map((item, index) => {
          return (
            <label htmlFor={item.label} key={index} onClick={(e) => handleChangeValue(e, index)}>
              <li className={`${item.checked ? 'active' : ''}`}>
                <div className={`checkbox ${item.checked ? 'checked' : ''}`} onClick={(e) => handleChangeValue(e, index)}></div>
                <span>{item.name}</span>
              </li>
            </label>
          )
        })}
      </ul>
    </div>
  )
  const handleClearCurrent = (current: any) => {
    const currentList = eventBtn.filter((item: any) => item !== current)
    const currentFilterList = filterList.map((item) =>
      currentList.includes(item.label) ? { ...item, checked: true } : { ...item, checked: false },
    )
    setFilterList([...currentFilterList])
    setEventBtn(currentList)
    filterEventData(currentList)
  }
  const handleClearAll = () => {
    setEventBtn([])
    setFilterList(filterList.map((item) => ({ ...item, checked: false })))
    filterEventData([])
  }

  return (
    <div className={`trading-history ${!showTitle ? 'titleMargin' : ''}`}>
      <div className='list-title'>
        <section className='flex'>
          {showTitle && (
            <>
              <img src={require('Src/assets/marketPlace/tradding.png')} alt='' className='svg-default-size' />
              <h2>{t('marketplace.details.history')}</h2>
            </>
          )}

        </section>
        <div className='filter-flex'>
          <div className='details-button' id='filter-button'>
            {eventBtn.map((item: any) => (
              <button key={item} id='mintToBtn' onClick={() => handleClearCurrent(item)}>
                {showFliterName(item)} <img src={require('Src/assets/coin/icon-close.png')} width={12} alt='' />
              </button>
            ))}
            {eventBtn.length > 0 && <span onClick={handleClearAll}>{t('marketplace.details.clearAll')}</span>}
          </div>
          <div className='arrow-icon' onClick={() => setDetailsState(!detailsState)}>
            <span>{t('marketplace.details.filter')}</span>
            <img
              src={
                !detailsState
                  ? require('Src/assets/marketPlace/arrow.png')
                  : require('Src/assets/marketPlace/expand.png')
              }
              alt=''
            />
            {detailsState ? <Uli /> : <></>}
          </div>
        </div>
      </div>
      <div className='trading-content'>
        {tradingHistoryData.length > 0 ?
          <div className='trading-table'>
            <InfiniteScroll
              dataLength={tradingHistoryData.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={false}
              height={tradingHistoryData.length > 8 ? 575 : "auto"}
            >
              <Table
                columns={columns}
                dataSource={tradingHistoryData}
                size="small"
                pagination={false}
                className={'tradingTable'}
              />
            </InfiniteScroll>
          </div>
          : <AEmpty />
        }
      </div>
    </div>
  )

}

export default TradingList