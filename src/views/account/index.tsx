import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { HeaderSearch } from '../../components/HeaderSearch'
import { Select } from '../marketplace/Select'
import { formatAdd } from '../marketplace/utils'
import { message, Select as SelectAntd, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { intlFloorFormat } from 'Utils/bigNumber'
import UpdatePriceModal from '../marketplace/ProductDetails/UpdatePriceModal'
import { isProd } from 'Src/config/constants'
import instanceLoading from 'Utils/loading'
import useWeb3 from 'Src/hooks/useWeb3'
import { cancelMarketItem } from 'Src/hooks/marketplace'
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
  const web3 = useWeb3()
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
  const tabsData = [t('account.collected'), t('account.favorited'), '交易记录']
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
  const [collectionsData, setCollectionsData] = useState<any>([])
  const collectRef = useRef(collectionsData)
  const { id, address } = useParams<{ id: string | undefined; address: string }>()
  const [keyWord, setKeyWord] = useState<any>()
  const [sort, setSort] = useState<any>()
  const [status, setStatus] = useState<any>()
  const [collectAddr, setCollectAddr] = useState<any>(null)
  const [ownerAddr, setOwnerAddr] = useState<any>(null)
  const [reset, setReset] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [tradingHistoryData, setTradingHistoryData] = useState([])

  const defaultData = {
    collectAddr: collectAddr,
    ownerAddr: ownerAddr || address,
    name: keyWord,
    // status: status,
  }

  const [pageCurrent, setPageCurrent] = useState(1)
  const [httpData, setHttpData] = useState({
    page: pageCurrent,
    size: 20,
    data: { ...defaultData },
  })
  const [isMore, setIsMore] = useState(false)
  const walletAccount: string = localStorage.getItem('wallet') || ''
  const [currentIndex, setCurrentIndex] = useState(0)
  const history = useHistory()
  const defaultHeader = require('../../assets/account/default_header.png')
  const defaulBannerUrl = require('../../assets/account/default_banner.svg')
  const [total, setTotal] = useState(0)
  const { page, size } = httpData
  const token = getCookie('web-token') || ''
  const [detailData, setDetailData] = useState({})
  const [infoVisible, setInfoVisible] = useState(false)
  const [transactionPage, setTransactionPage] = useState(1)

  useEffect(() => {

  }, [])


  // 获取用户交易记录
  const getTransactionList = async () => {
    const data = {
      page: transactionPage,
      size: 20,
    }
    const res: any = await getUserTransactionList(data)
    setTradingHistoryData(res?.data?.records)
  }
  // 初始化
  useEffect(() => {
    setCollectionsData([])
    getTransactionList()
  }, [address])

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
    const typeParams = {
      ...httpData,
      page: pageCurrent,
    }
    pageRef.current = 0
    const cloneAddr = isOwner() ? walletAccount : address
    if (index === 0) {
      typeParams.data.collectAddr = null

      typeParams.data.ownerAddr = cloneAddr
      setOwnerAddr(cloneAddr)

    } else if (index === 1) {
      typeParams.data.collectAddr = cloneAddr
      typeParams.data.ownerAddr = null
      setCollectAddr(cloneAddr)
    }
    setCollectionsData([])
    if (Math.ceil(total / size) > page) {
      setIsMore(true)
    }
    setCurrentIndex(index)
    setHttpData(() => ({ ...typeParams }))
  }

  const getKeyWord = (value: string) => {
    setHttpData(() => {
      setKeyWord(value)
      if (Math.ceil(total / size) > page) {
        setIsMore(true)
      }
      setCollectionsData([])
      return {
        page: pageCurrent,
        size,
        data: {
          ...httpData.data,
          name: value,
        },
      }
    })
  }

  const handleSort = (item: any) => {
    const data = {
      sort: item.value,
    }

    setHttpData(() => {
      return {
        page: pageCurrent,
        size,
        data: {
          ...httpData.data,
          data: data,
        },
      }
    })
    // sort === 'high' ? false : true
    const params = {
      ...httpData,
      page: pageCurrent,
    }

    pageRef.current = 0
    setSort(item.value)
    setPageCurrent(1)
    setCollectionsData([])
    if (Math.ceil(total / size) > page) {
      setIsMore(true)
    }
    setHttpData(() => {
      return {
        page: 1,
        size,
        data: {
          ...httpData.data,
          data: data,
        },
      }
    })
    // setHttpData(() => ({ ...httpData.data, page: 1,orders:orders}));
  }


  useEffect(() => {
    if (address) {
      getAccountInfoByAddress()
    }
  }, [address])

  // 触底加载
  const handleLoadMore = () => {
    if (isMoreRef.current) {
      const newPage = pageRef.current + 1
      setPageCurrent(newPage)
      setHttpData({ ...httpData, page: newPage })
    } else {
      pageRef.current = 1
    }
  }

  const { isMoreRef, pageRef } = useTouchBottom(handleLoadMore, httpData.page, isMore)

  useEffect(() => {
    if (accountInfo?.userAddr || accountInfo?.id) {
      const address = localStorage.getItem('wallet')
      if (accountInfo?.userAddr == address) {
        setCollectionsData([])
      }
      setTimeout(() => {
        getCollectGoods({ ...httpData, ...{ data: { ...httpData.data } } })
      }, 200)
    }
  }, [httpData, accountInfo?.userAddr, accountInfo?.id])

  // 根据用户地址获取账户信息
  const getAccountInfoByAddress = async () => {
    setCollectionsData([])
    const res: any = await getAccountInfo(address)
    setAccountInfo(res.data)
    if (accountInfo?.userAddr) {
      getCollectGoods({ ...httpData, ...{ data: { ...httpData.data } } })
    }
  }

  // 获取用户当前账号所有的资产
  const getAccountNFTList = async (typeParams: any) => {
    const res: any = await getMyNFTList(typeParams)
    const { records, total, current } = res.data
    collectRef.current = records
    setPageCurrent(current)
    setCollectionsData([...collectionsData, ...records])
    if (httpData.page >= Math.ceil(total / httpData.size)) {
      setIsMore(false)
    } else {
      setIsMore(true)
    }
  }

  const getCollectGoods = (typeParams: any) => {
    const newParams = {
      ...typeParams.data,
      page: typeParams.page,
      size,
      ownerAddr: address,
    }
    getAccountNFTList(newParams)
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
    setCollectionsData([])
    getAccountNFTList(httpData)
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
              {tradingHistoryData.length > 0 ? <TradingList TradingData={tradingHistoryData} /> : <AEmpty style={{ heigth: '200px' }} />}
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
                      {collectionsData.length > 0 && <CardNft owner={isOwner()} nftList={collectionsData} handleItemChange={() => handleItenClick()} />}
                      {collectionsData.length === 0 && <AEmpty />}
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
