import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './index.scss';
export const PageTitle = (props: any) => {
  const { title } = props;
  return (
    <div className='page-title'>
      <h2>{title}</h2>
    </div>
  );
};
export const SetupDetails = () => {
  const { t } = useTranslation();
  return (
    <div>
      <PageTitle title={t('home.assets.title')} />
      <div className='nft-list'>
        <div className='nft-list-item'>
          <img src={require(`../../../assets/setting.png`)} alt='' />
          <p className='item-title'>{t('home.assets.setting')}</p>
          <p className='item-text'>{t('home.assets.settingRemind')}</p>
        </div>

        <div className='nft-list-item'>
          <img src={require(`../../../assets/nft.png`)} alt='' />
          <p className='item-title'>{t('home.assets.buy')}</p>
          <p className='item-text'>{t('home.assets.buyRemind')}</p>
        </div>

        <div className='nft-list-item'>
          <img src={require(`../../../assets/sale.png`)} alt='' />
          <p className='item-title'>{t('home.assets.sell')}</p>
          <p className='item-text'>{t('home.assets.sellRemind')}</p>
        </div>
      </div>
    </div>
  );
};
