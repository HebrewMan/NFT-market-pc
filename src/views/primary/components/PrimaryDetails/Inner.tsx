import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import { MaskImage } from '../List';
import { ProDetails } from './Details';

export const MaskImage = (props: any) => {
  const { t } = useTranslation()
  let { width, status, activityStatus, type } = props;
  const maskTitle = (status: number) => {
    // 该nft配置了活动
    if (activityStatus !== null) {
      if (activityStatus === 3 || activityStatus === null) {
        return t("primary.soldOut");
      } else if (activityStatus === 2) {
        return t("primary.end");
      } else if (activityStatus === 0) {
        return t("primary.begin");
      } else {
        return '';
      }
    } else {
      if (status === 3 || type === 2) {
        return t('primary.soldOut');
      } else if (status === 0 || status === 1) {
        return t("primary.begin");
      } else {
        return '';
      }
    }
  };
  return (
    <div className='spring-logo' style={{ width: width }}>
      <span>{maskTitle(status)}</span>
    </div>
  );
};

export const Inner = (props: any) => {
  const { tags, metadataId } = useParams() as any;
  const { nftGoods, image } = props;
  const isShowMask = () => {
    if (tags == '0') {
      return false;
    }
    return nftGoods.countdownType !== 1;
  };
  const isSellOut = () => {
    return nftGoods?.blindBox?.availableNum === 0;
  };
  // status 0： 创建 1待上架  2：售卖中  3：强制下架',
  const isPut = () => {
    return nftGoods.status === 2;
  };

  return (
    <div className='inner-details'>
      <div className='details-logo'>
        <img src={image} alt='' />
        {!metadataId && (tags == '0' || isShowMask() || isSellOut()) && !isPut() ? (
          <MaskImage status={nftGoods.status} activityStatus={nftGoods.activityStatus} type={nftGoods.type} />
        ) : (
          <></>
        )}
      </div>
      <ProDetails nftGoods={nftGoods} />
    </div>
  );
};
