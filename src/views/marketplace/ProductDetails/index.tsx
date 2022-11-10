import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ethers } from 'ethers';
import { DescInfo } from './DescInfo';
import { MoreCollects } from './More';
import { Trading } from './Trading';
import { message } from 'antd';
import { useWeb3React } from '@web3-react/core';
import useWeb3 from '../../../hooks/useWeb3';
import {
  cancelMarketItemErc1155,
  createMarketSaleErc1155,
  createMarketSaleWithTokenErc1155,
} from '../../../hooks/marketplace';
import { getApproval, getIsApproved } from '../../../hooks/web3Utils';
import { getGood, getRecommendGoods, getUpdateCancelSellOrder, getUpdateBuyOrder } from '../../../api';
import { getOrderEventPage } from '../../../api/order';
import { getCollectionDetails } from '../../../api/collection';
import { getFans, getFansByGoodsId, removeFans } from '../../../api/fans';
import { getCookie, getLocalStorage, toPriceDecimals } from '../../../utils/utils';
import UpdatePriceView from './UpdatePrice/index';
// import { useMarketTrading, useCancelMarketTrading } from "../../../hooks/sellContract"
// import { useOwnerAddress } from '../../../hooks/useContract';
import config, { USDT } from '../../../config/constants';
import instanceLoading from '../../../utils/loading';
import { isProd } from '../../../config/constants';

import './index.scss';

export const ProductionDetails = () => {
  const web3 = useWeb3();
  const { t } = useTranslation();
  const _chainId = window?.ethereum?.chainId;
  const chainId = parseInt(_chainId);
  const Erc1155ContractAddr = (config as any)[chainId]?.ERC1155;
  const marketPlaceContractAddr = (config as any)[chainId]?.MARKET_ADDRESS;
  const { account } = useWeb3React();
  const [createSuccess, setCreateSuccess] = useState(false);
  const [tokenId, setTokenId] = useState<string>('');
  const [orderId, setOrderId] = useState<number>();
  const [ownerAddr, setOwnerAddr] = useState('');
  const [accountAddress, setAccountAddress] = useState<string | null | undefined>(getLocalStorage('wallet'));
  const token = getCookie('web-token') || '';
  const [description, setDescription] = useState('');
  const [createAddr, setCreateAddr] = useState('');
  const [contractAddr, setContractAddr] = useState('');
  const [sellStatus, setSellStatus] = useState<Number>();
  const [status, setStatus] = useState<Number>();
  const [belongsId, setBelongsId] = useState<Number | String | null | undefined>();
  const [collectionId, setCollectionId] = useState('');
  const [name, setName] = useState('');
  const [fansNum, setFansNum] = useState(0);
  const [nftId, setNftId] = useState('');
  const [fansStatus, setFansStatus] = useState<number | string>('');
  const [imgSrc, setImgSrc] = useState('');
  const [sellerImageUrl, setSellerImageUrl] = useState('');
  const [collectionsName, setCollectionsName] = useState('');
  const [price, setPrice] = useState(0);
  const [activityStatus, setActivityStatus] = useState<Number>();
  const [metadata, setMetadata] = useState({});
  const [collectionsData, setCollectionsData] = useState({});
  const [tradingHistoryData, setTradingHistoryData] = useState([]);
  const [collectGoodsData, setCollectGoodsData] = useState([]);
  const history = useHistory();
  const { id: goodsId } = useParams<{ id: string }>(); // 路由参数id
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sellOrderFlag, setSellOrderFlag] = useState<boolean>(false);
  const [noticeStatus, setNoticeStatus] = useState<number | string>('');

  useEffect(() => {
    init();
    getFansByGoodsIdData();
  }, [goodsId]);

  useEffect(() => {
    if (noticeStatus === '') return;
    getFansByGoodsIdData();
  }, [noticeStatus]);

  useEffect(() => {
    if (collectionId) {
      getCollection();
    }
  }, [collectionId]);
  const init = async () => {
    try {
      const res: any = await getGood(goodsId);
      // setIsLoading(false)
      const {
        collectionId,
        contractAddr,
        sellStatus,
        status,
        ownerAddr,
        price,
        activityStatus,
        belongsId,
        blindBox,
        tokenId,
        orderId,
      } = res.data;
      const { sellerImageUrl } = res.data;
      const { name, imageUrl, description, nftId } = res.data.metadata;
      const defaultAvatar = require('../../../assets/default_header.png');

      setName(name);
      setNftId(nftId);
      setImgSrc(imageUrl);
      setTokenId(tokenId);
      setOrderId(orderId);
      setDescription(description);
      setOwnerAddr(ownerAddr);
      setPrice(price);
      setCollectionId(collectionId);
      setCreateAddr(createAddr);
      setContractAddr(contractAddr);
      setSellStatus(sellStatus);
      setStatus(status);
      setCreateSuccess(true);
      setActivityStatus(activityStatus);
      setBelongsId(belongsId);
      setSellerImageUrl(sellerImageUrl || defaultAvatar);
      setMetadata(res.data.metadata);
      if (tokenId) {
        // getUserAddress(tokenId);
        getOrderPageData();
      }
    } catch (err) {
      console.log(err);
    }
  };
  // 根据tokenId判断拥有者地址
  // const getUserAddress = (tokenId: string) => {
  //   useOwnerAddress(tokenId).then((address) => {
  //     if (address?.toLowerCase() !== ownerAddr) {
  //       setOwnerAddr(address?.toLowerCase());
  //     }
  //   });
  // };
  // 获取粉丝数量
  const getFansByGoodsIdData = async () => {
    const res: any = await getFansByGoodsId(goodsId);
    setFansNum(res?.data?.collectNum);
    setFansStatus(Number(res?.data?.collect));
  };
  // 获取合集详情信息
  const getCollection = async () => {
    const res: any = await getCollectionDetails(collectionId);
    setCollectionsName(res?.data?.name);
    setCollectionsData(res?.data);
    checkIsOwner();
  };
  // 判断当前合集id是否是当前登录用户的
  const checkIsOwner = async () => {
    const params = {
      data: {
        collectionId: collectionId,
      },
      page: 1,
      size: 10,
    };
    const res: any = await getRecommendGoods(params);
    setCollectGoodsData(res?.data?.records);
  };
  const getOrderPageData = async () => {
    const obj = {
      data: {
        nftId: goodsId,
      },
      page: 1,
      size: 20,
    };
    const res: any = await getOrderEventPage(obj);
    setTradingHistoryData(res?.data?.records);
  };
  const isOwner = () => {
    // 连接钱包，并且拥有者=登录账户
    return !!account && ownerAddr === accountAddress;
  };
  const isCancelSell = () => {
    // sellStatus用于判断nft是否正在出售，status用于判断nft是否已上架
    return isOwner() && sellStatus === 1 && status === 2;
  };
  const isBuyNow = () => {
    // return sellStatus === 1 && activityStatus === 1;
    // 钱包连接并且已上架
    return !!account && sellStatus === 1 && status === 2;
  };
  const getSetPriceOrder = () => {
    // 上架
    setIsOpen(true);
    setSellOrderFlag(true);
  };
  const updateClose = (open: boolean) => {
    setIsOpen(open);
  };
  // 取消上架
  const getCancelSellOrder = async () => {
    // 下架合约
    if (!accountAddress || !token) {
      message.error('Please log in first!');
      history.push('/login');
      return;
    }
    if (chainId !== 1319 && isProd) {
      message.error('Please switch to mainnet!');
      return;
    }
    instanceLoading.service();
    try {
      const cancelOrderRes = await cancelMarketItemErc1155(
        web3,
        Number(orderId),
        accountAddress,
        marketPlaceContractAddr,
      );
      if (cancelOrderRes?.transactionHash) {
        message.success('Cancellation of order successful!');
        updateGoods();
      }
      // if (cancelOrderRes?.transactionHash) {
      //   // 接后台下架接口
      //   getUpdateCancelSellOrder(goodsId).then((res: any) => {
      //     console.log(res, 'getUpdateCancelSellOrder');
      //     message.success('下架成功！');
      //     updateGoods();
      //   });
      // }
      instanceLoading.close();
    } catch (error: any) {
      console.log('getCancelSellOrder error', error);
      instanceLoading.close();
    }
  };
  const getUpdateLowerPriceOrder = () => {
    // 修改价格
    setIsOpen(true);
    setSellOrderFlag(false);
  };
  const toggleFansCollected = () => {
    fansStatus ? removeFansData(goodsId) : fansCollected(goodsId);
  };
  // 取消收藏
  const removeFansData = async (goodsId: string) => {
    const res: any = await removeFans(goodsId);
    if (res?.message === 'success') {
      getFansByGoodsIdData();
      checkIsOwner();
    }
  };
  // 添加收藏
  const fansCollected = async (goodsId: string) => {
    const res: any = await getFans(goodsId);
    if (res?.message === 'success') {
      getFansByGoodsIdData();
      checkIsOwner();
    }
  };
  const handleToAccount = () => {
    if (belongsId) return false;
    history.push(`/collection/${collectionId}`);
  };
  // 买nft合约
  const getBuy = async () => {
    const Erc20ContractAddr = USDT.address || '';
    let approvedRes: any = undefined;
    let fillOrderRes: any = undefined;
    let allowance = 0;

    const obj = {
      orderId, // 订单id
      price: toPriceDecimals(price, USDT.decimals), // nft 价格
      marketType: 2, // 用于标注二级市场
      Erc1155ContractAddr: contractAddr,
      moneyMintAddress: Erc20ContractAddr,
      marketPlaceContractAddr,
      account: accountAddress,
    };
    if (!accountAddress || !token || !Erc20ContractAddr) {
      message.error('Please log in first!');
      history.push('/login');
      return;
    }
    if (chainId !== 1319 && isProd) {
      message.error('Please switch to mainnet!');
      return;
    }
    instanceLoading.service();
    try {
      // 查看是否已授权
      const _allowance = await getIsApproved(accountAddress, marketPlaceContractAddr, Erc20ContractAddr, web3);
      allowance = Number(_allowance) - Number(price);
      if (allowance <= 0) {
        // 授权erc20 币种到市场合约
        approvedRes = await getApproval(
          accountAddress,
          marketPlaceContractAddr,
          ethers.constants.MaxUint256,
          Erc20ContractAddr,
          web3,
        );
      }
      if (allowance > 0 || !!approvedRes?.transactionHash) {
        fillOrderRes = await createMarketSaleWithTokenErc1155(web3, obj);
      }
      if (!!fillOrderRes?.transactionHash) {
        message.success('Purchase Successful!');
        updateGoods();
      }
      instanceLoading.close();
    } catch (error) {
      console.log('buyNftGoods error', error);
      instanceLoading.close();
    }

    // if (fillOrderRes?.transactionHash) {
    //   // 接后台购买接口
    //   const params = {
    //     nftId,
    //     txHash: fillOrderRes.transactionHash,
    //   };
    //   getUpdateBuyOrder(params).then((res: any) => {
    //     if (res?.message === 'success') {
    //       message.success('购买中...');
    //       updateGoods();
    //     }
    //   });
    // }
  };
  // const ownerBtn = () => {
  //   if (isOwner()) {
  //     return (
  //       <button disabled={!isEdit()} onClick={() => history.push(`/create/${goodsId}`)}>
  //         Edit
  //       </button>
  //     );
  //   }
  // };
  const sellBtn = () => {
    if (isOwner() && sellStatus === 0) {
      return <button onClick={getSetPriceOrder}>{t('common.sell')}</button>;
    }
  };
  const cancelBtn = () => {
    if (isCancelSell()) {
      return (
        <>
          <button onClick={getCancelSellOrder}>{t('marketplace.details.cancelList')}</button>
          <button onClick={getUpdateLowerPriceOrder}>{t('marketplace.details.update')}</button>
        </>
      );
    }
  };
  const updateGoods = () => {
    init();
    getFansByGoodsIdData();
  };
  const notify = (status: number | string) => {
    setFansStatus(status);
    setNoticeStatus(status);
  };
  const ownerLink = <Link to={`/account/0/${ownerAddr}`}> {t('marketplace.details.you')} </Link>;
  const ownerAddress = (
    <Link to={`/account/0/${ownerAddr}`}>
      {ownerAddr?.startsWith('0x') ? ownerAddr?.substring(2, 8) : ownerAddr?.substring(0, 6)}
    </Link>
  );
  return (
    <div className='personal-details'>
      <div className='details-wrapper'>
        <div className='wrapper-btn'>
          {/* {ownerBtn()} */}
          {sellBtn()}
          {cancelBtn()}
        </div>
        <div className='wrapper-header'>
          <div className='top-inner inner-hidden'>
            <div className='top-left'>
              <p>
                {t('marketplace.details.untitled')} #{collectionId}
              </p>
            </div>
            <div className='top-right'>
              {/* <svg-icon icon-class="refresh"></svg-icon>
                <svg-icon icon-class="open_in_new"></svg-icon>
                <svg-icon icon-class="share"></svg-icon>
                <svg-icon icon-class="more_vert"></svg-icon> */}
            </div>
          </div>
          <h1 className='hidden'>{name}</h1>
          <div className='header-pic'>
            {/* <p>
              <img
                className={!fansStatus ? 'favorite_border_gray' : 'favorite_red'}
                src={!fansStatus ? require('../../../assets/fbg.svg') : require('../../../assets/fr.png')}
                onClick={() => toggleFansCollected()}
                alt=''
              />
              <span>{fansNum}</span>
            </p> */}
            <div className='header-image'>
              <div className='prod-image'>
                <img src={imgSrc} alt='' />
                <div>
                  <img
                    className={!fansStatus ? 'favorite_border_gray' : 'favorite_red'}
                    src={!fansStatus ? require('../../../assets/fg.png') : require('../../../assets/fr.png')}
                    onClick={() => toggleFansCollected()}
                    alt=''
                  />
                  <span>{fansNum}</span>
                </div>
              </div>
            </div>
          </div>
          {/* desc */}
          <div className='header-information'>
            <div className='information-top'>
              {/* <div className='top-inner'>
                <div className='top-left'>
                  <a onClick={handleToAccount}>{collectionsName}</a>
                </div>
              </div> */}
              <h1>{name}</h1>
              <div className='author'>
                <div className='auth'>
                  {/* <img src={require('../../../assets/favorite_black.svg')} alt='' className='svg-img' /> */}
                  <img src={sellerImageUrl} alt='' />
                  <span>
                    {t('marketplace.Owner')} {isOwner() ? ownerLink : ownerAddress}
                  </span>
                </div>
              </div>
              <div className='buy'>
                <div className='price'>
                  <p>{t('marketplace.curPrice')}</p>
                  <p>{parseFloat(price.toFixed(4))} USDT</p>
                </div>
                {!isOwner() && (
                  <button disabled={!isBuyNow()} onClick={getBuy}>
                    {t('common.buyNow')}
                  </button>
                )}
              </div>
            </div>
            {/* Description List */}
            <DescInfo
              metadata={metadata}
              description={description}
              contractAddr={contractAddr}
              tokenId={tokenId}
              collectionsData={collectionsData}
            />
          </div>
        </div>
        {/* trading */}
        <Trading tradingHistoryData={tradingHistoryData} />
        <MoreCollects
          collectGoodsData={collectGoodsData}
          collectionId={collectionId}
          belongsId={belongsId}
          notify={notify}
        />
        {/* 价格弹框 */}
        <UpdatePriceView
          price={price}
          tokenId={tokenId}
          contractAddr={contractAddr}
          accountAddress={accountAddress}
          goodsId={goodsId}
          orderId={Number(orderId)}
          isOpen={isOpen}
          sellOrderFlag={sellOrderFlag}
          close={updateClose}
          updateGoods={updateGoods}
        />
      </div>
    </div>
  );
};
