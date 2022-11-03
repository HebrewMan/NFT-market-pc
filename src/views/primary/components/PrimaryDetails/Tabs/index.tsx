/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './index.scss';
const Table = (props: any) => {
  const { tableData } = props;
  const [fullImage, setFullImage] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const handleFullImage = (src: string) => {
    setImageSrc(src);
    setFullImage(true);
  };
  return (
    <div>
      <table className='desc-table'>
        <thead>
          <tr>
            <td className='td-left'>款式</td>
            <td>稀有度</td>
            <td>发布数量</td>
            <td>概率</td>
          </tr>
        </thead>
        <tbody>
          {tableData &&
            tableData.map((item: any) => {
              return (
                <tr key={item.id}>
                  <td className='styles'>
                    <img src={item.cover} alt='' width='40' height='40' onClick={() => handleFullImage(item.cover)} />
                    <span>{item.name}</span>
                  </td>
                  <td>
                    <img width='60' height='30' src={item.rarity} alt='' />
                  </td>
                  <td>{item.num}</td>
                  <td>{(item.concept * 100).toFixed(2)}%</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {fullImage && (
        <div className='image-viewer__wrapper'>
          <div className='image-viewer__mask'></div>
          <span className='close' onClick={() => setFullImage(false)}>
            <img src='/sol/close.svg' alt='' />
          </span>
          <div className='image-viewer__canvas'>
            <img className='image-viewer__img' src={imageSrc} alt='' />
          </div>
        </div>
      )}
    </div>
  );
};
const BlindTabs = (props: any) => {
  const nftGoods = props.nftGoods;
  const releaseTime = () => {
    return nftGoods.ctime?.substring(0, nftGoods.ctime.indexOf(' '));
  };
  return (
    <>
      {props.index === 1 && (
        <div className='desc-desc'>
          <p>{nftGoods.metadata?.artistDescription}</p>
        </div>
      )}
      {props.index === 2 && (
        <div className='description'>
          <ul>
            <li>
              <span>发布者：</span>
              <span>{nftGoods.metadata?.author}</span>
            </li>
            <li>
              <span>发布数量：</span>
              <span>{nftGoods.blindBox ? nftGoods?.blindBox.num : 0}</span>
            </li>
            <li>
              <span>发布时间：</span>
              <span>{releaseTime()}</span>
            </li>
          </ul>
        </div>
      )}

      {props.index === 3 && (
        <div>
          <Table tableData={nftGoods.blindBoxStyleList} />
        </div>
      )}
    </>
  );
};
export const Tabs = (props: any) => {
  const { description, nftGoods, buttons } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const { blindStatus } = useParams() as any;
  return (
    <div className='primary-desc'>
      <div className='desc-nav'>
        {buttons &&
          buttons.map((item: any, index: number) => (
            <button
              key={index}
              className={currentIndex === index ? 'active' : ''}
              onClick={() => setCurrentIndex(index)}
            >
              {item.label}
            </button>
          ))}
      </div>
      <div className='desc-details'>
        {currentIndex === 0 && (
          <div className='desc-desc'>
            <p>{description || nftGoods.metadata?.description}</p>
          </div>
        )}
        {/* 盲盒tabs */}
        {blindStatus && JSON.parse(blindStatus) && <BlindTabs nftGoods={nftGoods} index={currentIndex} />}
      </div>
    </div>
  );
};
