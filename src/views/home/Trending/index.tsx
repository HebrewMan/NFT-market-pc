import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation } from 'swiper';
import { isMobile } from 'react-device-detect';
import useWindowDimensions from '../../../utils/layout';
import { getRecommendCollection } from '../../../api/collection';
import 'swiper/scss';
import './index.scss';

SwiperCore.use([Navigation]);

const TrendSwiper = (props: any) => {
  const { collections, setCurrentSwiperObject } = props;

  return (
    <Swiper
      modules={[Autoplay]}
      // loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      watchSlidesProgress={true}
      slidesPerView='auto'
      centeredSlides={true}
      loopedSlides={5}
      navigation={{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }}
      onSlideChange={(swiper) => {
        setCurrentSwiperObject(collections[swiper.activeIndex])
      }}
      onProgress={(swiper, progress: number) => {
        const slides: any = swiper.slides;
        for (let i = 0; i < slides.length; i++) {
          var slide = slides.eq(i);
          var slideProgress = slides[i].progress;
          let modify = 1;
          if (Math.abs(slideProgress) > 1) {
            modify = (Math.abs(slideProgress) - 1) * 0.18 + 1;
          }
          const translate = slideProgress * modify * 142 + 'px';
          const scale = 1 - Math.abs(slideProgress) / 5;
          const zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
          slide.transform('translateX(' + translate + ') scale(' + scale + ')');
          slide.css('zIndex', zIndex);
          slide.css('opacity', 1);
          if (Math.abs(slideProgress) > 3) {
            slide.css('opacity', 0);
          }
        }
      }}
      onSetTransition={(swiper, transition: number) => {
        const slides: any = swiper.slides;
        for (var i = 0; i < slides.length; i++) {
          var slide = slides.eq(i)
          slide.transition(transition);
        }
      }}
    >
      {collections.map((item: any, index: number) => (
        <SwiperSlide key={index}>
          <div className='swiper-items'>
            <div className='swiper-item'>
              <Link to={`/collection/${item.id}`}>
                <img src={item.coverUrl} alt='' />
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

const TrendSwiperMobile = (props: any) => {
  const { collections } = props;
  return (
    <Swiper
      modules={[Autoplay]}
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      slidesPerView={1}
    >
      {collections.map((item: any, index: number) => {
        return (
          <SwiperSlide key={index}>
            <div className='swiper-items'>
              <div className='swiper-item'>
                <Link to={`/collection/${item.id}`}>
                  <img src={item.coverUrl} alt='' />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export const Trending = () => {
  const { width } = useWindowDimensions();
  const [collections, setCollections] = useState<any[]>([]);
  const [currentSwiperObject, setCurrentSwiperObject] = useState<any>({})
  // const temp: any = []
  // const temp = [{...collections[0]},{...collections[0]},{...collections[0]},{...collections[0]},{...collections[0]},{...collections[0]},{...collections[0]}];
  // const temp: any = [];
  const styles: object = { textAlign: 'center', paddingTop: '40px', fontWeight: 600 };

  const init = async () => {
    const params = {
      // 推荐合集参数
      data: {
        first: 1, // 推荐1,不推荐0
      },
      page: 1,
      size: 6,
    };
    const res: any = await getRecommendCollection(params);
    setCollections(res.data.records);
    
    setCurrentSwiperObject(res?.data?.records[0]);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className='swiper-list'>
        <div className='swiper-title'>
          <h2>Trending Now</h2>
        </div>
        {(collections && collections.length > 0) && (
          <TrendSwiper collections={collections} setCurrentSwiperObject={setCurrentSwiperObject} /> 
          // !isMobile && width >= 768 && <TrendSwiper collections={collections} setCurrentSwiperObject={setCurrentSwiperObject} /> ||
          // (isMobile || width < 768) && <TrendSwiperMobile collections={collections} />
        )}
        {!(collections && collections.length > 0) && (<p style={styles}>No Data</p>)}
        <div className='right-footer'>
          <div className='footer-img'>
            <img src={currentSwiperObject?.headUrl} alt='' />
          </div>
          <div className='footer-text'>{currentSwiperObject?.name}</div>
        </div>
      </div>
      <div className="swiper-buttons">
        <div className="swiper-button-prev">
          <img src={require('../../../assets/swiper-prev.png')} alt='' />
        </div>
        <div className="swiper-button-next">
          <img src={require('../../../assets/swiper-next.png')} alt='' />
        </div>
      </div>
      {/* {!isMobile && width >= 768 && (
        <div className="swiper-buttons">
          <div className="swiper-button-prev">
            <img src={require('../../../assets/swiper-prev.png')} alt='' />
          </div>
          <div className="swiper-button-next">
            <img src={require('../../../assets/swiper-next.png')} alt='' />
          </div>
        </div>
        )} */}
    </>
  );
};
