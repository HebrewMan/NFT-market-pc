import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatAdd } from '../../utils'
import config from 'Src/config/constants'
import './index.scss'
import { Table, Button, message } from 'antd'
import { getOrderList } from 'Src/api/order'
import BugModal from '../bugModal'
import { getCookie } from 'Utils/utils'
import { useHistory } from 'react-router-dom'
import { isProd } from 'Src/config/constants'
import instanceLoading from 'Utils/loading'
import { cancelMarketItem } from 'Src/hooks/marketplace'
import useWeb3 from 'Src/hooks/useWeb3'
import UpdatePriceModal from '../UpdatePriceModal'

export const DescInfo = (props: any) => {
  const [type, setType] = useState(0)
  const { t } = useTranslation()

  return (
    <div className='desc-information'>
      <div className='information-list'>
        {/* list 只有1155 才显示 */}
        {props?.DetailData.contractType === "ERC1155" && (
          <div className={`list-inner ${type === 0 ? 'active' : ''}`} onClick={() => setType(0)}>
            <div className='list-title title-point'>
              <h2>{t('marketplace.details.list')}</h2>
            </div>
          </div>
        )}

        {/* desc */}
        <div className={`list-inner ${type === 1 ? 'active' : ''}`} onClick={() => setType(1)}>
          <div className='list-title title-point'>
            <h2>{t('marketplace.details.description')}</h2>
          </div>
        </div>

        <div className={`list-inner ${type === 2 ? 'active' : ''}`} onClick={() => setType(2)}>
          <div className='list-title title-point'>
            <h2>{t('marketplace.details.properties')}</h2>
          </div>
        </div>
        <div className={`list-inner ${type === 4 ? 'active' : ''}`} onClick={() => setType(4)}>
          <div className='list-title title-point'>
            <h2>{t('marketplace.details.info')}</h2>
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
  const { metadata, collectionsData } = props
  const list = metadata.propertyList || []
  const { contractAddr, tokenId } = props
  const [dataSource, setDataSource] = useState([]) //list
  const [ModalOpen, setModalOpen] = useState(false) //购买弹窗
  const [DetailData, setDetailData] = useState([])
  const walletAccount = localStorage.getItem('wallet') || ''
  const token = getCookie('web-token') || ''
  const chainId = parseInt(window?.ethereum?.chainId, 16)
  const marketPlaceContractAddr = (config as any)[chainId]?.MARKET_ADDRESS
  const [isOpen, setIsOpen] = useState(false)
  const [sellOrderFlag, setSellOrderFlag] = useState<boolean>(false)

  // 获取订单列表
  useEffect(() => {
    tokenId && IntGetOrderList()
  }, [tokenId])

  const IntGetOrderList = async () => {
    const useParams = {
      tokenId: tokenId,
      contractAddr: contractAddr,
      page: 1,
      size: 10,
    }
    const data: any = await getOrderList(useParams)
    setDataSource(data.data.records)

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
        web3,
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
      title: 'Price',
      dataIndex: 'price',
      render: (r: string, t: any) => {
        return <>{t.price + ' ' + t.coin}</>
      }
    },
    {
      title: 'Amount',
      dataIndex: 'leftAmount',
    },
    {
      title: 'Address',
      dataIndex: 'ownerAddr',
      render: (r: string, t: any) => {
        return t.ownerAddr?.substring(0, 6)
      }
    },
    {
      width: 170,
      title: '',
      dataIndex: 'status',
      align: 'right',
      render: (text: string, record: any) => {
        return <div>
          {record.ownerAddr === walletAccount ?
            <div className='flex'>
              <Button size={'small'} onClick={() => getCancelSellOrder(record)}>{t('common.cancel')}</Button>
              <Button size={'small'} onClick={() => getSellUpdate(record)} style={{ marginLeft: '10px' }}>{'Update'}</Button>
            </div>
            : <Button size={'small'} onClick={() => handleBuy(record)}>{t('common.buy')}</Button>}
        </div>
      }
    },
  ]


  // 多订单
  const handlerMultipleOrders = () => {
    return (
      <div className='MultipleOrders'>
        <Table columns={columns} dataSource={dataSource} size="small" pagination={false} className={'TableWaper'} />
        {ModalOpen && <BugModal visible={ModalOpen} onCancel={() => setModalOpen(false)} data={DetailData} />}
        {/* 上架改价 */}
        {isOpen && <UpdatePriceModal isOpen={isOpen} sellOrderFlag={sellOrderFlag} data={DetailData} onCancel={() => setIsOpen(false)} updateGoods={updateGoods} />}
      </div>
    )
  }


  if (props.type === 0) {
    return handlerMultipleOrders()
  }
  else if (props.type === 1) {
    return (
      <div className='content-wrap desc'>
        <div className='list-content'>
          <p>{props.description}</p>
        </div>
      </div>
    )
  } else if (props.type === 2) {
    const listItem = () =>
      list.map((item: any, index: number) => {
        return (
          <div className='content' key={index}>
            <p className='colour'>{item.traitType}</p>
            <h2>{item.value}</h2>
          </div>
        )
      })
    return <div className='content-wrap properties'>{listItem()}</div>
  } else if (props.type === 4) {
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
            <p>ERC-1155</p>
            <p>AITD</p>
          </div>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}
