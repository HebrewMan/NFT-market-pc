import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { HeaderSearch } from '../../components/HeaderSearch'
import { Select } from '../marketplace/Select'
import { formatAdd } from '../marketplace/utils'
import { message, Select as SelectAntd, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import config from 'Src/config/constants'
import ListItem from 'Src/components/ListItem'
import { createIpfs, getMyNFTList } from '../../api'
import { getAccountInfo, updateUserInfo, getUserTransactionList } from '../../api/user'
import { uploadFileCheck } from '../../utils/utils'
import { useTouchBottom } from '../../hooks'
import './index.scss'
import { getCookie, formatTokenId, handleCopy } from 'Utils/utils'
import AEmpty from "Src/components/Empty"
import TradingList from 'Src/components/TradingList'
import CardNft from 'Src/components/CardNFT'
import InfiniteScroll from "react-infinite-scroll-component"
interface accountInfoProps {
  name: string
  username: string
  userAddr: string
  imageUrl: string
  headUrl: string
  bannerUrl: string
  id: string
  bio: string

}

export const Account: React.FC<any> = () => {
  const { t } = useTranslation()
  const sortList = [
    {
      label: 'sort',
      name: t('marketplace.highToLow'),
      value: 'high',
    },
    {
      label: 'sort',
      name: t('marketplace.LowToHigh'),
      value: 'low',
    },
  ]
  const tabsData = [t('account.collected'), t('account.favorited'), t('account.activities')]
  const [grid, setGrid] = useState(localStorage.getItem('listItenGrid'))
  const [accountInfo, setAccountInfo] = useState<accountInfoProps>({
    name: '',
    username: '',
    userAddr: '',
    imageUrl: '',
    headUrl: '',
    bannerUrl: '',
    id: '',
    bio: ''
  })
  const { id, address } = useParams<{ id: string | undefined; address: string }>()
  const [keyWord, setKeyWord] = useState<any>()
  const [sort, setSort] = useState<any>()
  const [collectAddr, setCollectAddr] = useState<any>(null)
  const [ownerAddr, setOwnerAddr] = useState<any>(null)
  const [reset, setReset] = useState(false)
  const walletAccount: string = localStorage.getItem('wallet') || ''
  const [currentIndex, setCurrentIndex] = useState(0)
  const history = useHistory()
  const defaultHeader = require('../../assets/account/default_header.png')
  const defaulBannerUrl = require('../../assets/account/default_banner.svg')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [infoVisible, setInfoVisible] = useState(false)
  const [tradingHistoryData, setTradingHistoryData] = useState([])
  const [transactionPage, setTransactionPage] = useState(1)
  const [tradinTotal, setTradinTotal] = useState(0)
  const [filterList, setFilterList] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [NFTlistData, setNFTlistData] = useState<any[]>([])
  const params = {
    collectAddr: collectAddr,
    ownerAddr: address,
    name: keyWord,
    data: { sort },
    page: page,
    size: 10,
  }

  useEffect(() => {
    currentIndex == 2 && getTransactionList()
  }, [transactionPage, filterList, currentIndex])


  // 获取用户交易记录
  const getTransactionList = async () => {
    const data = {
      types: filterList,
      page: transactionPage,
      size: 20,
      userAddr: address,
    }
    const res: any = await getUserTransactionList(data)
    setTradinTotal(res?.data?.total)
    setTradingHistoryData(tradingHistoryData.concat(res?.data?.records))
  }
  const handleFilter = (list: any) => {
    setFilterList(list)
    setTradingHistoryData([])
  }

  // 判断方法回调返回值
  const isOwner = () => {
    return (accountInfo?.userAddr && accountInfo?.userAddr === walletAccount) || address === walletAccount
  }
  // 上传图片
  const handleUploadFile = async (e: any) => {
    const file = e.target.files[0]

    const check: boolean = uploadFileCheck(
      file,
      ['jpg', 'png'],
      1024 * 1024,
      t('hint.imageTupe'),
      t('hint.imageSizeAuto', { size: 1 }),
    )
    if (!check) {
      return (e.target.value = '') // 解决同一文件不触发change事件
    }

    const params = new FormData()
    params.append('file', file)
    const res: any = await createIpfs(params)
    const info = {
      ...accountInfo,
      imageUrl: res.data,
    }
    setAccountInfo({ ...accountInfo, imageUrl: res.data })
    await updateGeneralInfo(info)
  }
  // 更新头像接口
  const updateGeneralInfo = async (info: any) => {
    const res: any = await updateUserInfo(info)
    if (res.message === 'success') {
      message.success(t('hint.avatarUpdated'))
    }
  }
  const clickedTab = (index: number) => {
    setCurrentIndex(index)
    setPage(1)
    const cloneAddr = isOwner() ? walletAccount : address
    if (index == 2) {
      setTradingHistoryData([])
      // getTransactionList()
    }
    if (index === 0) {
      setCollectAddr(null)
      setOwnerAddr(cloneAddr)
    } else if (index === 1) {
      setCollectAddr(cloneAddr)
    }
  }

  const getKeyWord = (value: string) => {
    setPage(1)
    setKeyWord(value)
  }

  const handleSort = (item: any) => {
    setPage(1)
    setSort(item.value)
  }

  useEffect(() => {
    getAccountNFTList()
  }, [currentIndex, sort, keyWord, page])

  useEffect(() => {
    setCollectAddr(null)
    setTradingHistoryData([])
    setCurrentIndex(0)
    if (address) {
      getAccountInfoByAddress()
      // getAccountNFTList()
    }
  }, [address])

  // 根据用户地址获取账户信息
  const getAccountInfoByAddress = async () => {
    const res: any = await getAccountInfo(address)
    setAccountInfo(res.data)
  }

  // 获取用户当前账号所有的资产
  const getAccountNFTList = async () => {
    const obj = {
      ...params,
      page: page,
    }
    const { data } = (await getMyNFTList(obj)) || {}
    setTotal(data.total)
    setNFTlistData((val) => {
      // 搜索条件改变时置空
      if (page === 1) {
        return [...data?.records]
      }
      return [...val, ...data?.records]
    })
  }

  const handleBannerImage = (e: any) => {
    const file = e.target.files[0]

    const check: boolean = uploadFileCheck(
      file,
      ['jpg', 'png'],
      1024 * 1024 * 5,
      t('hint.imageTupe'),
      t('hint.imageSize'),
    )
    if (!check) {
      return (e.target.value = '') // 解决同一文件不触发change事件
    }

    const params = new FormData()
    params.append('file', file)
    createIpfs(params).then((res: any) => {
      setAccountInfo({ ...accountInfo, bannerUrl: res.data })
      updateGeneralInfo({ ...accountInfo, bannerUrl: res.data })
    })
  }

  const fetchMoreData = () => {
    if (total <= 10) {
      setHasMore(false)
      return
    }
    setTimeout(() => {
      setPage(page + 1)
    }, 200)
  }

  const getDescInfo = () => {
    const { Paragraph } = Typography
    const article = accountInfo.bio
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
        {infoVisible && <a onClick={() => setInfoVisible(false)} style={{ marginLeft: '5px' }}>{t('common.putAway')}</a>}
      </Paragraph>
    )
  }


  const Tabs = (props: any) => {
    const changeIndex = (index: number) => {
      props.clickedTab(index)

    }
    return (
      <ul className='account-tabz'>
        {tabsData.map((item, index) => (
          <li key={index} className={currentIndex === index ? 'active' : ''} onClick={() => changeIndex(index)}>
            {item}
          </li>
        ))}
      </ul>
    )
  }
  const handleItenClick = () => {
    setNFTlistData([])
    getAccountNFTList()
  }

  return (
    <div className='content-wrap-top'>
      <div className='account'>
        <div className={`banner ${accountInfo?.bannerUrl ? 'set' : ''}`}>
          <img src={accountInfo?.bannerUrl ? accountInfo?.bannerUrl : defaulBannerUrl} />
          {isOwner() &&
            <div className='edit'>
              <img src={require('../../assets/account/icon-edit.svg')} alt='' />
              <span>{t('account.editBanner')}</span>
              <input type='file' name='media' id='media' onChange={(e) => handleBannerImage(e)} />
            </div>
          }
        </div>
        <div className='account-content-wrap'>
          <div className='account-header--main'>
            <div className='account-header-top'>
              <div className='user-img'>
                <img
                  className='header-img'
                  src={!address ? accountInfo?.headUrl : accountInfo?.imageUrl || defaultHeader}
                  alt=''
                />
                {address && isOwner() && (
                  <>
                    <input type='file' name='files' accept='image/*' id='files' onChange={(e) => handleUploadFile(e)} />
                    <div className='ico'>
                      <img src={require('Src/assets/account/edit_white.svg')} alt='' />
                      <span>{t('account.edit')}</span>
                    </div>
                  </>
                )}
              </div>
              <div className='account-info'>
                <div className='account-flex'>
                  <div className='account-title'>
                    {(accountInfo?.username?.startsWith('0x')
                      ? accountInfo?.username?.substr(2, 6)
                      : accountInfo?.username) ||
                      accountInfo?.name ||
                      'Unnamed'}
                  </div>
                  <div className='account-subtitle'>
                    <p>{formatAdd(address)}</p>
                    {address && (
                      <img
                        src={require('Src/assets/account/content_copy_gray.png')}
                        className='svg-img'
                        alt=''
                        onClick={() => handleCopy(address)}
                      />
                    )}
                  </div>
                </div>

                <div className='moreinfo'>
                  {getDescInfo()}
                </div>
              </div>
            </div>



            {address && <div className='select-wrap'>{<Tabs clickedTab={clickedTab} />}</div>}
          </div>
          <div className='account-all-collects'>
            {currentIndex == 2 ? <>
              {<TradingList TradingData={tradingHistoryData} total={tradinTotal} handleMoreChange={() => setTransactionPage(transactionPage + 1)} handleFilter={(list: any) => handleFilter(list)} />}
            </>
              :
              <div className='info'>
                <div className='info-collections'>
                  <div className='info-flex'>
                    <section>
                      <HeaderSearch
                        getKeyWord={getKeyWord}
                        reset={reset}
                        keyWord={keyWord}
                        placeholder={t('marketplace.serach')}
                      />

                      <div className='infoFilter'>
                        <Select value={sort} list={sortList} change={handleSort} />

                      </div>
                    </section>
                    <ListItem handleGrid={() => { setGrid(localStorage.getItem('listItenGrid')) }} />
                  </div>
                  <div className={`info-main info-main--max`}>
                    <div className={`g-list ${grid == '2' ? 'small' : ''}`}>
                      {NFTlistData.length > 0 &&
                        <InfiniteScroll
                          dataLength={NFTlistData.length}
                          next={fetchMoreData}
                          hasMore={hasMore}
                          loader={false}
                        >
                          <CardNft owner={isOwner()} nftList={NFTlistData} handleItemChange={() => handleItenClick()} />
                        </InfiniteScroll>

                      }
                      {NFTlistData.length === 0 && <AEmpty />}
                    </div>
                  </div>
                </div>
              </div>
            }

          </div>
        </div>
      </div>
    </div>
  )
}
