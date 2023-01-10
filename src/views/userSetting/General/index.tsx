import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAccountInfo, updateUserInfo } from 'Src/api/user'
import { createIpfs } from '../../../api'
import { message } from 'antd'
import { uploadFileCheck } from '../../../utils/utils'
import './index.scss'
import { useTranslation } from 'react-i18next'

export const General = () => {
  const { t } = useTranslation()
  const { address } = useParams<{ address: string }>()
  const [imageUrl, setImageUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [requiredEmail, setRequiredEmail] = useState(false)
  const [requiredName, setRequiredName] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', bio: '' })

  const handleUploadImage = (e: any) => {
    const file = e.target.files[0]

    const res: boolean = uploadFileCheck(
      file,
      ['jpg', 'png', 'gif'],
      1024 * 1024,
      t('hint.imageTupe'),
      t('hint.imageSizeAuto', { size: 1 }),
    )
    if (!res) {
      return (e.target.value = '') // 解决同一文件不触发change事件
    }

    const params = new FormData()
    params.append('file', file)
    createIpfs(params).then((res: any) => {
      setImageUrl(res?.data)
    })
  }
  const handleBannerImage = (e: any) => {
    const file = e.target.files[0]

    const res: boolean = uploadFileCheck(
      file,
      ['jpg', 'png', 'gif'],
      1024 * 1024 * 5,
      t('hint.imageTupe'),
      t('hint.imageSize'),
    )
    if (!res) {
      return (e.target.value = '') // 解决同一文件不触发change事件
    }

    const params = new FormData()
    params.append('file', file)
    createIpfs(params).then((res: any) => {
      setBannerUrl(res?.data)
    })
  }
  const handleNameBlur = (e: any) => {
    const value = e.target.value
    if (value) {
      setRequiredName(false)
    } else {
      setRequiredName(true)
    }
  }
  const handleEmailBlur = (e: any) => {
    const value = e.target.value
    if (value) {
      setRequiredEmail(false)
    } else {
      setRequiredEmail(true)
    }
  }
  const disabledState = () => {
    return form.username && form.email
  }
  const handleUpdateInfo = async () => {
    const params = {
      ...form,
      imageUrl,
      bannerUrl,
    }
    const res: any = await updateUserInfo(params)
    if (res?.message === 'success') {
      message.success(t('hint.informationUpdated'))
    }
  }
  const getAccountInfoByAddress = async () => {
    const res: any = await getAccountInfo(address)
    const { imageUrl, bannerUrl, username, email, bio } = res.data
    setImageUrl(imageUrl)
    setBannerUrl(bannerUrl)
    setForm({ username, email, bio })
  }

  useEffect(() => {
    getAccountInfoByAddress()
  }, [])

  return (
    <div>
      <div className='create-wrap'>
        <div className='inner-top'>
          <div className='inner-title'>
            <label>{t('userSettings.avatar')}</label>
          </div>
          <div className='inner-file logo-image'>
            {!imageUrl ? (
              <div className='file-box'>
                <img src={require('../../../assets/image.svg')} alt='' className='image' />
              </div>
            ) : (
              <div className='image-display'>
                <img src={imageUrl} alt='' className='image-cicle' />
              </div>
            )}
            <input type='file' name='media' id='media' onChange={(e) => handleUploadImage(e)} />
          </div>
        </div>
        <div className='inner-top'>
          <div className='inner-title'>
            <label>{t('userSettings.banner')}</label>
          </div>
          <div className='inner-file banner-image'>
            {!bannerUrl ? (
              <div className='file-box'>
                <img src={require('../../../assets/image.svg')} alt='' className='image' />
              </div>
            ) : (
              <div className='image-display'>
                <img src={bannerUrl} alt='' />
              </div>
            )}

            <input type='file' name='media' id='media' onChange={(e) => handleBannerImage(e)} />
          </div>
        </div>

        <div className='inner-name'>
          <label htmlFor='name'>
            {t('userSettings.username')}
            <span>*</span>
          </label>
          <div className={`inner-name-input ${requiredName ? 'active-name-input' : 'inner-name-input'}`}>
            <input
              type='text'
              name='name'
              id='name'
              className={requiredName ? 'active-focus' : ''}
              placeholder={t('userSettings.username') || undefined}
              onBlur={(e) => handleNameBlur(e)}
              value={form.username || ''}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          {requiredName && (
            <p className='required-tips'>
              <img src='/sol/close_error.svg' alt='' className='close-svg' /> {t('userSettings.required')}
            </p>
          )}
        </div>
        <div className='inner-name'>
          <label htmlFor='email'>
            {t('userSettings.email')}
            <span>*</span>
          </label>
          <div className={`inner-name-input ${requiredEmail ? 'active-name-input' : 'inner-name-input'}`}>
            <input
              type='text'
              name='email'
              id='name'
              className={requiredEmail ? 'active-focus' : ''}
              placeholder={t('userSettings.email') || undefined}
              onBlur={(e) => handleEmailBlur(e)}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              value={form.email || ''}
            />
          </div>
          {requiredEmail && (
            <p className='required-tips'>
              <img src='/sol/close_error.svg' alt='' className='close-svg' /> {t('userSettings.required')}
            </p>
          )}
        </div>

        <div className='inner-name'>
          <label htmlFor='bio'>{t('userSettings.bio')}</label>
          <div className='inner-name-input'>
            <textarea
              name='bio'
              id='desc'
              placeholder={t('userSettings.introduction') || undefined}
              value={form.bio || ''}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
        </div>
        <div className='create-btn'>
          <button disabled={!disabledState} onClick={() => handleUpdateInfo()}>
            {t('userSettings.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
