import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { PHeader } from '../Header';
import { MaskImage } from '../List';
import { getActivityProduction } from '../../../../api/primary';
import { useTouchBottom } from '../../../../hooks';
import './index.scss';
import useWindowDimensions from '../../../../utils/layout';

export const MarketList = () => {
  const { width } = useWindowDimensions();
  const details: string = localStorage.getItem('details') ?? '';
  const primaryObj = JSON.parse(details);
  const history = useHistory();
  const { id, status } = useParams() as any;
  const [marketList, setMarketList] = useState<any[]>([]);
  const size = 20;
  const [page, setPage] = useState(1);
  // 此处增加了一个变量用于保存 是否还有更多数据
  const [isMore, setIsMore] = useState(true);
  const filterItem = () => {
    return marketList.map((item: any) => {
      return {
        ...item,
        status: Number(item?.residueNum) === 0 && Number(item?.status) === 1 ? 3 : item?.status,
      };
    });
  };
  const handleLoadMore = () => {
    console.log(isMoreRef.current, 'isMoreRef.current');
    if (isMoreRef.current) {
      const newPage = pageRef.current + 1;
      setPage(newPage);
    }
  };
  const { isMoreRef, pageRef } = useTouchBottom(handleLoadMore, page, isMore);
  useEffect(() => {
    initList({ page, size });
  }, [id, page]);
  // 初始化列表
  const initList = async (data: any) => {
    const res: any = await getActivityProduction(Number(id), data);
    const dataList = res?.data?.records;
    setPage(res?.data?.current);
    setMarketList([...marketList, ...dataList]);
    console.log(page, 'page');
    if (page >= Math.ceil(res.data.total / size)) {
      setIsMore(false);
    }
    // 存储倒计时
    // const timeList = res.data.records.map((item: any) => {
    //   return {
    //     goodsId: item.tokenId,
    //     downTime: {
    //       startDate: item.startDate,
    //       endDate: item.endDate,
    //     },
    //   };
    // });
    // localStorage.setItem('timeArr', JSON.stringify(timeList));
  };

  const handleToDetails = (item: any) => {
    const { nftId, blindBoxId } = item; // id 标识盲盒和nft
    history.push(`/primary-details/${nftId}/${blindBoxId ? 1 : 0}`);
  };

  return (
    <div className={`market-list-wrap`}>
      <PHeader primaryObj={primaryObj} />
      <div className='list-wrap'>
        <ul>
          {filterItem().map((item) => {
            return (
              <a className='list-link' key={item?.tokenId} onClick={() => handleToDetails(item)}>
                <li>
                  <div className='li-img'>
                    <img src={item?.imageUrl} alt='' />
                  </div>
                  <div className='li-footer'>
                    <div className='li-details'>
                      <h3>{item?.name + '#' + item?.tokenId}</h3>
                      <p>
                        {item?.blindBoxId !== 0 ? (
                          <img src={require('../../../../assets/blind_box.svg')} className='blind_box'></img>
                        ) : (
                          <></>
                        )}
                        <span>x {item?.blindBoxId !== 0 ? item?.num : 1}</span>
                      </p>
                    </div>
                    <div className='li-price li-details'>
                      <h1>Price</h1>
                      <div className='eth-price'>
                        <img width='18' src={require('../../../../assets/usdt.png')} alt='' />
                        <span>{item?.price}</span>
                      </div>
                    </div>
                  </div>
                  {item?.status !== 1 ? <MaskImage status={item?.status} /> : <></>}
                </li>
              </a>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
