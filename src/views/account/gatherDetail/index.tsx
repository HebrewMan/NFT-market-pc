
import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Input, Typography } from 'antd'
import { Select } from 'Src/views/marketplace/Select'
import { getGoodsByCollectionId } from 'Src/api'
import './index.scss'
import { HeaderSearch } from 'Src/components/HeaderSearch'
import { useTranslation } from 'react-i18next'
import { intlFloorFormat, NumUnitFormat } from 'Utils/bigNumber'
import AEmpty from "Src/components/Empty"
import ListItem from 'Src/components/ListItem'
import { formatTokenId, handleCopy } from 'Utils/utils'
import { formatAdd } from '../../marketplace/utils'
import _ from 'lodash'
import { getCollectionDetails } from 'Src/api/collection'
import InfiniteScroll from "react-infinite-scroll-component"

export const GatherDetail: React.FC<any> = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const { id: id } = useParams<{ id: string }>() // 路由参数id
  const [data, setData] = useState<any>([])
  const [grid, setGrid] = useState(localStorage.getItem('listItenGrid'))
  const [sort, setSort] = useState<any>("low")
  const [keyWord, setKeyWord] = useState('')
  const [listData, setListData] = useState<any[]>([])
  const [infoVisible, setInfoVisible] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const [createAddr, setCreateAddr] = useState('')
  const walletAccount: string = localStorage.getItem('wallet') || ''


  const queryList = [
    // 所有过滤条件
    {
      label: 'status',
      name: t("collection.listed"),
      value: 0,
    },
    {
      label: 'status',
      name: t("collection.selling"),
      value: 1,
    },
    {
      label: 'status',
      name: t("collection.cancellation"),
      value: 2,
    },
    {
      label: 'sort',
      name: t("collection.priceHigh"),
      value: 'high',
    },
    {
      label: 'sort',
      name: t("collection.priceLow"),
      value: 'low',
    },
  ]

  useEffect(() => {
    getList(id)
    getAccountInfoById(Number(id))
  }, [id])

  useEffect(() => {
    getList(id)
  }, [keyWord, sort, page])


  // 通过合集id获取账户详情基本信息
  const getAccountInfoById = async (id: number) => {
    const res: any = await getCollectionDetails(Number(id))
    setCreateAddr(res.data.createAddr)
    setData(res.data)
  }
  // g根据集合id 获取相关Nft列表
  const getList = async (id: string) => {
    const deepParams: any = {
      data: {
        keyWord: keyWord,
        sort: sort,
        collectionId: id,
      },
      page: page,
      size: 20,
    }
    const res: any = await getGoodsByCollectionId(deepParams)
    setListData(listData.concat(res.data.records))
    setTotal(res.data.total)
  }

  // 下拉加载
  const fetchMoreData = () => {
    if (total <= 20) {
      setHasMore(false)
      return
    }
    setTimeout(() => {
      setPage(page + 1)
    }, 200)
  }

  const getKeyWord = (value: string) => {
    setKeyWord(value)
    setListData([])
    setPage(1)
  }
  const handleChangeQuery = (value: any) => {
    setSort(value?.value)
    setListData([])
    setPage(1)
  }


  const handleJump = (item: any) => {
    history.push({
      pathname: "/product-details",
      state: { orderId: item?.orderId, tokenId: item?.tokenId, contractAddr: item?.contractAddr }
    })
  }

  const getDescInfo = () => {
    const { Paragraph } = Typography
    const article = data.description
    return (
      <Paragraph
        ellipsis={
          infoVisible
            ? false
            : {
              rows: 3,
              expandable: true,
              symbol: (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    setInfoVisible(true)
                  }}
                >
                  {t('common.moreText')}
                </span>
              ),
            }
        }
      >
        {article}
      </Paragraph>
    )
  }
  const CardItem = () => {
    return listData.map((item: any, index: number) => {
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
                {item.price != null &&
                  <>
                    <img src={require('Src/assets/coin/aitd.svg')} alt='' className='coin-img' />
                    {intlFloorFormat(item.price, 4) + ` ${item?.coin || 'AITD'}`}
                  </>
                }
              </div>


            </div>
          </div>
        </div>
      )
    })
  }
  return (
    <div className='gatherDetail-body'>
      <div className='gatherDetail-banner'>
        <img src={data.backgroundUrl == null ? require('Src/assets/account/bg-banner.png') : data.backgroundUrl} alt="" />
      </div>
      <div className='gatherDetail-center'>
        <div className='gatherDetail-info'>
          <div className='info-waper'>
            <img src={data.headUrl} alt="cover" className='cover' />
            <div className='info-list'>
              <div className='nameWaper'>
                <section className='name'>{data.name}</section>
                <div className='shareLink'>
                  {!_.isNull(data.linkSkypegmwcn) && <a href={data.linkSkypegmwcn} target="_window">
                    <img src={require('Src/assets/account/icon-gw.png')} alt="" />
                  </a>
                  }
                  {!_.isNull(data.linkTwitter) && <a href={data.linkTwitter} target="_window">
                    <img src={require('Src/assets/account/icon-Twitter.png')} alt="" />
                  </a>
                  }
                  {!_.isNull(data.linkDiscord) && <a href={data.linkDiscord} target="_window">
                    <img src={require('Src/assets/account/icon-Discord.png')} alt="" />
                  </a>
                  }
                  {!_.isNull(data.linkInstagram) && <a href={data.linkInstagram} target="_window">
                    <img src={require('Src/assets/account/icon-Instagram.png')} alt="" />
                  </a>
                  }
                  {!_.isNull(data.linkMedium) && <a href={data.linkMedium} target="_window">
                    <img src={require('Src/assets/account/icon-Medium.png')} alt="" />
                  </a>
                  }
                  {data?.ownerAddr && data?.ownerAddr.toUpperCase() === walletAccount.toUpperCase() &&
                    <Link to={`/gather-edit/${data.id}`}>
                      <img src={require('Src/assets/account/icon-edit.png')} alt="" />
                    </Link>
                  }

                </div>
              </div>
              <div className='info-address'>
                <div>
                  {t('gather.contract')}: {formatAdd(data.contractAddr)}
                  <img src={require('Src/assets/account/content_copy_gray.png')} alt="" onClick={() => handleCopy(data.contractAddr)} /></div>
                <div>
                  {t('gather.creators')}: {formatAdd(data.createAddr)}
                  <img src={require('Src/assets/account/content_copy_gray.png')} alt="" onClick={() => handleCopy(data.createAddr)} /></div>
              </div>
              <div className='moreinfo'>
                {getDescInfo()}
              </div>
              <div className='detail-amount'>
                <section>
                  <p className='label'>{t('gather.priceFloor')}</p>
                  <div className='text'>
                    <img src={require('Src/assets/coin/aitd.svg')} alt="" />
                    <span>{intlFloorFormat(data.lowestPrice, 4)}</span>
                  </div>
                </section>
                <section>
                  <p className='label'>{t('gather.totalVolume')}</p>
                  <div className='text'>
                    <img src={require('Src/assets/coin/aitd.svg')} alt="" />
                    <span>{NumUnitFormat(data.totalTransaction)}</span>
                  </div>
                </section>
                <section>
                  <p className='label'>{t('gather.totalNum')}</p>
                  <div className='text'>
                    <span>{NumUnitFormat(data.totalTokens)}</span>
                  </div>
                </section>
                <section>
                  <p className='label'>{t('gather.holders')}</p>
                  <div className='text'>
                    <span>{NumUnitFormat(data.totalHolder)}</span>
                  </div>
                </section>
                <section>
                  <p className='label'>{t('gather.totalListings')}</p>
                  <div className='text'>
                    <span>{NumUnitFormat(data.totalOrder)}</span>
                  </div>
                </section>
                <section>
                  <p className='label'>{t('common.royalty')}</p>
                  <div className='text'>
                    <span>{data.royalty}%</span>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div className='marketplace-waper'>
          <div className='filter'>
            <section>
              <HeaderSearch getKeyWord={getKeyWord} keyWord={keyWord} placeholder={t('marketplace.serach')} />
              <div className='condition'>
                <Select list={queryList} placeholder={t('marketplace.sortBy')} change={handleChangeQuery} value={sort} />
              </div>
            </section>
            <ListItem handleGrid={() => { setGrid(localStorage.getItem('listItenGrid')) }} />
          </div>
          <InfiniteScroll
            dataLength={listData.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={false}
          >
            <div className={`g-list ${grid == '2' ? 'small' : ''}`}>
              {listData.length > 0 ? CardItem() : <AEmpty />}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </div >
  )
}
