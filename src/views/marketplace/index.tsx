import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Select } from './Select';
import { HeaderSearch } from '../../components/HeaderSearch';
import { getGoods } from '../../api';
import { getFans, removeFans, getFansByGoodsId } from '../../api/fans';
import { useTouchBottom } from '../../hooks';
import { defaultParams, blindType, queryList } from '../../core/constants/marketplace';
import './index.scss';
import { Input, Spin } from 'antd';
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const MarketPlace = () => {
  const [goodsList, setGoodsList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [grid, setGrid] = useState(1);
  const [params, setParams] = useState<any>({ ...defaultParams });
  const [collect, setCollect] = useState(false); // 收藏状态
  const [keyWord, setKeyWord] = useState('');
  const [inputMin, setInputMin] = useState('');
  const [inputMax, setInputMax] = useState('');
  const [isMore, setIsMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initData(params);
  }, [params, collect]);

  const initData = async (data: any) => {
    setLoading(true);
    const res: any = await getGoods(data);

    setTotal(res.data.total);
    setGoodsList([...goodsList, ...res.data.records]);
    setLoading(false);
    if (data.page >= Math.ceil(res.data.total / data.size)) {
      setIsMore(false);
    } else {
      setIsMore(true);
    }
  };
  const toggleFansCollected = (e: any, item: any) => {
    e.preventDefault();

    const { id, collect } = item;
    if (collect) {
      removeFansData(id);
    } else {
      // 关注、收藏
      getFansCount(id);
    }
  };
  // 取消收藏
  const removeFansData = (id: string) => {
    removeFans(id)
      .then((res: any) => {
        if (res && res.message === 'success') {
          modifyFansStatus(id);
        }
      })
      .catch((err: unknown) => {
        console.log('removeFans error', err);
      });
  };
  // 添加收藏
  const getFansCount = (id: string) => {
    getFans(id)
      .then((res: any) => {
        if (res && res.message === 'success') {
          modifyFansStatus(id);
        }
      })
      .catch((err: any) => {
        console.log('getFans error', err);
      });
  };
  const modifyFansStatus = (id: string) => {
    getFansByGoodsId(id).then((res: any) => {
      if (res && res?.data !== null) {
        const data = res.data;
        setGoodsList([]);
        setCollect(!collect);
        goodsList.forEach((item: any) => {
          if (item.id === id) {
            item.collect = Number(data.collect);
            item.collectNum = data.collectNum;
          }
        });
      }
    });
  };

  // 触底加载
  const handleLoadMore = () => {
    if (isMoreRef.current) {
      const newPage = pageRef.current + 1;
      setParams((params: any) => {
        return { ...params, page: newPage };
      });
    } else {
      pageRef.current = 1;
    }
  };

  const { isMoreRef, pageRef } = useTouchBottom(handleLoadMore, params.page, isMore);

  const handleChangeQuery = (itemObj: any) => {
    setGoodsList([]);
    setParams({ ...params, data: { ...params.data, sort: itemObj.value }, page: 1 });

    // useTouchBottom 页码不对的问题 修改
    if (pageRef.current > 1) {
      pageRef.current = 0;
    }
  };
  const CardItem = () => {
    return goodsList.map((item: any, index: number) => {
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
                src={!item.collect ? require('../../assets/fg.png') : require('../../assets/fr.png')}
                onClick={(e) => toggleFansCollected(e, item)}
                alt=''
              />
              <span className={!item.collect ? '' : 'favorite'}>{item.collectNum}</span>
            </div>
          </Link>
        </div>
      );
    });
  };

  const listEmpty = () => {
    return (
      <div className='empty-wrap'>
        <img src={require('../../assets/empty.png')} alt='' />
        <p>No data available for the time being.</p>
      </div>
    );
  };

  const getKeyWord = (value: string) => {
    setGoodsList([]);
    setParams({ ...params, data: { ...params.data, keyWord: value }, page: 1 });
  };

  const handleChangeMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const temp = inputValue.match(/\d+(\.\d{0,2})?/);

    if (temp === null && inputMax === '') {
      setInputMin('');
      setGoodsList([]);
      setParams({ ...params, data: { ...params.data, maxPrice: undefined, minPrice: undefined }, page: 1 });
      return;
    }

    if (temp) {
      // 非法校验 输入字符砖 @等符号 取消请求
      if (temp[0] && inputMin === temp[0]) {
        return;
      }

      setInputMin(temp[0]);

      // max > min 取消请求
      if (Number(inputMax) < Number(temp[0])) {
        return;
      }

      if (inputMax) {
        setGoodsList([]);
        setParams({ ...params, data: { ...params.data, minPrice: temp[0], maxPrice: inputMax }, page: 1 });
      }
    } else {
      setInputMin('');
    }
  };

  const handleChangeMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const temp = inputValue.match(/\d+(\.\d{0,2})?/);

    if (temp === null && inputMin === '') {
      setInputMax('');
      setGoodsList([]);
      setParams({ ...params, data: { ...params.data, maxPrice: undefined, minPrice: undefined }, page: 1 });

      return;
    }

    if (temp) {
      if (temp[0] && inputMax === temp[0]) {
        return;
      }

      setInputMax(temp[0]);

      if (Number(inputMin) > Number(temp[0])) {
        return;
      }

      if (inputMin) {
        setGoodsList([]);
        setParams({ ...params, data: { ...params.data, minPrice: inputMin, maxPrice: temp[0] }, page: 1 });
      }
    } else {
      setInputMax('');
    }
  };

  return (
    <div className='marketplace'>
      <div className='filter'>
        <div className='grid'>
          <label className={`el ${grid == 1 ? 'active' : ''}`} onClick={() => setGrid(1)}>
            <input type='radio' name='grid' value={1} />
            <img src={require('../../assets/grid_view_gray.png')} className='grid_view_gray' alt='' />
            <img src={require('../../assets/grid_view_blue.png')} className='grid_view_black' alt='' />
          </label>
          <label className={`el ${grid == 2 ? 'active' : ''}`} onClick={() => setGrid(2)}>
            <input type='radio' name='grid' value={2} />
            <img src={require('../../assets/apps_gray.png')} className='apps_gray' alt='' />
            <img src={require('../../assets/apps_blue.png')} className='apps_black' alt='' />
          </label>
        </div>

        <HeaderSearch getKeyWord={getKeyWord} keyWord={keyWord} placeholder={'Please enter NFT/ collection'} />

        <div className='condition'>
          <Select list={queryList} placeholder={'Sort By'} change={handleChangeQuery} value={params.data.sort} />
        </div>

        <div className='price'>
          Price
          <Input
            className='min'
            value={inputMin}
            placeholder='Min'
            style={{ width: 50, height:34 }}
            onChange={handleChangeMin}
          />
          <span className='to'>To</span>
          <Input
            placeholder='Max'
            value={inputMax}
            style={{ width:50, height:34 }}
            onChange={handleChangeMax}
          />
        </div>
      </div>
      <div className={`g-list ${grid == 2 ? 'small' : ''}`}>
        {goodsList.length > 0 && CardItem()}
        {goodsList.length === 0 && listEmpty()}
      </div>
      {loading ? (
        <div className='loading-wrap'>
          <Spin indicator={antIcon} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
