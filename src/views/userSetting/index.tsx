import React from 'react'
import { General } from './General'
import './index.scss'
import { useTranslation } from 'react-i18next'

export const UserSetting = () => {
  const { t } = useTranslation()

  return (
    <div className='content-wrap-top'>
      <div className='user-settings'>
        <div className={`settings-wrap`}>
          <div className='settings-list'>
            <ul>
              <div className='list-title'>{t('nav.setting')}</div>
              <li>
                <a className='li-item actived'>
                  <span>{t('userSettings.general')}</span>
                </a>
              </li>
            </ul>
          </div>
          <div className='settings-container'>
            <h1>{t('userSettings.generalSetting')}</h1>
            <General />
          </div>
        </div>
      </div>
    </div>
  )
}
