import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './index.scss'

export const ErrorViwe = () => {
  const { t } = useTranslation()

  return (
    <div className='content-wrap-top'>
      <div className='error-waper'>
        <div className='error-img'>
          <img src={require('Src/assets/common/error.png')} alt="" />
        </div>
        <div className='error-title'>{t('footer.error')}</div>
      </div>
    </div>
  )
}

