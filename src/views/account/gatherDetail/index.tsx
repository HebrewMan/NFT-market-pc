
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
import BugModal from 'Src/views/marketplace/ProductDetails/bugModal'

export const GatherDetail: React.FC<any> = (props) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { link: link } = useParams<{ link: string }>() // 路由参数id
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
  const [bugModalOpen, setBuyModalOpen] = useState(false)
  const [DetailData, setDetailData] = useState([])
  const [id, setId] = useState<string>('0')
  const [linkList, setLinkList] = useState<any>([])

  const queryList = [
    // 所有过滤条件
    {
      label: 'status',
      name: t("collection.listed"),
      value: 'new',
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
  const iconMap: any = {
    linkSkypegmwcn: require('Src/assets/account/icon-official.png'),
    linkTwitter: require('Src/assets/account/icon-Twitter.png'),
    linkDiscord: require('Src/assets/account/icon-Discord.png'),
    linkInstagram: require('Src/assets/account/icon-Instagram.png'),
    linkMedium: require('Src/assets/account/icon-Medium.png'),
  }
  useEffect(() => {
    // getList(id)
    getAccountInfoById(link)
  }, [link])

  useEffect(() => {
    getList(id)
  }, [keyWord, sort, page, id])


  // 通过合集id获取账户详情基本信息
  const getAccountInfoById = async (link: string) => {
    const res: any = await getCollectionDetails({
      linkCollection: link
    })
    setCreateAddr(res.data.createAddr)
    const { linkDiscord, linkInstagram, linkMedium, linkSkypegmwcn, linkTwitter } = res.data
    setLinkList({ linkDiscord, linkInstagram, linkMedium, linkSkypegmwcn, linkTwitter })
    setData(res.data)
    setId(res.data.id)
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
    setListData([])
    setKeyWord(value)
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
  // 购买
  const handleBuy = (e: any, item: any) => {
    e.stopPropagation()
    setDetailData(item)
    setBuyModalOpen(true)
  }

  const updateGoods = () => {
    getList(id)
  }

  const handleLinkJump = (key: string) => {
    window.open(key)
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
                <div className='priceCenter'>
                  {item.price != null &&
                    <>
                      <img src={require('Src/assets/coin/aitd.svg')} alt='' className='coin-img' />
                      <span>{intlFloorFormat(item.price, 4)}</span>
                    </>
                  }
                </div>
                {(item.price != null && item.ownerAddr != walletAccount) &&
                  <>
                    <div className='btn' onClick={(e) => handleBuy(e, item)}>
                      <img src={require('Src/assets/account/buy.png')} alt="" />
                      {t('common.buy')}
                    </div>
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
                  {Object.keys(linkList).map((key: any) => {
                    if (linkList[key]) {
                      return <img onClick={() => handleLinkJump(linkList[key])} src={iconMap[key]} alt='icon' key={key} />
                    }
                  })}
                  {data?.ownerAddr && data?.ownerAddr.toUpperCase() === walletAccount.toUpperCase() &&
                    <Link to={`/gather-edit/${data.linkCollection}`}>
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
      {/* 购买弹窗 */}
      {bugModalOpen && <BugModal visible={bugModalOpen} onCancel={() => setBuyModalOpen(false)} data={DetailData} updateGoods={updateGoods} />}
    </div >
  )
}
