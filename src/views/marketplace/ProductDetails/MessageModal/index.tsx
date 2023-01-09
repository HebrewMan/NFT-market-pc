import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import './index.scss'
import { useTranslation } from 'react-i18next'

const messageModal: React.FC<any> = (props) => {
  const { t } = useTranslation()
  const { tokenId, collectionName, imageUrl, name } = props?.data
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  useEffect(() => {
    setIsModalOpen(props?.visible)
  }, [props])

  const onCancel = () => {
    setIsModalOpen(false)
  }

  const handleDetail = () => {
    setIsModalOpen(false)
    window.location.reload()
  }
  return (
    <Modal title='' visible={isModalOpen} footer={null} onCancel={onCancel} closable={false}>
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