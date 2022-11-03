import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getFans, removeFans, getFansByGoodsId } from '../../../../api/fans';
import './index.scss';
export const MoreCollects = (props: any) => {
  const [detailsState, setDetailsState] = useState(false);
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

    const { id, collect } = item;
    if (collect) {
      removeFansData(id);
    } else {
      // 关注、收藏
      getFansData(id);
    }
  };
  const removeFansData = async (id: string) => {
    const res: any = await removeFans(id);
    if (res.message === 'success') {
      modifyCollectStatus(id);
    }
  };
  const getFansData = async (id: string) => {
    const res: any = await getFans(id);
    if (res.message === 'success') {
      modifyCollectStatus(id);
    }
  };
  const modifyCollectStatus = (id: string) => {
    getFansByGoodsId(id).then((res: any) => {
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
          <Link to={`/product-details/${item.id}`}>
            <div className='assets'>
              <img src={item.imageUrl} alt='' />
            </div>
            <div className='assets-info'>
              <div className='desc'>
                <div className='name'>{item.name + '#' + item.tokenId}</div>
                <div className='price'>{parseFloat(Number(item.price).toFixed(4)) + ' USDT'}</div>
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
        <h2>More from this collection</h2>
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
