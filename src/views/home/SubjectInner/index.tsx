import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { getCookie } from '../../../utils/utils'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { EffectCards, Autoplay, Pagination, Scrollbar } from 'swiper'
import { useTranslation } from 'react-i18next'
import 'swiper/scss'
import './index.scss'

SwiperCore.use([EffectCards, Pagination])

import { recommendHomePage } from '../../../api/index'
const SwiperComm = (props: any) => {
  const { swiperList, setCurrentSwiperObject } = props
  const history = useHistory()
  const handleJump = (item: any) => {
    const orderId = item?.orderId
    history.push({
      pathname: "/product-details",
      state: { orderId }
    })
  }

  return (
    <Swiper
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      loop={true}
      scrollbar={{
        hide: false,
      }}

      modules={[Scrollbar, Autoplay]}
      className='mainSwiper'
      onSlideChange={(swiper) => setCurrentSwiperObject(swiperList[swiper.activeIndex])}

    // pagination={{
    //   bulletClass: 'swiper-pagination-bullet my-bullet',
    //   bulletActiveClass: 'swiper-pagination-bullet-active my-bullet-active',
    //   clickable: true,
    // }}
    >
      {swiperList.map((item: any, index: number) => {
        return (
          <SwiperSlide key={index}>
            <div className='right-inner' onClick={() => handleJump(item)}>
              <img className='pic' src={item.imageUrl} alt='' />
            </div>
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}

export const SubjectInner = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const [swiperList, setSwiperList] = useState<any[]>([])
  const [currentSwiperObject, setCurrentSwiperObject] = useState<any>({})
  const token = getCookie('web-token') || ''
  const walletAccount = localStorage.getItem('wallet') || ''
  const [isLogin, setIsLogin] = useState(false)
  useEffect(() => {
    init()
  }, [])
  const init = async () => {
    const res: any = await recommendHomePage({ page: 1, size: 3 })
    setSwiperList(res.data.records)
    setCurrentSwiperObject(res?.data?.records[0])
  }

  useEffect(() => {
    if (!walletAccount || !token) {
      setIsLogin(false)
    } else {
      setIsLogin(true)
    }
  }, [walletAccount, token])

  const clickSell = () => {
    if (isLogin) {
      history.push(`/account/0/${walletAccount}`)
    } else {
      history.push(`/login`)
    }
  }

  return (
    <div className='container-banner'>
      <div className='container-flex'>
        <div className='flex-left'>
          {/* <h1>{t('home.title')}</h1> */}
          {/* <span>{t('home.subtitle')}</span> */}
          <p>专注GameFi</p>
          <p>领域的NFT交易市场</p>
          <span>安全可靠 | Gas 费低 | 手续费低 | 多EVM链</span>
          <div className='left-button'>
            <button className='button-explore' onClick={() => history.push(`/marketplace`)}>
              {t('common.buy')}
            </button>
            <button className='button-sell' onClick={clickSell}>
              {t('common.sell')}
            </button>
          </div>
        </div>
        <div className='flex-right'>
          <div className='cards-swiper'>
            <SwiperComm swiperList={swiperList} setCurrentSwiperObject={setCurrentSwiperObject} />
            <div className='swiper-scrollbar'></div>
          </div>
        </div>
      </div>
    </div>
  )
}
