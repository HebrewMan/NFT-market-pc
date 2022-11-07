import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CommTimer } from '../Timer';
import { useTouchBottom } from '../../../../hooks';
import { getPrimaryActivityList } from '../../../../api/primary';
import useWindowDimensions from '../../../../utils/layout';
import './index.scss';

export const MaskImage = (props: any) => {
  // eslint-disable-next-line react/prop-types
  const { width, status } = props;
  const maskTitle = (status: any) => {
    if (status === 3 || status === null) {
      return 'Sold Out';
    } else if (status === 2) {
      return 'End';
    } else if (status === 0) {
      return 'To Begin';
    } else {
      return '';
    }
  };
  return (
    <div className='spring-logo' style={{ width: width }}>
      <span>{maskTitle(status)}</span>
    </div>
  );
};

export const PList = () => {
  const { width } = useWindowDimensions();
  const [activityList, setActivityList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isMore, setIsMore] = useState(true);
  const size = 20;
  useEffect(() => {
    initList();
  }, [page]);
  const initList = async () => {
    const res: any = await getPrimaryActivityList({ page, size });
    setActivityList([...activityList, ...res.data.records]);
    setPage(res?.data?.current);
    if (page >= Math.ceil(res.data.total / size)) {
      setIsMore(false);
    }
  };
  // 触底加载
  const handleLoadMore = () => {
    console.log(isMoreRef.current, 'isMoreRef.current');
    if (isMoreRef.current) {
      const newPage = pageRef.current + 1;
      setPage(newPage);
    }
  };
  const { isMoreRef, pageRef } = useTouchBottom(handleLoadMore, page, isMore);
  const ListItem = ({ activityList }: any) => {
    const history = useHistory();
    const handleToMarket = (item: any) => {
      // 已售罄不可点击查看详情
      if (item?.status === 3 || item?.status === null) {
        return;
      }
      const info = {
        name: item.name,
        description: item.description,
      };
      localStorage.setItem('details', JSON.stringify(info));
      history.push(`/marketlist/${item.id}/${item.status}`);
    };
    const getTimer = (row: any) => {
      return row.status === 3 || row.status === 2 ? [] : row.countdown;
    };
    return activityList.map((item: any, index: number) => {
      return (
        <li className='wrap-box-li' key={index} onClick={() => handleToMarket(item)}>
          <div className='wrap-box-left'>
            <div className='wrap-box-logo'>
              <img src={item.coverUrl} alt='' />
            </div>
            {item.status !== 1 ? <MaskImage status={item.status} width={'100%'} /> : <></>}
          </div>
          <div className='wrap-box-right'>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <CommTimer activityStatus={Number(item.status)} endTime={getTimer(item)} />
            {width > 1024 && (
              <div>
                <a> More → </a>
              </div>
            )}
          </div>
        </li>
      );
    });
  };
  return (
    <div className={`primary-list-wrap`}>
      <div className='list-wrap-box'>
        <ul>
          <ListItem activityList={activityList} />
        </ul>
      </div>
    </div>
  );
};
