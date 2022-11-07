import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Portal from '../../components/Dialog';
import { HeaderSearch } from '../../components/HeaderSearch';
import { Select } from '../marketplace/Select';
import { formatAdd } from '../marketplace/utils';
import { Dropdown, Menu, Space, Typography, message, Select as SelectAntd } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import useWindowDimensions from '../../utils/layout';
import { getGoods, getSelfGoods, getOtherPersonGoods, getGood, createIpfs, getGoodsByCollectionId } from '../../api';
import { getFans, getFansByGoodsId, removeFans } from '../../api/fans';
import { getAccountInfo, updateUserInfo } from '../../api/user';
import { getCollectionDetails } from '../../api/collection';
import { uploadFileCheck } from '../../utils/utils';
import { useTouchBottom } from '../../hooks';
import './index.scss';

interface accountInfoProps {
  name: string;
  username: string;
  userAddr: string;
  imageUrl: string;
  headUrl: string;
  bannerUrl: string;
  id: string;
}
interface collectionsDataProps {
  id: number;
  collect: number;
  collectNum: number;
  imageUrl: string;
  collectionName: string;
  name: string;
  price: number;
}
const statusList = [
  {
    label: 'status',
    name: 'All',
    value: 9,
  },
  {
    label: 'status',
    name: 'For Sale',
    value: 1,
  },
  {
    label: 'status',
    name: 'Selling',
    value: 2,
  },
  {
    label: 'status',
    name: 'Force Cancel',
    value: 3,
  },
];

const sortList = [
  {
    label: 'sort',
    name: 'Price High to Low',
    value: 'high',
  },
  {
    label: 'sort',
    name: 'Price Low to High',
    value: 'low',
  },
];

const tabsData = ['Collected', 'Favorited'];

export const Account: React.FC<any> = () => {
  const [grid, setGrid] = useState(1);
  const { width } = useWindowDimensions();
  const [accountInfo, setAccountInfo] = useState<accountInfoProps>({
    name: '',
    username: '',
    userAddr: '',
    imageUrl: '',
    headUrl: '',
    bannerUrl: '',
    id: '',
  });

  const [collectionsData, setCollectionsData] = useState<collectionsDataProps[]>([]);
  const collectRef = useRef(collectionsData);
  const { id, address } = useParams<{ id: string | undefined; address: string }>();
  const [keyWord, setKeyWord] = useState<any>();
  const [sort, setSort] = useState<any>();
  const [status, setStatus] = useState<any>();
  const [collectAddr, setCollectAddr] = useState<any>(null);
  // const [createAddr, setCreateAddr] = useState<any>(null);
  const [ownerAddr, setOwnerAddr] = useState<any>(null);
  const [reset, setReset] = useState(false);
  const [mobileSelect, setMobileSelect] = useState(0);
  const defaultData = {
    collectAddr: collectAddr,
    // createAddr: createAddr,
    ownerAddr: ownerAddr || address,
    keyWord: keyWord,
    sort: sort,
    status: status,
  };

  const [pageCurrent, setPageCurrent] = useState(1);
  const [httpData, setHttpData] = useState({
    page: pageCurrent,
    size: 12,
    data: { ...defaultData },
  });
  const [isMore, setIsMore] = useState(false);
  const [goodsId, setGoodsId] = useState<Number>();
  const walletAccount: string = localStorage.getItem('wallet') || '';
  const [visible, setVisible] = useState(false);
  const [errorReason, setErrorReason] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const history = useHistory();
  const defaultHeader = require('../../assets/default_header.png');
  const defaulBannerUrl = require('../../assets/default_banner.jpg');
  const [total, setTotal] = useState(0);
  const { page, size } = httpData;
  const [mobileLabel, setMobileLabel] = useState([
    {
      value: '0',
      label: 'Collected',
    },
  ]);
  // 判断方法回调返回值
  const isOwner = () => {
    return (accountInfo?.userAddr && accountInfo?.userAddr === walletAccount) || address === walletAccount;
  };
  // 上传图片
  const handleUploadFile = async (e: any) => {
    const file = e.target.files[0];

    const check: boolean = uploadFileCheck(
      file,
      ['jpg', 'png', 'gif'],
      1024 * 1024 * 5,
      'Uploading image should be JPG/PNG/GIF',
      'Uploaded image should be less than 5M',
    );
    if (!check) {
      return;
    }

    const params = new FormData();
    params.append('file', file);
    const res: any = await createIpfs(params);
    const info = {
      ...accountInfo,
      imageUrl: res.data,
    };
    setAccountInfo({ ...accountInfo, imageUrl: res.data });
    await updateGeneralInfo(info);
  };
  // 更新头像接口
  const updateGeneralInfo = async (info: any) => {
    const res: any = await updateUserInfo(info);
    if (res.message === 'success') {
      message.success('User avatar updated successfully！');
    }
  };
  const handleCopy = (address: string) => {
    const domUrl = document.createElement('input');
    domUrl.value = address;
    domUrl.id = 'creatDom';
    document.body.appendChild(domUrl);
    domUrl.select(); // 选择对象
    document.execCommand('Copy'); // 执行浏览器复制命令
    const creatDom: any = document.getElementById('creatDom');
    creatDom.parentNode.removeChild(creatDom);
    message.success('Copy Successful!');
  };
  const clickedTab = (index: number) => {
    const typeParams = {
      ...httpData,
      page: pageCurrent,
    };
    pageRef.current = 0;
    const cloneAddr = isOwner() ? walletAccount : address;
    if (index === 0) {
      typeParams.data.collectAddr = null;
      // typeParams.data.createAddr = null;
      typeParams.data.ownerAddr = cloneAddr;
      setOwnerAddr(cloneAddr);
      // } else if (index === 1) {
      //   typeParams.data.collectAddr = null;
      //   typeParams.data.createAddr = cloneAddr;
      //   typeParams.data.ownerAddr = null;
      //   setCreateAddr(cloneAddr);
    } else if (index === 1) {
      typeParams.data.collectAddr = cloneAddr;
      // typeParams.data.createAddr = null;
      typeParams.data.ownerAddr = null;
      setCollectAddr(cloneAddr);
    }
    setCollectionsData([]);
    if (Math.ceil(total / size) > page) {
      setIsMore(true);
    }
    setCurrentIndex(index);
    setHttpData(() => ({ ...typeParams }));
  };

  const getKeyWord = (value: string) => {
    setHttpData(() => {
      setKeyWord(value);
      if (Math.ceil(total / size) > page) {
        setIsMore(true);
      }
      setCollectionsData([]);
      return {
        page: pageCurrent,
        size,
        data: {
          ...httpData.data,
          keyWord: value,
        },
      };
    });
  };

  const handleSort = (item: any) => {
    const params = {
      ...httpData,
      page: pageCurrent,
    };
    pageRef.current = 0;
    setSort(item.value);
    params.data.sort = item.value;
    params.data.status = undefined;
    setPageCurrent(1);
    setCollectionsData([]);
    if (Math.ceil(total / size) > page) {
      setIsMore(true);
    }
    setHttpData(() => ({ ...params, page: 1 }));
  };

  const handleStatus = (item: any) => {
    const params = {
      ...httpData,
      page: pageCurrent,
    };
    pageRef.current = 0;
    setStatus(item.value);
    params.data.status = item.value;
    params.data.sort = '';
    setPageCurrent(1);
    setCollectionsData([]);
    if (Math.ceil(total / size) > page) {
      setIsMore(true);
    }
    setHttpData(() => ({ ...params, page: 1 }));
  };

  // 收藏或取消收藏
  const toggleFansCollected = (e: any, item: any) => {
    e.preventDefault();

    const { id, collect } = item;
    if (collect) {
      removeFansCollect(id);
    } else {
      // 关注、收藏
      addFansCollect(id);
    }
  };
  const getFansListByNftId = async (id: string | number) => {
    const res: any = await getFansByGoodsId(id);
    if (res?.message === 'success') {
      const list = collectionsData.map((item: any) => {
        return item.id === id
          ? {
              ...item,
              collect: Number(res.data.collect),
              collectNum: Number(res.data.collectNum),
            }
          : { ...item };
      });
      setCollectionsData(list);
    }
  };
  // 添加收藏
  const addFansCollect = async (id: string | number) => {
    const res: any = await getFans(id);
    if (res.message === 'success') {
      getFansListByNftId(id);
    }
  };
  // 取消收藏
  const removeFansCollect = async (id: string) => {
    const res: any = await removeFans(id);
    if (res.message === 'success') {
      getFansListByNftId(id);
    }
  };
  // 路由跳转
  const handleToDetails = (item: any) => {
    // 跳转到一级市场活动商品
    if (item.type === 1) {
      return history.push(`/primary-details/${item.id}/${0}`);
    }
    if (item.belongsId === 0) {
      return history.push(`/product-details/${item.id}`); // 跳转二级市场商品详情页
    } else {
      // 跳转至盲盒详情页
      return history.push(
        `/primary-details/${item.id}/${item.status}/${true}/${item.tokenId}/${item.openStatus}/${item.metadataId}`,
      );
    }
  };
  // const getErrorReason = async (id: string) => {
  //   const res: any = await getGood(id);
  //   if (res.message === 'success') {
  //     setVisible(true);
  //     setErrorReason(res.data.auditDetails);
  //     setGoodsId(res.data.metadata.goodsId);
  //   }
  // };
  // const handleChecked = () => {
  //   history.push(`/create/${goodsId}`);
  // };
  // 初始化页面详情数据
  useEffect(() => {
    if (id && id !== '0') {
      getAccountInfoById();
    }
  }, [id]);
  useEffect(() => {
    if (address) {
      getAccountInfoByAddress();
    }
  }, [address]);

  // 滚动加载更多
  const handleLoadMore = () => {
    if ((id && id !== '0') || address) {
      if (isMoreRef.current) {
        const newPage = pageRef.current + 1;
        setPageCurrent(newPage);
        setHttpData({ ...httpData, page: newPage });
      }
    }
  };
  const { isMoreRef, pageRef } = useTouchBottom(handleLoadMore, pageCurrent, isMore);

  useEffect(() => {
    if (accountInfo?.userAddr || accountInfo?.id) {
      getCollectGoods({ ...httpData, ...{ data: { ...httpData.data } } });
    }
  }, [httpData, accountInfo?.userAddr, accountInfo?.id]);

  // 通过合集id获取账户详情基本信息
  const getAccountInfoById = async () => {
    setCollectionsData([]);
    const res = await getCollectionDetails(Number(id));
    setAccountInfo(res.data);
    if (accountInfo?.id) {
      getCollectGoods({ ...httpData, ...{ data: { ...httpData.data } } });
    }
  };
  // 根据用户地址获取账户信息
  const getAccountInfoByAddress = async () => {
    setCollectionsData([]);
    const res: any = await getAccountInfo(address);
    setAccountInfo(res.data);
    if (accountInfo?.userAddr) {
      getCollectGoods({ ...httpData, ...{ data: { ...httpData.data } } });
    }
  };
  // 统一处理列表渲染及是否需要加载
  const loaderList = (data: any, total: number, flag: boolean) => {
    if (!flag) {
      setCollectionsData(() => {
        return data;
      });
    } else {
      setCollectionsData(() => {
        return [...collectionsData, ...data];
      });
    }
    setTotal(total);
    if (Math.ceil(total / size) > page) {
      setIsMore(true);
    }
    // if (page >= Math.round(total / httpData.size)) {
    //   setIsMore(false);
    // }
  };
  // 通过合集id及市场类型获取商品列表
  const getCollectsById = async (params: any) => {
    const res: any = await getGoodsByCollectionId(params);
    const { records, total, current } = res.data;
    collectRef.current = records;
    setPageCurrent(current);
    loaderList(collectRef.current, total, true);
  };
  // 通过合集id获取当前用户所属的商品列表
  // const getSelfGoodsById = async (deepParams: any, flag: boolean) => {
  //   const res: any = await getSelfGoods(deepParams);
  //   const { records, total, current } = res.data;
  //   collectRef.current = records;
  //   setPageCurrent(current);
  //   loaderList(collectRef.current, total, flag);
  // };
  // 查询他人用户的商品
  const getOtherAccountGoods = async (typeParams: any) => {
    const res: any = await getOtherPersonGoods(address, typeParams);
    const { records, total, current } = res.data;
    collectRef.current = records;
    setPageCurrent(current);
    loaderList(collectRef.current, total, true);
  };
  // 获取当前账户下的所有商品，包括盲盒
  // const getCollectGoods = (typeParams: any, flag: boolean = true) => {
  //   const deepParams = {
  //     data: {
  //       ...typeParams.data,
  //       collectionId: id,
  //       ownerAddr: currentIndex == 0 ? address : '',
  //     },
  //     page: typeParams.page,
  //     size,
  //   };
  //   if (id && id !== '0' && !isOwner()) {
  //     // typeParams.data.collectionId = id
  //     delete deepParams.data.ownerAddr;
  //     getCollectsById(deepParams);
  //   }
  //   else if (id && id !== '0' && isOwner()) {
  //     delete deepParams.data.ownerAddr;
  //     getSelfGoodsById(deepParams, flag);
  //   }
  //   else if (address && isOwner()) {
  //     delete deepParams.data.collectionId;
  //     getSelfGoodsById(deepParams, flag);
  //   }
  //   else if (address && !isOwner()) {
  //     // 查询别人的nft
  //     getOtherAccountGoods(typeParams);
  //   } else {
  //     getCollectsById({ page, size });
  //   }
  // };
  const getCollectGoods = (typeParams: any) => {
    const deepParams = {
      data: {
        ...typeParams.data,
        collectionId: id,
        ownerAddr: currentIndex === 0 ? address || walletAccount : '',
      },
      page: typeParams.page,
      size,
    };
    if (id && id !== '0') {
      // 通过合集id查询nft
      delete deepParams.data.ownerAddr;
      getCollectsById(deepParams);
    } else if (address) {
      // 通过地址查询nft
      delete deepParams.data.collectionId;
      getOtherAccountGoods(deepParams);
    } else {
      getCollectsById({ page, size });
    }
  };
  const handleReset = () => {
    setKeyWord('');
    setSort('');
    setStatus(undefined);
    setReset(!reset);
    const resetParams = {
      ...httpData,
      page: 1,
      size,
    };
    resetParams.data.keyWord = '';
    resetParams.data.status = undefined;
    resetParams.data.sort = '';
    pageRef.current = 0;
    setPageCurrent(1);
    setCollectionsData([]);
    if (Math.ceil(total / size) > page) {
      setIsMore(true);
    }
    setHttpData(() => ({ ...resetParams }));
  };

  const handleBannerImage = (e: any) => {
    const file = e.target.files[0];

    const check: boolean = uploadFileCheck(
      file,
      ['jpg', 'png', 'gif'],
      1024 * 1024 * 5,
      'Uploading image should be JPG/PNG/GIF',
      'Uploaded image should be less than 5M',
    );
    if (!check) {
      return;
    }

    const params = new FormData();
    params.append('file', file);
    createIpfs(params).then((res: any) => {
      setAccountInfo({ ...accountInfo, bannerUrl: res.data });
      updateGeneralInfo({ ...accountInfo, bannerUrl: res.data });
    });
  };

  const Tabs = (props: any) => {
    const changeIndex = (index: number) => {
      props.clickedTab(index);
    };
    return (
      <ul className='account-tabz'>
        {tabsData.map((item, index) => (
          <li key={index} className={currentIndex === index ? 'active' : ''} onClick={() => changeIndex(index)}>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  const MobileTabs = (props: any) => {
    const handleChange = (value: any) => {
      const _value: any = JSON.parse(JSON.stringify(value));
      setMobileLabel([{ value: _value?.value, label: _value?.label }]);
      props.clickedTab(Number(_value?.value));
    };
    return (
      <SelectAntd
        labelInValue
        // defaultValue={{
        //   value: '0',
        //   label: 'Collected',
        // }}
        value={mobileLabel}
        onChange={handleChange}
        className='mobileSelect'
      >
        <SelectAntd.Option value='0'>Collected</SelectAntd.Option>
        {/* <SelectAntd.Option value='1'>Created</SelectAntd.Option> */}
        <SelectAntd.Option value='1'>Favorited</SelectAntd.Option>
      </SelectAntd>
    );
  };

  const listEmpty = () => {
    return (
      <div className='empty-wrap'>
        <img src={require('../../assets/empty.png')} alt='' />
        <p>No data available for the time being.</p>
      </div>
    );
  };

  const CardItem = () => {
    return collectionsData.map((item: any, index: number) => {
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

  return (
    <div className='account'>
      <div className={`banner ${accountInfo?.bannerUrl ? 'set' : ''}`}>
        <img src={accountInfo?.bannerUrl ? accountInfo?.bannerUrl : defaulBannerUrl} />
        <div className='add'>
          Add a banner ima
          <input type='file' name='media' id='media' onChange={(e) => handleBannerImage(e)} />
        </div>
        <div className='edit'>
          <img src={require('../../assets/edit_banner.png')} alt='' />
          <span>Edit Banner</span>
          <input type='file' name='media' id='media' onChange={(e) => handleBannerImage(e)} />
        </div>
      </div>
      <div className='account-content-wrap'>
        <div className='account-header--main'>
          <div>
            <div className='user-img'>
              <img
                className='header-img'
                src={!address ? accountInfo?.headUrl : accountInfo?.imageUrl || defaultHeader}
                alt=''
              />
              {address && isOwner() && (
                <>
                  <input type='file' name='files' accept='image/*' id='files' onChange={(e) => handleUploadFile(e)} />
                  <div className='ico'>
                    <img src={require('../../assets/edit_white.svg')} alt='' />
                    <span>Edit</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className='account-info'>
            <div className='account-title'>
              {(accountInfo?.username?.startsWith('0x')
                ? accountInfo?.username?.substr(2, 6)
                : accountInfo?.username) ||
                accountInfo?.name ||
                'Unnamed'}
            </div>
            <div className='account-subtitle'>
              <strong>{formatAdd(address)}</strong>
              {address && (
                <img
                  src={require('../../assets/content_copy_gray.svg')}
                  className='svg-img'
                  alt=''
                  onClick={() => handleCopy(address)}
                />
              )}
            </div>
          </div>

          {address && <div className='select-wrap'>{<Tabs clickedTab={clickedTab} />}</div>}
        </div>
        <div className='account-all-collects'>
          <div className='info'>
            <div className='info-collections'>
              <div className='info-flex'>
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

                <HeaderSearch
                  getKeyWord={getKeyWord}
                  reset={reset}
                  keyWord={keyWord}
                  placeholder={'Please enter NFT/ collection'}
                />

                <div className='infoFilter'>
                  <Select value={sort} list={sortList} change={handleSort} />

                  <Select value={status} list={statusList} change={handleStatus} />

                  {/* <button className='reset-btn' onClick={handleReset}>
                    Reset
                  </button> */}
                </div>
              </div>
              <div className={`info-main info-main--max`}>
                <div className={`g-list ${grid == 2 ? 'small' : ''}`}>
                  {collectionsData.length > 0 && CardItem()}
                  {collectionsData.length === 0 && listEmpty()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Portal
        closeText={'取消'}
        checkedText={'去编辑'}
        content={<Content />}
        visible={visible}
        close={() => setVisible(false)}
        checked={handleChecked}
      /> */}
    </div>
  );
};
