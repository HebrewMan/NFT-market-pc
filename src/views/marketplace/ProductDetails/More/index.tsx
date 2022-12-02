import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getFans, removeFans, getFansByGoodsId } from '../../../../api/fans';
import './index.scss';
import { useTranslation } from 'react-i18next';

export const MoreCollects = (props: any) => {
  const { t } = useTranslation()
  const [detailsState, setDetailsState] = useState(false);
  const [ownerAddr, setOwnerAddr] = useState('') 
  const grid = 1;
  const history = useHistory();
  const collectGoodsData = props.collectGoodsData || [];
  const handleToDetails = (item: any) => {
    if (item.type === 1) {
      history.push(`/primary-details/${item.id}`);
    } else {
      history.push(`/product-details/${item.id}`);
    }
  };
  const toggleFansCollected = (e: any, item: any) => {
    e.preventDefault();
    const { tokenId, collect, contractAddr,ownerAddr } = item;
    setOwnerAddr(ownerAddr)
    if (collect) {
      removeFansData(tokenId, contractAddr);
    } else {
      // 关注、收藏
      getFansData(tokenId, contractAddr);
    }
  };
  const removeFansData = async (tokenId: string, contractAddr: string) => {
    const res: any = await removeFans(tokenId, contractAddr);
    if (res.message === 'success') {
      modifyCollectStatus(tokenId, contractAddr);
    }
  };
  const getFansData = async (tokenId: string, contractAddr: string) => {
    const res: any = await getFans(tokenId, contractAddr);
    if (res.message === 'success') {
      modifyCollectStatus(tokenId, contractAddr);
    }
  };
  const modifyCollectStatus = (id: string, contractAddr: string) => {
    const params = {
      tokenId:id,
      contractAddr:contractAddr,
      ownerAddr:ownerAddr
    }
    getFansByGoodsId(params).then((res: any) => {
      if (res && res.message === 'success') {
        const data: any = res.data;
        collectGoodsData.map((item: any) => {
          if (item.id === id) {
            item.collect = Number(data.collect);
            item.collectNum = data.collectNum;
            props.notify(Number(data.collect));
            // this.$emit('modifyCollectStatus', item.id);
          }
        });
      }
    });
  };
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
                <div className='name'>{item.name + '#' + item.tokenId}</div>
                <div className='price'>
                  {Math.floor(Number(item.price) * 10000) / 10000 + ` ${item?.coin || 'AITD'}`}
                </div>
              </div>
              <div className='collection-name'>{item.collectionName}</div>
            </div>

            <div className={`fav ${item % 2 == 0 ? 'active' : ''}`}>
              <img
                className={!item.collect ? 'favorite_border_gray' : 'favorite_red'}
                src={!item.collect ? require('../../../../assets/fg.png') : require('../../../../assets/fr.png')}
                onClick={(e) => toggleFansCollected(e, item)}
                alt=''
              />
              <span className={!item.collect ? '' : 'favorite'}>{item.collectNum}</span>
            </div>
          </Link>
        </div>
      );
    });
  const Wrapper = () => (
    <div className='collection-wrapper'>
      <div className={`g-list ${grid != 1 ? 'small' : ''}`}>
        <WrapItem />
      </div>
    </div>
  );

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
  );
};
