import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import './index.scss'
import { useHistory } from 'react-router-dom'
import { getMyGatherList } from 'Src/api/collection'
import AEmpty from 'Src/components/Empty'
import { NumUnitFormat, intlFloorFormat } from 'Utils/bigNumber'

export const GatherList: React.FC<any> = () => {
  const history = useHistory()
  const total = 11
  const curPage = 1
  const [gatherListData, setGatherListData] = useState<any>([])
  // 初始化
  useEffect(() => {
    getGatherData()
  }, [])

  // 获取集合数据
  const getGatherData = async () => {
    const data: any = await getMyGatherList()
    setGatherListData(data.data)
  }

  const handleChnage = (e: any, item: any) => {
    e.stopPropagation()
    history.push({
      pathname: "/gather-detail",
      state: { item }
    })
  }

  const dataSource = [{
    price: '5 USDT',
    amount: 32,
    title: 'AUDFYSDSYJFFD',
    totalPrice: '302',
    RoyaltyIncome: '1.524  ETH',
    time: '2021-12-10'

  }, {
    price: '5 USDT',
    amount: 32,
    title: 'AUDFYSDSYJFFD',
    totalPrice: '302',
    RoyaltyIncome: '1.524 ETH',
    time: '2021-12-10'

  }, {
    price: '5 USDT',
    amount: 32,
    title: 'AUDFYSDSYJFFD',
    totalPrice: '302',
    RoyaltyIncome: '1.524 ETH',
    time: '2021-12-10'

  }, {
    price: '5 USDT',
    amount: 32,
    title: 'AUDFYSDSYJFFD',
    totalPrice: '302',
    RoyaltyIncome: '1.524 ETH',
    time: '2021-12-10'

  }, {
    price: '5 USDT',
    amount: 32,
    title: 'AUDFYSDSYJFFD',
    totalPrice: '302',
    RoyaltyIncome: '1.524 ETH',
    time: '2021-12-10'

  }, {
    price: '5 USDT',
    amount: 32,
    title: 'AUDFYSDSYJFFD',
    totalPrice: '302',
    RoyaltyIncome: '1.524 ETH',
    time: '2021-12-10'

  }, {
    price: '5 USDT',
    amount: 32,
    title: 'AUDFYSDSYJFFD',
    totalPrice: '302',
    RoyaltyIncome: '1.524 ETH',
    time: '2021-12-10'

  }, {
    price: '5 USDT',
    amount: 32,
    title: 'AUDFYSDSYJFFD',
    totalPrice: '302',
    RoyaltyIncome: '1.524 ETH',
    time: '2021-12-10'

  }, {
    price: ' 5USDT',
    amount: 32,
    title: 'AUDFYSDSYJFFD',
    totalPrice: '302',
    RoyaltyIncome: '1.524 ETH',
    time: '2021-12-10'

  }]
  const columns = [
    {
      id: 1,
      title: 'NFTs名称',
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
      title: '单价',
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
      title: '数量',
      dataIndex: 'amount',
    },
    {
      id: 4,
      title: '总成交价',
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
      title: '版税收益',
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
      title: '时间',
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
      current: curPage,
      total: total,
      hideOnSinglePage: true,
      showSizeChanger: false,
      // onChange: (page: number) => loadData(page),
    }
  }

  const handleEditChnage = (e: any, id: any) => {
    e.stopPropagation()
    history.push(`/gather-edit/${id}`)
  }

  return (
    <div className='gatherList-waper'>
      <div className='gatherListTitle'>我的集合</div>
      <div className='gatherList'>
        {gatherListData.length > 0 ?
          <>
            {
              gatherListData.map((item: any, index: string) => {
                return (
                  <div className='gatherList-item' onClick={(e) => handleChnage(e, item)} key={index}>
                    <div className='item-img'>
                      <img src={item.coverUrl} alt="" className='img-cover' />
                      {item.createAddr === item.ownerAddr && <img src={require('Src/assets/common/edit.png')} alt="" className='img-edit' onClick={(e) => handleEditChnage(e, '2')} />}
                    </div>
                    <div className='item-info'>
                      <img src={item.headUrl} alt="" />
                      <p>{item.name} </p>
                    </div>
                    <div className='item-centen'>
                      <section>
                        <div className='label'>地板价</div>
                        <p><img src={require('Src/assets/coin/aitd.svg')} alt="icon" className='coin'></img>{intlFloorFormat(item.lowestPrice)}</p>
                      </section>
                      <section>
                        <div className='label'>总成交量</div>
                        <p><img src={require('Src/assets/coin/aitd.svg')} alt="icon" className='coin'></img>{NumUnitFormat(item.totalTransaction)}</p>
                      </section>
                      <section>
                        <div className='label'>总数</div>
                        <p>{NumUnitFormat(item.totalTokens)}</p>
                      </section>
                    </div>
                  </div>
                )
              })
            }
          </>
          : <AEmpty description="暂无集合" />}
      </div>

      <div className='gatherListTitle'>版税收益</div>
      <div className='royaltiesTop'>
        <div>
          <p className='name'>总版税收益</p>
          <section className='price'>52.854854 ETH</section>
        </div>
        <div>
          <p className='name'>总版税收益</p>
          <section className='price'>52.854854 ETH</section>
        </div>
      </div>
      <div className='TableWaper'>
        <Table columns={columns} dataSource={dataSource} className="gatgerTable" pagination={pagination()} />
      </div>
    </div>
  )
}

// export default GatherList
