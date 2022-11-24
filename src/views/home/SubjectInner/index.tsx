import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getCookie } from '../../../utils/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectCards, Autoplay, Pagination } from 'swiper';

import 'swiper/scss';
import './index.scss';

SwiperCore.use([EffectCards, Pagination]);

import { recommendHomePage } from '../../../api/index';
const SwiperComm = (props: any) => {
  const { swiperList, setCurrentSwiperObject } = props;
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      effect='cards'
      // loop={true}
      grabCursor={true}
      onSlideChange={(swiper) => setCurrentSwiperObject(swiperList[swiper.activeIndex])}
      pagination={{
        bulletClass: 'swiper-pagination-bullet my-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active my-bullet-active',
        clickable: true,
      }}
    >
      {swiperList.map((item: any, index: number) => {
        return (
          <SwiperSlide key={index}>
            <Link to={Number(item.type) === 1 ? `/primary-details/${item.id}` : `/product-details/${item.orderId}`}>
              <div className='right-inner'>
                <img className='pic' src={item.imageUrl} alt='' />
              </div>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export const SubjectInner = () => {
  const history = useHistory();
  const [swiperList, setSwiperList] = useState<any[]>([]);
  const [currentSwiperObject, setCurrentSwiperObject] = useState<any>({});
  const token = getCookie('web-token') || '';
  const walletAccount = localStorage.getItem('wallet') || '';
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    const res: any = await recommendHomePage({ page: 1, size: 3 });
    setSwiperList(res.data.records);
    setCurrentSwiperObject(res?.data?.records[0]);
  };

  useEffect(() => {
    if (!walletAccount || !token) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [walletAccount, token]);

  const clickSell = () => {
    if (isLogin) {
      history.push(`/account/0/${walletAccount}`);
    } else {
      history.push(`/login`);
    }
  };

  return (
    <div className='container-banner'>
      {/* <div className='container-position'>
        <div className='position-img' style={{ backgroundImage: `url(${background()})` }}></div>
      </div> */}
      <div className='container-flex'>
        <div className='flex-left'>
          <h1>Welcome to the Diffgalaxy digital art market.</h1>
          <span>Diffgalaxy makes NFT transactions easier, The joy of exploring and trading together.</span>
          <div className='left-button'>
            <button className='button-explore' onClick={() => history.push(`/marketplace`)}>
              Buy
            </button>
            <button className='button-sell' onClick={clickSell}>
              Sell
            </button>
          </div>
        </div>
        <div className='flex-right'>
          <div className='cards-swiper'>
            <SwiperComm swiperList={swiperList} setCurrentSwiperObject={setCurrentSwiperObject} />
            <div className='swiper-pagination'></div>
            <div className='right-footer'>
              <div className='footer-img'>
                <img src={currentSwiperObject?.collectionHeadUrl} alt='' />
              </div>
              <div className='footer-text'>
                <p>
                  {currentSwiperObject?.name} #{currentSwiperObject?.tokenId}
                </p>
                <span>{currentSwiperObject?.collectionName}</span>
              </div>
            </div>
          </div>
        </div>
        <p className='text-link link-hidden'>Get featured on the homepage</p>
      </div>
    </div>
  );
};
