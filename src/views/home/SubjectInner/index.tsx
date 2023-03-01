import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { getCookie } from 'Src/utils/utils'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { EffectCards, Autoplay, Pagination, Scrollbar } from 'swiper'
import { useTranslation } from 'react-i18next'
import 'swiper/scss'
import './index.scss'

SwiperCore.use([EffectCards, Pagination])

import { getHomePageBanner } from 'Src/api/index'
import { message } from 'antd'
const SwiperComm = (props: any) => {
  const { swiperList, setCurrentSwiperObject } = props
  const history = useHistory()
  const handleJump = (item: any) => {
    // 0 文章 、1 活动 、2 集合 3、item NFT
    switch (item.type) {
      case 0:
        history.push(`/article-details/${item.linkId}`)
        break
      case 1:
        history.push({ pathname: "/activityDetail", state: { id: item.linkId } })
        break
      case 2:
        history.push(`/collection/${item?.linkId}`)
        break
      case 3:
        const contractAddr = item?.nftMetadata.contractAddr
        const tokenId = item?.nftMetadata.tokenId
        history.push({ pathname: "/asset", state: { tokenId, contractAddr } })
        break
      default:
        break
    }
  }
  return (
    <Swiper
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      grabCursor={true}
      onSlideChange={(swiper) => setCurrentSwiperObject(swiperList[swiper.activeIndex])}
      scrollbar={{
        hide: false,
      }}
      spaceBetween={40}
      modules={[Scrollbar, Autoplay]}
      className='mainSwiper'
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
    const res: any = await getHomePageBanner()
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
      message.error(t('hint.pleaseLog'))
      // history.push(`/login`)
    }
  }

  return (
    <div className='container-banner'>
      <div className='container-flex'>
        <div className='flex-left'>
          <p>{t('home.title')}</p>
          <p>{t("home.subTitle")}</p>
          <span>{t('home.safeReliable')} | {t('home.lowGasFee')} | {t('home.lowTradingFee')} | {t('home.evnChains')}</span>
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
            {/* <div className='swiper-scrollbar'></div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
