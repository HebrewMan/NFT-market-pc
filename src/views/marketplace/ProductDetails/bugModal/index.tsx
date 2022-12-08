import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'antd'
import './index.scss'
const decreaseImg = require('../../../../assets/marketPlace/decrease.png')
const increaseImg = require('../../../../assets/marketPlace/increase.png')
const ReceiveModal: React.FC<any> = (props) => {
  const { data } = props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [subNum, setSubNum] = useState(1)
  const [paymentPrice, setPaymentPrice] = useState(0)

  // 初始化
  useEffect(() => {
    setIsModalOpen(props.visible)
    setPaymentPrice(props?.data.price)
  }, [props])

  // 关闭
  const onCancel = () => {
    props?.onCancel()
  }

  useEffect(() => {
    setPaymentPrice(Number(data.price * subNum))
  }, [subNum])
  // 增加
  const increase = () => {
    if (subNum >= 0) {
      setSubNum(subNum + 1)
    }
  }
  // 减少
  const decrease = () => {
    if (subNum != 1) {
      setSubNum(subNum - 1)
    }
  }

  return (
    <div className='modalWaper'>
      <Modal title='Buy NFTs' visible={isModalOpen} footer={null} onCancel={onCancel}>
        <div className='modalContent'>
          <div className='contentLeft'>
            <img src={data?.nftMetadata?.imageUrl} alt='' />
          </div>
          <div className='contentRight'>
            <div className='name'>{data?.collectionName}</div>
            <div className='info'>
              <section className='fontWeight'>{data?.nftMetadata?.name}</section>
              <section>{data?.price} AITD</section>
            </div>
          </div>
        </div>
        {/* 如果合约是1155 才显示数量 */}
        {data?.contractType === 'ERC1155' && (
          <div className='numberWaper'>
            <div onClick={decrease}>
              <img src={decreaseImg} alt='' />
            </div>
            <input type='text' className='num_box' value={subNum} />
            <div onClick={increase}>
              <img src={increaseImg} alt='' />
            </div>
          </div>
        )}

        <div className='pay'>
          <div className='name'>payment amount</div>
          <div className='price'>{paymentPrice} USDT</div>
        </div>
        <div className='BuyBtn'>to pay</div>
      </Modal>
    </div>
  )
}

export default ReceiveModal
