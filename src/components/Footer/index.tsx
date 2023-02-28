import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import './index.scss'

export const Footer = () => {
  const { t } = useTranslation()
  const history = useHistory()

  const handleClick = (type: string) => {
    if (type === 'help') {
      history.push({
        pathname: "/helpcenter",
      })
    } else {
      history.push({
        pathname: "/privacy",
        state: { source: type }
      })
    }

  }
  return (
    <>
      <div className='pc-footer'>
        <div className='logo'>
          <img src={require('Src/assets/home/logo.svg')} width={132} height={40} alt='' />
        </div>
        <div className='footer-left'>
          <div className='desc'>{t('footer.title')}</div>
        </div>
        <div className='footer-right'>
          <div className='copyright'>{t('footer.copyright')}</div>
          <div className='links'>
            {/* <span>{t('footer.legal')}</span> */}
            <span onClick={() => handleClick('help')}>{t('footer.legal')}</span>
            <span onClick={() => handleClick('service')}>{t('footer.service')}</span>
            <span onClick={() => handleClick('policy')}>{t('footer.policy')}</span>
          </div>
          <div className='webLink'>
            <img src={require('Src/assets/home/twitter.png')} alt="" />
          </div>
        </div>
      </div>
    </>
  )
}
