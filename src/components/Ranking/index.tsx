import useWindowDimensions from '../../utils/layout'
import { useTranslation, Trans } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import { Table, TableProps } from 'antd'
import './index.scss'
import { intlFloorFormat, NumUnitFormat } from 'Utils/bigNumber'

const aitdIcon = require('Src/assets/coin/aitd.svg')
export const Ranking = (props: any) => {
  console.log(props, 'IPropsIProps')
  const { t } = useTranslation()
  const [paginationBoolean, setPaginationBoolean] = useState(false)
  const [total, setTotal] = useState(20)
  useEffect(() => {
    console.log(props.paginationBoolean, 'paginationBoolean')
    setPaginationBoolean(props.paginationBoolean)
  }, [props])

  const dataSource = [
    {
      key: '1',
      name: 'Rug Radio Faces ',
      cover: "https://aitd-nft-images-test.s3.amazonaws.com/287fa753ef964516a5555dcd65ab2ca5.png",
      price: '10',
      oneTradingVolume: "52",
      seTradingVolume: "3445",
      threeTradingVolume: "34435",
      TradingVolume: "343445",
      PendingOrderVolume: '343434',
      total: "232323344",
    },
    {
      key: '1',
      name: '@marterium',
      cover: "https://aitd-nft-images-test.s3.amazonaws.com/287fa753ef964516a5555dcd65ab2ca5.png",
      price: '10',
      oneTradingVolume: "52",
      seTradingVolume: "3445",
      threeTradingVolume: "34435",
      TradingVolume: "343445",
      PendingOrderVolume: '343434',
      total: "232323344",
    },
  ]
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
  const columns: any = [
    {
      title: '集合系列',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any, index: string) => {
        return <div className='item-info'>
          <p>{index + 1}</p>
          <img src={record.cover} />
          <p>{record.name}</p>
        </div>
      }

    },
    {
      title: '地板价',
      dataIndex: 'price',
      key: 'price',
      render: (t: string, r: any) => {
        return <div className='item-number'>
          <img src={aitdIcon} alt="" />
          <span>{t}</span>
        </div>
      }
    },
    {
      title: '1天交易量',
      dataIndex: 'oneTradingVolume',
      key: 'oneTradingVolume',
      render: (t: string, r: any) => {
        return <div className='item-number'>
          <img src={aitdIcon} alt="" />
          <span>{r.oneTradingVolume}</span>
        </div>
      }
    },
    {
      title: '7天交易量',
      dataIndex: 'seTradingVolume',
      key: 'seTradingVolume',
      render: (t: string, r: any) => {
        return <div className='item-number'>
          <img src={aitdIcon} alt="" />
          <span>{r.seTradingVolume}</span>
        </div>
      }
    },
    {
      title: '30天交易量',
      dataIndex: 'threeTradingVolume',
      key: 'threeTradingVolume',
      render: (t: string, r: any) => {
        return <div className='item-number'>
          <img src={aitdIcon} alt="" />
          <span>{t}</span>
        </div>
      }
    },
    {
      title: '总交易量',
      dataIndex: 'TradingVolume',
      key: 'TradingVolume',
      render: (t: string, r: any) => {
        return <div className='item-number'>
          <img src={aitdIcon} alt="" />
          <span>{r.TradingVolume}</span>
        </div>
      }
    },
    {
      title: '挂单量',
      dataIndex: 'PendingOrderVolume',
      key: 'PendingOrderVolume',
    },
    {
      title: '总数',
      dataIndex: 'total',
      key: 'total',
      render: (t: string, r: any) => {
        return NumUnitFormat(t)
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
      // onChange: (page: number) => loadData(page),
    }

  }
  return (
    <>
      <div className='ranking-waper'>
        <Table dataSource={dataSource} columns={columns} className={'rankingTable'} pagination={paginationBoolean === false ? false : pagination()} ></Table>
      </div>
    </>
  )
}

// export default Ranking
