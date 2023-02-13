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
import dayjs from 'dayjs'

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
  }, [])

  useEffect(() => {
    loadData(page)
  }, [page])

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
    setTotal(dataList?.data.total)
    setDataSource(dataList?.data.records)

  }

  const handleChnage = (e: any, item: any) => {
    e.stopPropagation()
    history.push(`/collection/${item.linkCollection}`)
  }

  const columns = [
    {
      id: 1,
      title: t('gather.NFTName'),
      dataIndex: 'tokenName',
      render: (t: string, r: any) => {
        return (
          <>
            {r.tokenImageUrl != null && <img src={r.tokenImageUrl} alt="" className='tbaleCover' />}
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
            {intlFloorFormat(t, 4)}
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
      dataIndex: 'totalTrans',
      render: (t: string) => {
        return (
          <>
            <img src={require('Src/assets/coin/aitd.svg')} alt="" className='tbaleCoin' />
            {intlFloorFormat(t, 4)}
          </>
        )
      },
    },
    {
      id: 5,
      title: t('gather.royaltyEarnings'),
      dataIndex: 'royalty',
      render: (t: string) => {
        return (
          <>
            <img src={require('Src/assets/coin/aitd.svg')} alt="" className='tbaleCoin' />
            {intlFloorFormat(t, 4)}
          </>
        )
      },
    },
    {
      id: 6,
      title: t('gather.time'),
      dataIndex: 'createDate',
    }
  ]

  // 分页
  const pagination = () => {
    if (total < 10) {
      return false
    }
    return {
      pageSize: 10,
      // current: props.ATMHistory.curPage,
      total: total,
      hideOnSinglePage: true,
      showSizeChanger: false,
      onChange: (page: number) => loadData(page),
    }
  }
  const handleEditChnage = (e: any, linkCollection: any) => {
    e.stopPropagation()
    history.push({
      pathname: `/collection-edit/${linkCollection}`,
      state: { from: 'list' }
    })

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
                      {<img src={require('Src/assets/common/edit.png')} alt="" className='img-edit' onClick={(e) => handleEditChnage(e, item.linkCollection)} />}
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
