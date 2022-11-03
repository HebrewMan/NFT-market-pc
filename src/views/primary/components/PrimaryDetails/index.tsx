import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs } from './Tabs';
import { Inner } from './Inner';
import { getGood } from '../../../../api';
import './index.scss';
const btnDefaultList = [{ label: 'Description', value: 0 }];
const btnTabsList = [
  { label: 'Description', value: 0 },
  { label: '关于艺术家', value: 1 },
  { label: '明细', value: 2 },
  { label: '系列内容', value: 3 },
];
export const PrimaryDetails = () => {
  const [nftGoods, setNftGoods] = useState({});
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const { id, blindStatus, tags, nftId } = useParams() as any;
  useEffect(() => {
    if (id) {
      const blindId = tags && tags != '0' ? id : id || nftId;
      initGoodsInfo(blindId);
    }
  }, [id, tags]);
  const initGoodsInfo = async (blindId: string) => {
    const res: any = await getGood(blindId);
    const { description, imageUrl } = res.data.metadata;
    setNftGoods(res.data);
    setDescription(description);
    setImage(imageUrl);
  };
  const buttonList = () => {
    if (blindStatus && JSON.parse(blindStatus)) {
      return btnTabsList;
    }
    return btnDefaultList;
  };
  return (
    <div className='primary-details'>
      <div className='primary-details-wrap'>
        <div className='details-wrap-inner'>
          <div className='inner-container'>
            <Inner nftGoods={nftGoods} image={image} />
            <Tabs description={description} nftGoods={nftGoods} buttons={buttonList()} />
          </div>
        </div>
      </div>
    </div>
  );
};
