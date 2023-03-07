import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Autoplay, Navigation } from 'swiper'
import { isMobile } from 'react-device-detect'
import useWindowDimensions from '../../../utils/layout'
import { getRecommendCollection } from '../../../api/collection'
import { intlFloorFormat, NumUnitFormat } from 'Src/utils/bigNumber'
import 'swiper/scss'
import './index.scss'
const aitdIcon = require('Src/assets/coin/aitd.svg')
const swiperBorder = ['blue', 'orange', 'green', 'pink']

SwiperCore.use([Navigation])

const TrendSwiper = (props: any) => {
  const { collections } = props
  const { t } = useTranslation()
  return (
    <Swiper
      direction='horizontal'
      loop={true}
      slidesPerView="auto"
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}

      spaceBetween={24}
      centeredSlides={true}
      modules={[Autoplay]}
      navigation={{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }}
    >
      {collections.map((item: any, index: number) => (
        <SwiperSlide key={index}>
          <div className={`swiper-items list_border_${swiperBorder[index % 4]}`} >
            <div className={`swiper-item list_bg_${swiperBorder[index % 4]}`}>
              <Link to={`/collection/${item.linkCollection}`}>
                <div className={`cover swiper_border_${swiperBorder[index % 4]}`}>
                  <img src={item.coverUrl} alt='' />
                </div>
                <div className='swiper-item-name'>
                  <img src={item.headUrl} alt="" />
                  <p className='text'>{item.name}</p>
                </div>
                <div className='swiper-item-info'>
                  <section>
                    <p>{t('gather.priceFloor')}</p>
                    <div className='num'>
                      <img src={aitdIcon} alt="" />
                      <span>{intlFloorFormat(item.lowestPrice, 4)}</span>
                    </div>
                  </section>
                  <section>
                    <p>{t('gather.totalVolume')}</p>
                    <div className='num'>
                      <img src={aitdIcon} alt="" />
                      <span>{NumUnitFormat(item.totalTransaction)}</span>
                    </div>
                  </section>
                  <section>
                    <p>{t('gather.totalNum')}</p>
                    <div className='num'>
                      <img src={aitdIcon} alt="" />
                      <span>{NumUnitFormat(item.totalTokens)}</span>
                    </div>
                  </section>
                </div>
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}



export const Trending = () => {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const [collections, setCollections] = useState<any[]>([])
  const [currentSwiperObject, setCurrentSwiperObject] = useState<any>({})
  const styles: object = { textAlign: 'center', paddingTop: '40px', fontWeight: 600 }

  const init = async () => {
    const params = {
      // 推荐合集参数
      data: {
        first: 1, // 推荐1,不推荐0
      },
      page: 1,
      size: 6,
    }
    const res: any = await getRecommendCollection(params)
    setCollections(res.data.records)

    setCurrentSwiperObject(res?.data?.records[0])
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <div className='collectionCard'>
        <div className='line-title'>{t('home.collection')}</div>
        <div className='swiper-list'>
          {collections && collections.length > 0 && (
            <TrendSwiper collections={collections} setCurrentSwiperObject={setCurrentSwiperObject} ></TrendSwiper>
          )}
          {!(collections && collections.length > 0) && <p style={styles}>{t('common.noData')}</p>}
          <div className='swiper-buttons'>
            <div className='swiper-button-prev'>
              <img src={require('Src/assets/home/icon-left.png')} alt='' />
            </div>
            <div className='swiper-button-next'>
              <img src={require('Src/assets/home/icon-right.png')} alt='' />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
