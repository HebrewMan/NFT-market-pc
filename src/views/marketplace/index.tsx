import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Select } from './Select';
import { HeaderSearch } from '../../components/HeaderSearch';
import { useTranslation } from 'react-i18next';
import { getGoods, getListedNftList } from '../../api';
import { getFans, removeFans, getFansByGoodsId } from '../../api/fans';
import { useTouchBottom } from '../../hooks';
import { defaultParams, blindType, queryList } from '../../core/constants/marketplace';
import './index.scss';
import { isMobile } from 'react-device-detect';
import { Input, Spin } from 'antd';
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { intlFloorFormat } from 'Utils/bigNumber'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const MarketPlace = () => {
  const { t } = useTranslation()
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
  const [sort, setSort] = useState<any>("new");
  const [ownerAddr,setOwnerAddr] = useState('')
  const queryList = [
    { name: `${t('marketplace.recentlyListed')}`, value: 'new' },
    { name: `${t('marketplace.LowToHigh')}`, value: 'low' },
    { name: `${t('marketplace.highToLow')}`, value: 'high' },
  ];
  useEffect(() => {
    initData(params);
  }, [params, collect]);

  const initData = async (data: any) => {
    // const userWallet = localStorage.getItem('wallet') || null
    // const param = {
    //   ...data,
    // }
    setLoading(true);
    try {
      // getListedNftList getGoods
      const res: any = await getListedNftList(data);
      setTotal(res.data.total);

      // 过滤掉没有元数据的脏数据
      const list: any = [];
      res.data.records.map((item: any, index: string) => {
        if (item?.imageUrl != null) {
          list.push(item);
        }
      });
      setGoodsList([...goodsList, ...list]);
      setLoading(false);
      if (data.page >= Math.ceil(res.data.total / data.size)) {
        setIsMore(false);
      } else {
        setIsMore(true);
      }
    } catch (err: any) {
      setLoading(false);
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
      getFansCount(tokenId, contractAddr);
    }
  };
  // 取消收藏
  const removeFansData = (tokenId: string, contractAddr: string) => {
    removeFans(tokenId, contractAddr)
      .then((res: any) => {
        if (res && res.message === 'success') {
          modifyFansStatus(tokenId, contractAddr,);
        }
      })
      .catch((err: unknown) => {
        console.log('removeFans error', err);
      });
  };
  // 添加收藏
  const getFansCount = (tokenId: string, contractAddr: string) => {
    getFans(tokenId, contractAddr)
      .then((res: any) => {
        if (res && res.message === 'success') {
          modifyFansStatus(tokenId, contractAddr);
        }
      })
      .catch((err: any) => {
        console.log('getFans error', err);
      });
  };
  const modifyFansStatus = (id: string, contractAddr: string) => {
    const params = {
      tokenId:id,
      contractAddr:contractAddr,
      ownerAddr:ownerAddr
    }
    getFansByGoodsId(params).then((res: any) => {
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
    setSort(itemObj.value)
    setGoodsList([]);
    // 原有逻辑上调整接口后台所需入参 o.xx ..不理解
    let asc = false;
    if(itemObj.value === 'new'){
      asc = false
    }else{
      itemObj.value === 'high' ? asc = false : asc = true
    }
    const orders = [
      {
        asc: asc,
        column: itemObj.value === 'new' ? 'o.create_date' : 'o.price',
      },
    ];
    setParams({ ...params, orders, page: 1 });

    // useTouchBottom 页码不对的问题 修改
    if (pageRef.current > 1) {
      pageRef.current = 0;
    }
  };
  const CardItem = () => {
    return goodsList.map((item: any, index: number) => {
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
                  {intlFloorFormat(item.price,4) + ` ${item?.coin || 'AITD'}`}
                  {/* {Math.floor(Number(item.price) * 10000) / 10000 + ` ${item?.coin || 'AITD'}`} */}
                </div>
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
        <p>{t('common.noDataLong')}</p>
      </div>
    );
  };

  const getKeyWord = (value: string) => {
    setGoodsList([]);
    setParams({ ...params, name: value, page: 1 });
  };

  const handleChangeMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const temp = inputValue.match(/\d+(\.\d{0,8})?/);

    if (temp === null && inputMax === '') {
      setInputMin('');
      setGoodsList([]);
      setParams({ ...params, maxPrice: undefined, minPrice: undefined, page: 1 });
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
        setParams({ ...params, minPrice: Number(temp[0]), maxPrice: Number(inputMax), page: 1 });
      }
    } else {
      setInputMin('');
    }
  };

  const handleChangeMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const temp = inputValue.match(/\d+(\.\d{0,8})?/);

    if (temp === null && inputMin === '') {
      setInputMax('');
      setGoodsList([]);
      setParams({ ...params, maxPrice: undefined, minPrice: undefined, page: 1 });

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
        setParams({ ...params, minPrice: Number(inputMin), maxPrice: Number(temp[0]), page: 1 });
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

        <HeaderSearch getKeyWord={getKeyWord} keyWord={keyWord} placeholder={t('marketplace.serach')} />

        <div className='condition'>
          <Select list={queryList}  placeholder={t('marketplace.sortBy')} change={handleChangeQuery} value={sort} />
        </div>

        <div className='price'>
          {t('marketplace.price')}
          <Input
            className='min'
            value={inputMin}
            placeholder={t('marketplace.min') || undefined}
            style={{ width:84, height: 41}}
            onChange={handleChangeMin}
          />
          <span className='to'>{t('marketplace.to')}</span>
          <Input
            placeholder={t('marketplace.max') || undefined}
            value={inputMax}
            style={{ width:84, height:41}}
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
