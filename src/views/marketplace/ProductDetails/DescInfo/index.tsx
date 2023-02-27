import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatAdd } from '../../utils'
import config from 'Src/config/constants'
import './index.scss'
import { Table, Button, message, ConfigProvider } from 'antd'
import { getOrderList } from 'Src/api/order'
import BugModal from '../bugModal'
import { getCookie } from 'Utils/utils'
import { useHistory } from 'react-router-dom'
import { isProd } from 'Src/config/constants'
import instanceLoading from 'Utils/loading'
import { cancelMarketItem } from 'Src/hooks/marketplace'
import useWeb3 from 'Src/hooks/useWeb3'
import UpdatePriceModal from '../UpdatePriceModal'
import InfiniteScroll from "react-infinite-scroll-component"
import { intlFloorFormat } from 'Utils/bigNumber'
import AEmpty from "Src/components/Empty"

export const DescInfo = (props: any) => {
  const { contractType } = props.metadata
  const [type, setType] = useState(0)
  const { t } = useTranslation()

  useEffect(() => {
    contractType === "ERC1155" ? setType(0) : setType(1)
  }, [contractType])
  return (
    <div className='desc-information'>
      <div className='information-list'>
        {/* list 只有1155 才显示 */}
        {contractType === "ERC1155" && (
          <div className={`list-inner ${type === 0 ? 'active' : ''}`} onClick={() => setType(0)}>
            <div className='list-title title-point'>
              <h2>{t('marketplace.details.list')}</h2>
            </div>
          </div>
        )}
        <div className={`list-inner ${type === 1 ? 'active' : ''}`} onClick={() => setType(1)}>
          <div className='list-title title-point'>
            <h2>{t('marketplace.details.properties')}</h2>
          </div>
        </div>
        <div className={`list-inner ${type === 2 ? 'active' : ''}`} onClick={() => setType(2)}>
          <div className='list-title title-point'>
            <h2>{t('marketplace.details.info')}</h2>
          </div>
        </div>
        {/* desc */}
        <div className={`list-inner ${type === 3 ? 'active' : ''}`} onClick={() => setType(3)}>
          <div className='list-title title-point'>
            <h2>{t('marketplace.details.description')}</h2>
          </div>
        </div>
      </div>
      <ContentDetail {...props} type={type} />
    </div>
  )
}

const ContentDetail = (props: any) => {
  const web3 = useWeb3()
  const { t } = useTranslation()
  const history = useHistory()
  const { metadata, type } = props

  const list = metadata.propertyList || []
  const { contractAddr, tokenId, description, contractType } = metadata
  const [dataSource, setDataSource] = useState([]) //list
  const [ModalOpen, setModalOpen] = useState(false) //购买弹窗
  const [DetailData, setDetailData] = useState([])
  const walletAccount = localStorage.getItem('wallet') || ''
  const token = getCookie('web-token') || ''
  const chainId = parseInt(window?.ethereum?.chainId, 16)
  const marketPlaceContractAddr = (config as any)[chainId]?.MARKET_ADDRESS
  const [isOpen, setIsOpen] = useState(false)
  const [sellOrderFlag, setSellOrderFlag] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  // 获取订单列表
  useEffect(() => {
    tokenId != null && IntGetOrderList()
  }, [tokenId])

  const IntGetOrderList = async (curPage = 1) => {
    const useParams = {
      tokenId: tokenId,
      contractAddr: contractAddr,
      page: curPage,
      size: 20,
    }
    const data: any = await getOrderList(useParams)
    setDataSource(dataSource.concat(data.data.records))
    setTotal(data.data.total)
  }
  // 购买
  const handleBuy = (record: any) => {
    setModalOpen(true)
    setDetailData(record)
  }
  // 取消上架
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
        window.location.reload()
      }
      instanceLoading.close()
    } catch (error: any) {
      instanceLoading.close()
    }
  }
  // 改价
  const getSellUpdate = (item: any) => {
    setIsOpen(true)
    setDetailData(item)
  }

  const updateGoods = () => {
    window.location.reload()
  }
  // columns
  const columns: any = [
    {
      width: 150,
      title: t('marketplace.details.unitPrice'),
      dataIndex: 'price',
      render: (r: string, t: any) => {
        return <span className='textWidth'>{intlFloorFormat(t.price, 4) + ' ' + t.coin}</span>
      }
    },
    {
      width: 120,
      title: t('marketplace.details.amount'),
      dataIndex: 'leftAmount',
    },
    {
      width: 120,
      title: t('marketplace.Owner'),
      dataIndex: 'ownerAddr',
      render: (r: string, t: any) => {
        return t.ownerAddr?.substring(0, 6)
      }
    },
    {
      title: '',
      dataIndex: 'status',
      align: 'right',
      render: (text: string, record: any) => {
        return <div>
          {record.ownerAddr === walletAccount ?
            <div className='flex'>
              <Button size={'small'} onClick={() => getCancelSellOrder(record)}>{t('common.cancel')}</Button>
              <Button size={'small'} onClick={() => getSellUpdate(record)} style={{ marginLeft: '10px' }}>{t('marketplace.details.updatePrcie')}</Button>
            </div>
            : <Button size={'small'} onClick={() => handleBuy(record)}>{t('common.buy')}</Button>}
        </div>
      }
    },
  ]

  const fetchMoreData = () => {
    if (total <= 20) {
      setHasMore(false)
      return
    }
    setTimeout(() => {
      setPage(page + 1)
      IntGetOrderList(page + 1)
    }, 500)
  }

  // 多订单
  const handlerMultipleOrders = () => {
    return (
      <div className='MultipleOrders'>
        <InfiniteScroll
          dataLength={dataSource.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={false}
          height={dataSource.length > 0 ? 225 : 300}
        >
          <ConfigProvider renderEmpty={() => <AEmpty style={{ heigth: '200px' }} />}>
            <Table
              columns={columns}
              dataSource={dataSource}
              size="small"
              pagination={false}
              className={'TableWaper'}
            />
          </ConfigProvider>
        </InfiniteScroll>
        {ModalOpen && <BugModal visible={ModalOpen} onCancel={() => setModalOpen(false)} data={DetailData} />}
        {/* 上架改价 */}
        {isOpen && <UpdatePriceModal isOpen={isOpen} sellOrderFlag={sellOrderFlag} data={DetailData} onCancel={() => setIsOpen(false)} updateGoods={updateGoods} />}
      </div>
    )
  }


  if (type === 0) {
    return handlerMultipleOrders()
  }
  else if (type === 3) {
    return (
      <div className='content-wrap desc'>
        <div className='list-content'>
          <p>{description}</p>
        </div>
      </div>
    )
  } else if (type === 1) {
    const listItem = () =>
      list.map((item: any, index: number) => {
        return (
          <div className='content' key={index}>
            <p className='colour'>{item.name}</p>
            <h2>{item.value}</h2>
          </div>
        )
      })
    return <div className='content-wrap properties'>{listItem()}</div>
  } else if (type === 2) {
    const _chainId = window?.ethereum?.chainId
    const chainId = parseInt(_chainId)
    const linkEth = (config as any)[chainId]?.BLOCKCHAIN_LINK
    return (
      <div className='content-wrap detail'>
        <div className='list-content details'>
          <div className='details-left'>
            <p>{t('marketplace.details.address')}</p>
            <p>{t('marketplace.details.token')}</p>
            <p>{t('marketplace.details.standard')}</p>
            <p>{t('marketplace.details.blockchain')}</p>
          </div>
          <div className='details-right'>
            <a href={linkEth + 'address/' + contractAddr} target='_blank'>
              {formatAdd(contractAddr)}
            </a>
            <p>{tokenId}</p>
            <p>{contractType}</p>
            <p>AITD</p>
          </div>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}
