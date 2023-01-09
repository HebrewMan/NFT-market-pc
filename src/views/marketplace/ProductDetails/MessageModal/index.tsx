import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import './index.scss'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

const messageModal: React.FC<any> = (props) => {
  const history = useHistory()
  const { t } = useTranslation()
  const { tokenId, collectionName, imageUrl, name, contractAddr } = props?.data
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  useEffect(() => {
    setIsModalOpen(props?.visible)
  }, [props])

  const onCancel = () => {
    props?.onClose()
  }

  const handleDetail = () => {
    props?.onClose()
    setIsModalOpen(false)
    setTimeout(() => {
      history.push({
        pathname: "/product-details",
        state: { tokenId, contractAddr }
      })
    }, 200)
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