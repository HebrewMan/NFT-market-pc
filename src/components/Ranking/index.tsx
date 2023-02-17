import useWindowDimensions from '../../utils/layout'
import { useTranslation, Trans } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Table, TableProps } from 'antd'
import './index.scss'
import { intlFloorFormat, NumUnitFormat } from 'Utils/bigNumber'
import { getRankingsList } from 'Src/api/rankings'

const aitdIcon = require('Src/assets/coin/aitd.svg')
export const Ranking = (props: any) => {
  console.log(props, 'IPropsIProps')
  const { t } = useTranslation()
  const history = useHistory()
  const [paginationBoolean, setPaginationBoolean] = useState(false)
  const [total, setTotal] = useState(0)
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    console.log(props.paginationBoolean, 'paginationBoolean')
    setPaginationBoolean(props.paginationBoolean)
    initData(1)
  }, [props])

  //修改分页文案
  useEffect(() => {
    //1.需要再页面渲染完之后再去修改，所以再dataSource.length > 0 之后
    //2.如果小于10条，或者不到一页的情况下，这个是默认不展示跳转到多少页的，这样找不到类名就会报错，
    // 所以加上了document.getElementsByClassName("ant-pagination-options-quick-jumper")[0]的判断。，有则修改，否则反之
    if (dataSource.length > 0 && document.getElementsByClassName("ant-pagination-options-quick-jumper")[0]) {
      document.getElementsByClassName("ant-pagination-options-quick-jumper")[0].childNodes[0].nodeValue = "跳至"
      document.getElementsByClassName("ant-pagination-options-quick-jumper")[0].childNodes[2].nodeValue = "页"
    }
  }, [dataSource])


  const initData = async (page: number) => {
    const { data }: any = await getRankingsList({
      page,
      size: props.paginationBoolean ? 10 : 5
    })

    setTotal(data.total)
    setDataSource(data?.records)
  }

  const columns: any = [
    {
      title: '集合系列',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any, index: string) => {
        return <div className='item-info'>
          <p>{index + 1}</p>
          <img src={record.headUrl} />
          <p>{record.name}</p>
        </div>
      }

    },
    {
      title: '地板价',
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
      title: '1天交易量',
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
      title: '7天交易量',
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
      title: '30天交易量',
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
      title: '总交易量',
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
      title: '挂单量',
      dataIndex: 'totalOrder',
      key: 'totalOrder',
      render: (t: string, r: any) => {
        return NumUnitFormat(r.totalOrder)
      }
    },
    {
      title: '总数',
      dataIndex: 'totalTokens',
      key: 'totalTokens',
      render: (t: string, r: any) => {
        return NumUnitFormat(r.totalTokens)
      }
    },
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
      showQuickJumper: true,
      onChange: (page: number) => initData(page),
    }
  }

  const onSelectRow = (record: any) => {
    history.push(`/collection/${record.linkCollection}`)
  }

  return (
    <>
      <div className='ranking-waper'>
        <Table
          dataSource={dataSource}
          columns={columns}
          className={'rankingTable'}
          pagination={paginationBoolean === false ? false : pagination()}
          onRow={(record) => ({
            onClick: () => onSelectRow(record)
          })}>
        </Table>
      </div>
    </>
  )
}

// export default Ranking