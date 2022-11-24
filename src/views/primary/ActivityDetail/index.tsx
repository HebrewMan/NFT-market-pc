import React from 'react';
import { Divider } from 'antd';
import { PHeader } from '../components/Header';
import { CommTimer } from '../components/Timer';
import './index.scss';

// 一级市场外部活动详情页
export const ActivityDetail = () => {
  const details: string = localStorage.getItem('details') ?? '';
  const actityDetail: string = localStorage.getItem('actityDetail') ?? '';
  const primaryObj = JSON.parse(details);
  const activeInfo = JSON.parse(actityDetail);

  const handleBuy = () => {
    if (activeInfo?.buyUrl) {
      window.location.href = activeInfo.buyUrl;
    }
  };

  const getTimer = (row: any) => {
    return row.status === 3 || row.status === 2 ? [] : row.countdown;
  };

  return (
    <div className={`active-detail-container`}>
      <div className='banner'>
        <img src={activeInfo?.coverUrl} alt='detail-bg' />
      </div>
      <div className='timer-box'>
        {activeInfo && (
          <div className='timer'>
            <CommTimer activityStatus={Number(activeInfo?.status)} endTime={getTimer(activeInfo)} hiddenMore={true} />
          </div>
        )}
      </div>
      <PHeader primaryObj={primaryObj} />
      <div className='price-box'>
        <div>
          <p>Price</p>
          <p className='num'>{activeInfo?.price}</p>
        </div>
        <Divider type='vertical' />
        <div>
          <p>Total volume</p>
          <p className='num'>{activeInfo?.totalNum || '-'}</p>
        </div>
      </div>
      <div className='btn-box'>
        <button onClick={handleBuy}>Buy Now</button>
      </div>
    </div>
  );
};
