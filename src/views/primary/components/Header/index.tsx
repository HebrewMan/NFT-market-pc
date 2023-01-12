import React from 'react'
import './index.scss'
import { getViewLang } from '../../../../utils/i18n'
export const PHeader = (props: any) => {
  const { primaryObj, needTranslation } = props

  return (
    <div className='primary-header'>
      <div className='primary-header-title'>
        <h1>{needTranslation ? getViewLang(primaryObj?.name) : primaryObj?.name}</h1>
        <p>{needTranslation ? getViewLang(primaryObj?.description) : primaryObj?.description}</p>
      </div>
    </div>
  )
}
