import React, { useEffect, useState } from 'react'
import { Table, ConfigProvider } from 'antd'
import './index.scss'
import { useHistory } from 'react-router-dom'
import { getMyGatherList } from 'Src/api/collection'
import AEmpty from 'Src/components/Empty'
import { NumUnitFormat, intlFloorFormat } from 'Utils/bigNumber'
import { getNFTRoyalty, getNFTRoyaltyList } from 'Src/api/user'
import config, { CoinType } from 'Src/config/constants'
import { useTranslation } from 'react-i18next'
import { getLocalStorage } from 'Utils/utils'

export const GatherList: React.FC<any> = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [gatherListData, setGatherListData] = useState<any>([])
  const [royaltyData, setRoyaltyData] = useState<any>({})
  const [dataSource, setDataSource] = useState<any>([])
  const account = getLocalStorage('wallet') || ''

  // 初始化
  useEffect(() => {
    getGatherData()
    // 版税信息
    getNFTRoyaltyData()
    loadData(page)

  }, [])

  // 获取集合数据
  const getGatherData = async () => {
    const data: any = await getMyGatherList()
    setGatherListData(data.data)
  }
  // 获取版税信息
  const getNFTRoyaltyData = async () => {
    const data: any = await getNFTRoyalty()
    setRoyaltyData(data.data)
  }

  const loadData = async (page: number) => {
    const params = {
      page: page,
      size: 10,
    }
    const dataList: any = await getNFTRoyaltyList(params)
    setDataSource(dataList.records)

  }

  const handleChnage = (e: any, item: any) => {
    e.stopPropagation()
    history.push(`/gather-detail/${item.id}`)
  }

  // const dataSource = [{
  //   price: '5 USDT',
  //   amount: 32,
  //   title: 'AUDFYSDSYJFFD',
  //   totalPrice: '302',
  //   RoyaltyIncome: '1.524  ETH',
  //   time: '2021-12-10'

  // }, {
  //   price: '5 USDT',
  //   amount: 32,
  //   title: 'AUDFYSDSYJFFD',
  //   totalPrice: '302',
  //   RoyaltyIncome: '1.524 ETH',
  //   time: '2021-12-10'

  // }, {
  //   price: '5 USDT',
  //   amount: 32,
  //   title: 'AUDFYSDSYJFFD',
  //   totalPrice: '302',
  //   RoyaltyIncome: '1.524 ETH',
  //   time: '2021-12-10'

  // }, {
  //   price: '5 USDT',
  //   amount: 32,
  //   title: 'AUDFYSDSYJFFD',
  //   totalPrice: '302',
  //   RoyaltyIncome: '1.524 ETH',
  //   time: '2021-12-10'

  // }, {
  //   price: '5 USDT',
  //   amount: 32,
  //   title: 'AUDFYSDSYJFFD',
  //   totalPrice: '302',
  //   RoyaltyIncome: '1.524 ETH',
  //   time: '2021-12-10'

  // }, {
  //   price: '5 USDT',
  //   amount: 32,
  //   title: 'AUDFYSDSYJFFD',
  //   totalPrice: '302',
  //   RoyaltyIncome: '1.524 ETH',
  //   time: '2021-12-10'

  // }, {
  //   price: '5 USDT',
  //   amount: 32,
  //   title: 'AUDFYSDSYJFFD',
  //   totalPrice: '302',
  //   RoyaltyIncome: '1.524 ETH',
  //   time: '2021-12-10'

  // }, {
  //   price: '5 USDT',
  //   amount: 32,
  //   title: 'AUDFYSDSYJFFD',
  //   totalPrice: '302',
  //   RoyaltyIncome: '1.524 ETH',
  //   time: '2021-12-10'

  // }, {
  //   price: ' 5USDT',
  //   amount: 32,
  //   title: 'AUDFYSDSYJFFD',
  //   totalPrice: '302',
  //   RoyaltyIncome: '1.524 ETH',
  //   time: '2021-12-10'

  // }]
  const columns = [
    {
      id: 1,
      title: t('gather.NFTName'),
      dataIndex: 'title',
      render: (t: string) => {
        return (
          <>
            <img src="" alt="" className='tbaleCover' />
            {t}
          </>
        )
      },
    },
    {
      id: 2,
      title: t('gather.price'),
      dataIndex: 'price',
      render: (t: string) => {
        return (
          <>
            <img src={require('Src/assets/coin/aitd.svg')} alt="" className='tbaleCoin' />
            {t}
          </>
        )
      },
    },
    {
      id: 3,
      title: t('gather.amount'),
      dataIndex: 'amount',
    },
    {
      id: 4,
      title: t('gather.totalPrice'),
      dataIndex: 'totalPrice',
      render: (t: string) => {
        return (
          <>
            <img src={require('Src/assets/coin/aitd.svg')} alt="" className='tbaleCoin' />
            {t}
          </>
        )
      },
    },
    {
      id: 5,
      title: t('gather.royaltyEarnings'),
      dataIndex: 'RoyaltyIncome',
      render: (t: string) => {
        return (
          <>
            <img src={require('Src/assets/coin/aitd.svg')} alt="" className='tbaleCoin' />
            {t}
          </>
        )
      },
    },
    {
      id: 6,
      title: t('gather.time'),
      dataIndex: 'time',
    }
  ]

  // 分页
  const pagination = () => {
    if (total < 10) {
      return false
    }
    return {
      pageSize: 10,
      current: page,
      total: total,
      hideOnSinglePage: true,
      showSizeChanger: false,
      onChange: (page: number) => loadData(page),
    }
  }
  const handleEditChnage = (e: any, id: any) => {
    e.stopPropagation()
    history.push(`/gather-edit/${id}`)
  }

  return (
    <div className='gatherList-waper'>
      <div className='gatherListTitle'>{t('gather.title')}</div>
      <div className='gatherList'>
        {gatherListData.length > 0 ?
          <>
            {
              gatherListData.map((item: any, index: string) => {
                return (
                  <div className='gatherList-item' onClick={(e) => handleChnage(e, item)} key={index}>
                    <div className='item-img'>
                      <img src={item.coverUrl} alt="" className='img-cover' />
                      {item.ownerAddr === account && <img src={require('Src/assets/common/edit.png')} alt="" className='img-edit' onClick={(e) => handleEditChnage(e, item.id)} />}
                    </div>
                    <div className='item-info'>
                      <img src={item.headUrl} alt="" />
                      <p>{item.name} </p>
                    </div>
                    <div className='item-centen'>
                      <section>
                        <div className='label'>{t('gather.priceFloor')}</div>
                        <p><img src={require('Src/assets/coin/aitd.svg')} alt="icon" className='coin'></img>{intlFloorFormat(item.lowestPrice, 4)}</p>
                      </section>
                      <section>
                        <div className='label'>{t('gather.totalVolume')}</div>
                        <p><img src={require('Src/assets/coin/aitd.svg')} alt="icon" className='coin'></img>{NumUnitFormat(item.totalTransaction)}</p>
                      </section>
                      <section>
                        <div className='label'>{t('gather.totalNum')}</div>
                        <p>{NumUnitFormat(item.totalTokens)}</p>
                      </section>
                    </div>
                  </div>
                )
              })
            }
          </>
          : <AEmpty description={t('gather.noCollectionData')} />}
      </div>

      <div className='gatherListTitle'>{t('gather.royaltyEarnings')}</div>
      <div className='royaltiesTop'>
        <div>
          <p className='name'>{t('gather.totalRoyaltyEarnings')}</p>
          <section className='price'>{intlFloorFormat(royaltyData?.totalTrans, 4)} {CoinType.AITD}</section>
        </div>
        <div>
          <p className='name'>{t('gather.todayRoyaltyEarnings')}</p>
          <section className='price'>{intlFloorFormat(royaltyData?.totalTransToday, 4)} {CoinType.AITD}</section>
        </div>
      </div>
      <div className='TableWaper'>
        <ConfigProvider renderEmpty={() => <AEmpty description={t('gather.noTemporarily')} />}>
          <Table columns={columns} dataSource={dataSource} className="gatgerTable" pagination={pagination()} />
        </ConfigProvider>
      </div>
    </div>
  )
}

// export default GatherList
