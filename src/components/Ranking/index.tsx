
import { useTranslation, Trans } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Table, ConfigProvider } from 'antd'
import AEmpty from "Src/components/Empty"
import './index.scss'
import { intlFloorFormat, NumUnitFormat } from 'Utils/bigNumber'
import { getRankingsList } from 'Src/api/rankings'

const aitdIcon = require('Src/assets/coin/aitd.svg')
export const Ranking = (props: any) => {
  const { t } = useTranslation()
  const history = useHistory()
  const [paginationBoolean, setPaginationBoolean] = useState(false)
  const [total, setTotal] = useState(0)
  const [dataSource, setDataSource] = useState([])
  const [page, setPage] = useState(1)
  const [current, setCurrent] = useState(1)
  const size = 20
  useEffect(() => {
    setPaginationBoolean(props.paginationBoolean)
    initData(1)
  }, [props])

  //修改分页文案
  useEffect(() => {
    //1.需要再页面渲染完之后再去修改，所以再dataSource.length > 0 之后
    //2.如果小于10条，或者不到一页的情况下，这个是默认不展示跳转到多少页的，这样找不到类名就会报错，
    // 所以加上了document.getElementsByClassName("ant-pagination-options-quick-jumper")[0]的判断。，有则修改，否则反之
    if (dataSource.length > 0 && document.getElementsByClassName("ant-pagination-options-quick-jumper")[0]) {
      document.getElementsByClassName("ant-pagination-options-quick-jumper")[0].childNodes[0].nodeValue = t('ranking.goTo')
      document.getElementsByClassName("ant-pagination-options-quick-jumper")[0].childNodes[2].nodeValue = t('ranking.page')
    }
  }, [dataSource])


  const initData = async (page: number) => {
    const { data }: any = await getRankingsList({
      page,
      size: props.paginationBoolean ? size : 5
    })
    setCurrent(data.current)
    setTotal(data.total)
    setDataSource(data?.records)
  }

  const columns: any = [
    {
      title: t('ranking.collection'),
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (text: string, record: any, index: string) => {
        return <div className='item-info'>
          <p>{(page - 1) * size + (index + 1)}</p>
          <img src={record.headUrl} />
          <p>{record.name}</p>
        </div>
      }

    },
    {
      title: t('gather.priceFloor'),
      dataIndex: 'lowestPrice',
      key: 'lowestPrice',
      render: (t: string, r: any) => {
        return <div className='item-number'>
          <img src={aitdIcon} alt="" />
          <span>{intlFloorFormat(r.lowestPrice, 4)}</span>
        </div>
      }
    },
    {
      title: t('ranking.volume', { day: 1 }),
      dataIndex: 'day1totalTransaction',
      key: 'day1totalTransaction',
      render: (t: string, r: any) => {
        return <div className='item-number'>
          <img src={aitdIcon} alt="" />
          <span>{intlFloorFormat(r.day1totalTransaction, 2)}</span>
        </div>
      }
    },
    {
      title: t('ranking.volume', { day: 7 }),
      dataIndex: 'day7totalTransaction',
      key: 'day7totalTransaction',
      render: (t: string, r: any) => {
        return <div className='item-number'>
          <img src={aitdIcon} alt="" />
          <span>{intlFloorFormat(r.day7totalTransaction, 2)}</span>
        </div>
      }
    },
    {
      title: t('ranking.volume', { day: 30 }),
      dataIndex: 'day30totalTransaction',
      key: 'totalTransaction',
      render: (t: string, r: any) => {
        return <div className='item-number'>
          <img src={aitdIcon} alt="" />
          <span>{intlFloorFormat(r.day30totalTransaction, 2)}</span>
        </div>
      }
    },
    {
      title: t('gather.totalVolume'),
      dataIndex: 'totalTransaction',
      key: 'totalTransaction',
      render: (t: string, r: any) => {
        return <div className='item-number'>
          <img src={aitdIcon} alt="" />
          <span>{intlFloorFormat(r.totalTransaction, 2)}</span>
        </div>
      }
    },
    {
      title: t('ranking.listed'),
      dataIndex: 'totalOrder',
      key: 'totalOrder',
      render: (t: string, r: any) => {
        return NumUnitFormat(r.totalOrder)
      }
    },
    {
      title: t('gather.totalNum'),
      dataIndex: 'totalTokens',
      key: 'totalTokens',
      render: (t: string, r: any) => {
        return NumUnitFormat(r.totalTokens)
      }
    },
  ]
  const pageChange = (page: number) => {
    setPage(page)
    initData(page)
  }
  // 分页
  const pagination = () => {
    if (total < 20) {
      return false
    }
    return {
      pageSize: 20,
      showTitle: false,
      // current: props.ATMHistory.curPage,
      total: total,
      hideOnSinglePage: true,
      showSizeChanger: false,
      showQuickJumper: true,
      onChange: (page: number) => pageChange(page),
    }
  }

  const onSelectRow = (record: any) => {
    history.push(`/collection/${record.linkCollection}`)
  }

  return (
    <>
      <div className='ranking-waper'>
        <ConfigProvider renderEmpty={() => <AEmpty style={{ heigth: '200px' }} />}>
          <Table
            dataSource={dataSource}
            columns={columns}
            className={'rankingTable'}
            pagination={paginationBoolean === false ? false : pagination()}
            onRow={(record) => ({
              onClick: () => onSelectRow(record)
            })}>
          </Table>
        </ConfigProvider>

      </div>
    </>
  )
}

// export default Ranking
