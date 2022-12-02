import React from 'react';
import { useParams } from 'react-router-dom';
import './index.scss';
import { useTranslation } from 'react-i18next';

export const Content = (props: any) => {
  const routeParams = useParams() as any;
  const { ispay, nftGoods } = props;
  const image = () => {
    return nftGoods.metadata?.imageUrl;
  };
  const blindStatus = () => {
    return JSON.parse(routeParams.blindStatus);
  };
  const ContentDom = (
    <div className='price-heighting'>
      <span className='mr-15'>
        <img src={require('../../../../../assets/usdt.png')} alt='' />
        {nftGoods.price}
      </span>
    </div>
  );
  const BlindDom = <h1 className='fs-30 mr-b-50'>确定要开启该盲盒吗？</h1>;
  return (
    <div className='body'>
      <img src={image()} alt='' className='mr-b-30' />
      <h2 className={ispay ? 'fs-18 c-666 mr-b-20' : 'fs-30'}>
        {JSON.stringify(nftGoods) !== '{}' ? nftGoods.metadata.name : ''}
      </h2>
      {!ispay ? ContentDom : blindStatus() ? BlindDom : <></>}
    </div>
  );
};

export const ContentSuccess = () => {
  const { t } = useTranslation();
  return (
    <div className='dialog-body'>
      <div className='body'>
        <img src={require('../../../../../assets/success.svg')} className='mr-b-30' alt='' />
        <h1 className='mr-b-20'>{t('hint.purchaseSuccess')}</h1>
        <p className='mr-b-50 c-999'>{t('primary.goodsArrived')}</p>
      </div>
    </div>
  );
};
