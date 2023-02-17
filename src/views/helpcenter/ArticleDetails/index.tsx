import React, { useEffect, useState } from 'react'
import { getInfoById } from '../../../api/artiles'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { getViewLang } from "../../../utils/i18n"
import { useTranslation } from 'react-i18next'
import './index.scss'

export const ArticleDetails = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const [form, setForm] = useState({
    title: '',
    modifyDate: '',
    content: '',
    inName: {},
    inContent: {}
  })
  const { id } = useParams() as any
  const [queryId, setQueryId] = useState(id)
  useEffect(() => {
    initFormData()
  }, [queryId])
  const initFormData = async () => {
    const res: any = await getInfoById(queryId)
    setForm(res.data)
  }

  const back = () => {
    history.push('/helpcenter')
  }

  return (
    <div className='article-details-wrap content-wrap-top'>
      <img src={require('Src/assets/account/icon-article.svg')} alt="" onClick={back} className="articleBack" />
      <div className='article-details'>
        <div className='nav-right-wrap'>
          <div className='article-header'>
            <h1>{getViewLang(form.inName)} </h1>
            <div className='article-update-time'>
              <span>{t('primary.update')}</span>
              <span>· {form.modifyDate}</span>
            </div>
          </div>
          <div className='article-info' dangerouslySetInnerHTML={{ __html: getViewLang(form.inContent) }}></div>
        </div>
      </div>
    </div>
  )
}
