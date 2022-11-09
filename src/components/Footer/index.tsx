import React from 'react';
import { useTranslation } from 'react-i18next';
import './index.scss';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className='pc-footer'>
        <div className='footer-left'>
          <img src={require('../../assets/logo.png')} alt='' />
          <div className='desc'>{t('footer.title')}</div>
        </div>
        <div className='footer-right'>
          <div className='copyright'>{t('footer.copyright')}</div>
          <div className='links'>
            <span>{t('footer.legal')}</span>
            <span>{t('footer.service')}</span>
            <span>{t('footer.policy')}</span>
          </div>
        </div>
      </div>
    </>
  );
};
