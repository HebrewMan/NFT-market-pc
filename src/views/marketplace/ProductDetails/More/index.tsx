import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { getFans, removeFans, getFansByGoodsId } from '../../../../api/fans'
import './index.scss'
import { useTranslation } from 'react-i18next'
import { intlFloorFormat } from 'Utils/bigNumber'
import { formatTokenId } from 'Utils/utils'

export const MoreCollects = (props: any) => {
  const { t } = useTranslation()
  const [detailsState, setDetailsState] = useState(false)
  const [ownerAddr, setOwnerAddr] = useState('')
  const grid = 1
  const history = useHistory()
  const collectGoodsData = props.collectGoodsData || []

  const WrapItem = () =>
    collectGoodsData.map((item: any, index: number) => {
      return (
        <div className='card' key={index}>
          <Link to={`/product-details/${item.orderId}`}>
            <div className='assets'>
              <img src={item.imageUrl} alt='' />
            </div>
            <div className='assets-info'>
              <div className='desc'>
                <div className='name'>{formatTokenId(item.name, item.tokenId)}</div>
              </div>
              <div className='collection-name'>{item.collectionName}</div>
              <div className='price'>
                <img src={require('../../../../assets/coin/aitd.svg')} alt='' className='coin-img' />
                {intlFloorFormat(item.price, 4) + ` ${item?.coin || 'AITD'}`}
              </div>
            </div>

            {/* <div className={`fav ${item % 2 == 0 ? 'active' : ''}`}>
              <img
                className={!item.collect ? 'favorite_border_gray' : 'favorite_red'}
                src={!item.collect ? require('../../../../assets/fg.png') : require('../../../../assets/fr.png')}
                onClick={(e) => toggleFansCollected(e, item)}
                alt=''
              />
              <span className={!item.collect ? '' : 'favorite'}>{item.collectNum}</span>
            </div> */}
          </Link>
        </div>
      )
    })
  const Wrapper = () => (
    <div className='collection-wrapper'>
      <div className={`g-list ${grid != 1 ? 'small' : ''}`}>
        <WrapItem />
      </div>
    </div>
  )

  return (
    <div className='more-collection'>
      <div className='list-title title-point' onClick={() => setDetailsState(!detailsState)}>
        <img src={require('../../../../assets/view_module.svg')} alt='' className='svg-default-size' />
        <h2>{t('marketplace.details.more')}</h2>
        <div className='arrow-icon'>
          <img
            src={
              !detailsState
                ? require('../../../../assets/arrow.svg')
                : require('../../../../assets/expand_less_gray.svg')
            }
            alt=''
          />
        </div>
      </div>
      {!detailsState ? <Wrapper /> : <></>}
    </div>
  )
}
