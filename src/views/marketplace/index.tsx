import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Select } from './Select'
import { HeaderSearch } from '../../components/HeaderSearch'
import { useTranslation } from 'react-i18next'
import { getGoods, getListedNftList } from '../../api'
import { useTouchBottom } from '../../hooks'
import { defaultParams, blindType, queryList } from '../../core/constants/marketplace'
import './index.scss'
import { Input, Spin } from 'antd'
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons'
import { intlFloorFormat } from 'Utils/bigNumber'
import ListItem from 'Src/components/ListItem'
import AEmpty from "Src/components/Empty"
import { formatTokenId } from 'Utils/utils'
import { useHistory } from 'react-router-dom'
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

export const MarketPlace = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const [goodsList, setGoodsList] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [grid, setGrid] = useState(localStorage.getItem('listItenGrid'))
  const [params, setParams] = useState<any>({ ...defaultParams })
  const [collect, setCollect] = useState(false) // 收藏状态
  const [keyWord, setKeyWord] = useState('')
  const [inputMin, setInputMin] = useState('')
  const [inputMax, setInputMax] = useState('')
  const [isMore, setIsMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<any>("new")
  const [ownerAddr, setOwnerAddr] = useState('')
  const queryList = [
    { name: `${t('marketplace.recentlyListed')}`, value: 'new' },
    { name: `${t('marketplace.LowToHigh')}`, value: 'low' },
    { name: `${t('marketplace.highToLow')}`, value: 'high' },
  ]

  useEffect(() => {
    initData(params)
  }, [params, collect])

  const initData = async (data: any) => {
    // const userWallet = localStorage.getItem('wallet') || null
    // const param = {
    //   ...data,
    // }
    setLoading(true)
    try {
      // getListedNftList getGoods
      const res: any = await getListedNftList(data)
      setTotal(res.data.total)

      // 过滤掉没有元数据的脏数据
      const list: any = []
      res.data.records.map((item: any, index: string) => {
        if (item?.imageUrl != null) {
          list.push(item)
        }
      })
      setGoodsList([...goodsList, ...list])
      setLoading(false)
      if (data.page >= Math.ceil(res.data.total / data.size)) {
        setIsMore(false)
      } else {
        setIsMore(true)
      }
    } catch (err: any) {
      setLoading(false)
    }
  }

  // 触底加载
  const handleLoadMore = () => {
    if (isMoreRef.current) {
      const newPage = pageRef.current + 1
      setParams((params: any) => {
        return { ...params, page: newPage }
      })
    } else {
      pageRef.current = 1
    }
  }

  const { isMoreRef, pageRef } = useTouchBottom(handleLoadMore, params.page, isMore)

  const handleChangeQuery = (itemObj: any) => {
    setSort(itemObj.value)
    setGoodsList([])
    // 原有逻辑上调整接口后台所需入参 o.xx ..不理解
    let asc = false
    if (itemObj.value === 'new') {
      asc = false
    } else {
      itemObj.value === 'high' ? asc = false : asc = true
    }
    const orders = [
      {
        asc: asc,
        column: itemObj.value === 'new' ? 'o.create_date' : 'o.price',
      },
    ]
    setParams({ ...params, orders, page: 1 })

    // useTouchBottom 页码不对的问题 修改
    if (pageRef.current > 1) {
      pageRef.current = 0
    }
  }
  const handleJump = (item: any) => {
    history.push({
      pathname: "/product-details",
      state: { orderId: item.orderId }
    })
  }
  const CardItem = () => {
    return goodsList.map((item: any, index: number) => {
      return (
        <div className='card' key={index}>
          <div onClick={() => handleJump(item)}>
            <div className='assets'>
              <img src={item.imageUrl} alt='' />
            </div>
            <div className='assets-info'>
              <div className='desc'>
                <div className='name'>{formatTokenId(item.name, item.tokenId)}</div>
              </div>
              <div className='collection-name'>{item.collectionName}</div>
              <div className='price'>
                <div className='priceCenter'>
                  <img src={require('../../assets/coin/aitd.svg')} alt='' className='coin-img' />
                  {intlFloorFormat(item.price, 4)}
                </div>

              </div>
            </div>
          </div>
        </div>
      )
    })
  }


  const getKeyWord = (value: string) => {
    setGoodsList([])
    setParams({ ...params, name: value, page: 1 })
  }

  const handleChangeMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target
    const temp = inputValue.match(/\d+(\.\d{0,8})?/)

    if (temp === null && inputMax === '') {
      setInputMin('')
      setGoodsList([])
      setParams({ ...params, maxPrice: undefined, minPrice: undefined, page: 1 })
      return
    }

    if (temp) {
      // 非法校验 输入字符砖 @等符号 取消请求
      if (temp[0] && inputMin === temp[0]) {
        return
      }

      setInputMin(temp[0])

      // max > min 取消请求
      if (Number(inputMax) < Number(temp[0])) {
        return
      }

      if (inputMax) {
        setGoodsList([])
        setParams({ ...params, minPrice: Number(temp[0]), maxPrice: Number(inputMax), page: 1 })
      }
    } else {
      setInputMin('')
    }
  }

  const handleChangeMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target
    const temp = inputValue.match(/\d+(\.\d{0,8})?/)

    if (temp === null && inputMin === '') {
      setInputMax('')
      setGoodsList([])
      setParams({ ...params, maxPrice: undefined, minPrice: undefined, page: 1 })

      return
    }

    if (temp) {
      if (temp[0] && inputMax === temp[0]) {
        return
      }

      setInputMax(temp[0])

      if (Number(inputMin) > Number(temp[0])) {
        return
      }

      if (inputMin) {
        setGoodsList([])
        setParams({ ...params, minPrice: Number(inputMin), maxPrice: Number(temp[0]), page: 1 })
      }
    } else {
      setInputMax('')
    }
  }

  return (
    <div className='marketplace'>
      <div className='filter'>
        {/* <HeaderSearch getKeyWord={getKeyWord} keyWord={keyWord} placeholder={t('marketplace.serach')} /> */}
        <section className='leftFlex'>
          <div className='condition'>
            <Select list={queryList} placeholder={t('marketplace.sortBy')} change={handleChangeQuery} value={sort} />
          </div>
          <div className='price'>
            {t('marketplace.price')}
            <Input
              className='min'
              value={inputMin}
              placeholder={t('marketplace.min') || undefined}
              style={{ width: 84, height: 41 }}
              onChange={handleChangeMin}
            />
            <span className='to'>{t('marketplace.to')}</span>
            <Input
              placeholder={t('marketplace.max') || undefined}
              value={inputMax}
              style={{ width: 84, height: 41 }}
              onChange={handleChangeMax}
            />
          </div>
        </section>
        <section>
          <ListItem handleGrid={() => { setGrid(localStorage.getItem('listItenGrid')) }} />
        </section>
      </div>
      <div className={`g-list ${grid == '2' ? 'small' : ''}`}>
        {goodsList.length > 0 && <div className='cardItem'> {CardItem()} </div>}
        {goodsList.length === 0 && <AEmpty />}
      </div>
      {loading ? (
        <div className='loading-wrap'>
          <Spin indicator={antIcon} />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
