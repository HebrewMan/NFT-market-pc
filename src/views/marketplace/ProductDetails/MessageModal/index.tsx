import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import './index.scss'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

const messageModal: React.FC<any> = (props) => {
  const { t } = useTranslation()
  const history = useHistory()

  const { tokenId, collectionName, imageUrl, name, contractAddr } = props?.data
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const walletAccount: string = localStorage.getItem('wallet') || ''
  useEffect(() => {
    setIsModalOpen(props?.visible)
  }, [props])

  const onCancel = () => {
    setIsModalOpen(false)
    window.location.reload()
  }

  const handleDetail = () => {
    setIsModalOpen(false)
    history.push({
      pathname: "/asset",
      state: { tokenId: tokenId, contractAddr: contractAddr }
    })
    if (window.location.pathname == `/asset`) {
      window.location.reload()
    }
  }
  return (
    <Modal title='' open={isModalOpen} footer={null} onCancel={onCancel} closable={true}>
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