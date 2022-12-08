import React, { useEffect, useState } from 'react'
import { Modal,Button } from 'antd'
import './index.scss'
 
const messageModal: React.FC<any> = (props) => {
  const {tokenId , collectionName,imageUrl,name} = props?.data
  const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false)
  useEffect(() =>{
    setIsModalOpen(props?.visible)
  },[props])

  const onCancel = ()=>{
    setIsModalOpen(false)
  }

  const handleDetail = () =>{
    setIsModalOpen(false)
    window.location.reload()
  }
  return(
      <Modal title='' visible={isModalOpen} footer={null} onCancel={onCancel}>
        <div className='contentWaper'>
          <div className='datatTitle'>{props?.title}</div>
          <div className='info'>
            <img src={imageUrl} alt="" />
            <p className='name'>{collectionName}</p>
            <div className='contractName'>{name + '#' + tokenId}</div>
            <Button type='primary' size="large" onClick={handleDetail}>查看详情</Button>
          </div>
        </div>
    </Modal>
  )
}
export default messageModal