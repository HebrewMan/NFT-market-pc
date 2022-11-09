import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '../SetupDetails';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import useWindowDimensions from '../../../utils/layout';
import 'swiper/scss';
import './index.scss';
export const Resources = () => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  return (
    <div className='swiper-pic-container'>
      <PageTitle title={`${t('home.advantage.title')}`} />
      <div className='pic-container'>
        <Swiper
          modules={[Autoplay]}
          loop={true}
          spaceBetween={30}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          slidesPerView={3}
        >
          <template slot='swiper'>
            <SwiperSlide>
              <div className='flex-list'>
                <div className='flex-list-item'>
                  <a
                    // href='https://opensea.io/blog/safety-security/how-to-safely-purchase-nfts-on-opensea/'
                    href='javascript:void(0)'
                    // target='_blank'
                    rel='noreferrer'
                  >
                    <img className='list-item-img' src={require('../../../assets/operation.png')} alt='' />

                    <div className='item-footer'>{t('home.advantage.virtueOne')}</div>
                  </a>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='flex-list'>
                <div className='flex-list-item'>
                  <Link
                    // to={`https://opensea.io/blog/guides/the-beginners-guide-to-creating-selling-digital-art-nfts/`}
                    to=''
                    // target='_blank'
                  >
                    <img className='list-item-img' src={require('../../../assets/fee.png')} alt='' />

                    <div className='item-footer'>{t('home.advantage.virtueTwo')}</div>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='flex-list'>
                <div className='flex-list-item'>
                  <Link
                    to=''
                    // target='_blank'
                  >
                    <img className='list-item-img' src={require('../../../assets/contracts.png')} alt='' />

                    <div className='item-footer'>{t('home.advantage.virtueThree')}</div>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          </template>
        </Swiper>
      </div>
    </div>
  );
};
