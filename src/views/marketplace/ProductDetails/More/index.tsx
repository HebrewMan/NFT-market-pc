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
  const grid = 1
  const history = useHistory()
  const collectGoodsData = props.collectGoodsData || []

  const handleJump = (item: any) => {
    window.location.reload()
    history.push({
      pathname: "/product-details",
      state: { tokenId: item?.tokenId, contractAddr: item?.contractAddr }
    })
  }
  const WrapItem = () =>
    collectGoodsData.map((item: any, index: number) => {
      return (
        <div className='card' key={index}>
          <div onClick={() => handleJump(item)}>
            <div className='assets'>
              <img src={item.imageUrl} alt='' />
            </div>
            <div className='assets-info'>
              <div className='desc'>
                <div className='name'>{formatTokenId(item.name, item.tokenId)}</div>
              </div>
              <div className='collection-name'>{item.collectionName}</div>
              <div className='price'>
                <div className='priceCenter'>
                  {item.price != null && <>
                    <img src={require('../../../../assets/coin/aitd.svg')} alt='' className='coin-img' />
                    {intlFloorFormat(item.price, 4)}
                  </>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    })
  const Wrapper = () => (
    <div className='collection-wrapper'>
      <div className={`g-list ${grid != 1 ? 'small' : ''}`}>
        <div className='cardItem'><WrapItem /></div>
      </div>
    </div>
  )

  return (
    <div className='more-collection'>
      <div className='list-title title-point' onClick={() => setDetailsState(!detailsState)}>
        <img src={require('Src/assets/marketPlace/collection-more.png')} alt='' className='svg-default-size' />
        <h2>{t('marketplace.details.more')}</h2>
        <div className='arrow-icon'>
          <img
            src={
              !detailsState
                ? require('Src/assets/marketPlace/arrow.png')
                : require('Src/assets/marketPlace/expand.png')
            }
            alt=''
          />
        </div>
      </div>
      {!detailsState ? <Wrapper /> : <></>}
    </div>
  )
}
