import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './index.scss'
export const PageTitle = (props: any) => {
  const { title } = props
  return (
    <div className='page-title'>
      <h2>{title}</h2>
    </div>
  )
}
export const SetupDetails = () => {
  const { t } = useTranslation()
  return (
    <div>
      {/* <PageTitle title={t('home.assets.title')} /> */}
      <div className='nft-list'>
        <div className='nft-list-item safety-bg'>
          <img src={require(`Src/assets/home/safety.png`)} alt='' />
          <p className='item-title'>
            {t("home.safeandReliable")}
          </p>
          <p className='item-text'>
            {t('home.safeReliableTips')}
          </p>
        </div>

        <div className='nft-list-item fee-bg'>
          <img src={require(`Src/assets/home/fee.png`)} alt='' />
          <p className='item-title'>
            {t('home.ultraLowFee')}
          </p>
          <p className='item-text'>
            {t('home.ultraLowFeeTips')}
          </p>
        </div>

        <div className='nft-list-item relation-bg'>
          <img src={require(`Src/assets/home/relation.png`)} alt='' />
          <p className='item-title'>
            {t('home.buildGameFi')}
          </p>
          <p className='item-text'>
            {t('home.buildGameFiTips')}
          </p>
        </div>
      </div>
    </div>
  )
}
