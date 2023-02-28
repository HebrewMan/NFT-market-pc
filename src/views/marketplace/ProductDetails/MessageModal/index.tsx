import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import './index.scss'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

const messageModal: React.FC<any> = (props) => {
  const { t } = useTranslation()
  const history = useHistory()
  console.log(props, 'props')
  const { tokenId, collectionName, imageUrl, name } = props?.data
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const walletAccount: string = localStorage.getItem('wallet') || ''
  useEffect(() => {
    setIsModalOpen(props?.visible)
  }, [props])

  const onCancel = () => {
    setIsModalOpen(false)
  }

  const handleDetail = () => {
    setIsModalOpen(false)
    history.push(`/account/0/${walletAccount}`)
    if (window.location.pathname == `/account/0/${walletAccount}`) {
      window.location.reload()
    }
  }
  return (
    <Modal title='' open={isModalOpen} footer={null} onCancel={onCancel} closable={false}>
      <div className='contentWaper'>
        <div className='datatTitle'>{props?.title}</div>
        <div className='info'>
          <img src={imageUrl} alt="" />
          <p className='name'>{collectionName}</p>
          <div className='contractName'>{name + '#' + tokenId}</div>
          <Button type='primary' size="large" onClick={handleDetail}>{t('marketplace.details.checkDetails')}</Button>
        </div>
      </div>
    </Modal>
  )
}
export default messageModal