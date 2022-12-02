import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { DescInfo } from './DescInfo';
import { MoreCollects } from './More';
import { Trading } from './Trading';
import { message } from 'antd';
import { useWeb3React } from '@web3-react/core';
import useWeb3 from '../../../hooks/useWeb3';
import { useTranslation } from 'react-i18next';
import { toFixed,intlFloorFormat } from 'Utils/bigNumber'

import {
  // cancelMarketItemErc1155,
  // createMarketSaleErc1155,
  // createMarketSaleWithTokenErc1155,
  createMarketSale,
  cancelMarketItem,
} from '../../../hooks/marketplace';
import { getApproval, getIsApproved } from '../../../hooks/web3Utils';
import {
  // getGood,
  // getRecommendGoods,
  // getUpdateCancelSellOrder,
  // getUpdateBuyOrder,
  getNFTDetail,
  getUserNFTDetail,
  getGoodsByCollectionId,
} from '../../../api';
import { getOrderEventPage } from '../../../api/order';
import { getCollectionDetails } from '../../../api/collection';
import { getFans, getFansByGoodsId, removeFans } from '../../../api/fans';
import { getCookie, getLocalStorage, toPriceDecimals } from '../../../utils/utils';
import UpdatePriceView from './UpdatePrice/index';
// import { useMarketTrading, useCancelMarketTrading } from "../../../hooks/sellContract"
// import { useOwnerAddress } from '../../../hooks/useContract';
import config, { USDT, ContractType, CoinType } from '../../../config/constants';
import instanceLoading from '../../../utils/loading';
import { isProd } from '../../../config/constants';
import BugModal from './bugModal';

import './index.scss';

export const ProductionDetails = () => {
  const web3 = useWeb3();
  const { t } = useTranslation()
  const _chainId = window?.ethereum?.chainId;
  const chainId = parseInt(_chainId, 16);
  // const Erc1155ContractAddr = (config as any)[chainId]?.ERC1155;
  const marketPlaceContractAddr = (config as any)[chainId]?.MARKET_ADDRESS;
  const { account } = useWeb3React();
  const [tokenId, setTokenId] = useState<string>('');
  const [orderId, setOrderId] = useState<number>();
  const [ownerAddr, setOwnerAddr] = useState('');
  const [accountAddress, setAccountAddress] = useState<string | null | undefined>(getLocalStorage('wallet'));
  const token = getCookie('web-token') || '';
  // const [contractAddr, setContractAddr] = useState('');
  // const [sellStatus, setSellStatus] = useState<Number>(); //售卖状态
  const [status, setStatus] = useState<Number>();
  const [userNftStatus, setUserNftStatus] = useState<Number>();
  const [belongsId, setBelongsId] = useState<Number | String | null | undefined>();
  // const [collectionId, setCollectionId] = useState('');
  // const [name, setName] = useState('');
  const [fansNum, setFansNum] = useState(0);
  // const [nftId, setNftId] = useState('');
  const [fansStatus, setFansStatus] = useState<number | string>('');
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0); // nft的个数
  const [collectionsData, setCollectionsData] = useState({});
  const [tradingHistoryData, setTradingHistoryData] = useState([]);
  const [collectGoodsData, setCollectGoodsData] = useState([]);
  const history = useHistory();
  const {
    id: goodsId,
    tokenId: userTokenId,
    contractAddr: userContractAddr,
  } = useParams<{ id: string; tokenId: string; contractAddr: string }>(); // 路由参数id tokenId
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sellOrderFlag, setSellOrderFlag] = useState<boolean>(false);
  const [noticeStatus, setNoticeStatus] = useState<number | string>('');
  const [DetailData, setDetailData] = useState<any>({}); //详情数据
  const [detailMetadata, setDetailMetadata] = useState<any>({});
  const [contractType, setContractType] = useState(null);
  const [bugModalOpen, setBuyModalOpen] = useState(false);
  const [isAITD, setIsAITD] = useState<boolean>(false);

  //初始化数据
  useEffect(() => {
    // 详情
    console.log(useParams,'useParamsuseParams');
    
    init();
  }, [tokenId, goodsId]);

  useEffect(() => {
    if (noticeStatus === '') return;
    getFansByGoodsIdData(DetailData?.tokenId, DetailData?.contractAddr);
  }, [noticeStatus]);

  useEffect(() => {
    if (DetailData?.collectionId) {
      getCollection();
    }
  }, [DetailData?.collectionId]);
  const init = async () => {
    const params = {
      orderId: goodsId,
    };
    const useParams = {
      orderId: goodsId || '',
      tokenId: userTokenId,
      contractAddr: userContractAddr,
      marketAddr: marketPlaceContractAddr,
    };
    let { data } = userTokenId ? await getUserNFTDetail(useParams) : await getNFTDetail(params);
    setStatus(data.status); //售卖状态
    setAmount(data.amount);
    setDetailMetadata(data?.nftMetadata);
    setContractType(data?.contractType); // 暂时取外层的合约类型

    // 我的资产跳转过来, 获取当前nft订单
    if (data?.nftOrderVO && data?.nftOrderVO.length) {
      const orderObj = data?.nftOrderVO.filter((item: any) => item.contractAddr === userContractAddr)[0] || {};
      data = { ...data, ...orderObj };
      setUserNftStatus(orderObj?.status);
    }

    setDetailData(data);
    setOrderId(data.orderId);
    setOwnerAddr(data.ownerAddr); //用户钱包地址
    setIsAITD(data?.coin === CoinType.AITD);
    console.log(data?.tokenId,'data?.tokenIddata?.tokenIddata?.tokenId');
    
    if (data?.tokenId || data?.tokenId == 0) {
      // getUserAddress(tokenId);
      getFansByGoodsIdData(data?.tokenId, data?.contractAddr);
      getOrderPageData(data?.tokenId, data?.contractAddr);
    }
    // try {
    //   const res: any = await getGood(goodsId);
    //   setListData(res.data)
    //   // setIsLoading(false)
    //   const {
    //     collectionId,
    //     contractAddr,
    //     sellStatus,
    //     status,
    //     ownerAddr,
    //     price,
    //     activityStatus,
    //     belongsId,
    //     blindBox,
    //     tokenId,
    //     orderId,
    //   } = res.data;
    //   const { sellerImageUrl } = res.data;
    //   const { name, imageUrl, description, nftId } = res.data.metadata;
    //   const defaultAvatar = require('../../../assets/default_header.png');

    //   setName(name);
    //   setNftId(nftId);
    //   setImgSrc(imageUrl);
    //   setTokenId(tokenId);
    //   setOrderId(orderId);
    //   setDescription(description);
    //   setOwnerAddr(ownerAddr);
    //   setPrice(price);
    //   setCollectionId(collectionId);
    //   setCreateAddr(createAddr);
    //   setContractAddr(contractAddr);
    //   setSellStatus(sellStatus);
    //   setStatus(status);
    //   setCreateSuccess(true);
    //   setActivityStatus(activityStatus);
    //   setBelongsId(belongsId);
    //   setSellerImageUrl(sellerImageUrl || defaultAvatar);
    //   setMetadata(res.data.metadata);
    //   if (tokenId) {
    //     // getUserAddress(tokenId);
    //     getOrderPageData();
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
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
  const getFansByGoodsIdData = async (tokenId: string, contractAddr: string) => {
    const address = localStorage.getItem('wallet');
    const param = {
      tokenId: tokenId,
      contractAddr: contractAddr,
      ownerAddr: address,
    };
    // if (tokenId) {
    const res: any = await getFansByGoodsId(param);
    setFansNum(res?.data?.collectNum);
    setFansStatus(Number(res?.data?.collect));
    // }
  };
  // 获取合集详情信息
  const getCollection = async () => {
    const res: any = await getCollectionDetails(DetailData?.collectionId);
    setCollectionsData(res?.data);
    checkIsOwner();
  };
  // 判断当前合集id是否是当前登录用户的  && 获取商品列表
  const checkIsOwner = async () => {
    const params = {
      data: {
        collectionId: DetailData?.collectionId,
      },
      page: 1,
      size: 10,
    };

    const res: any = await getGoodsByCollectionId(params);
    setCollectGoodsData(res?.data?.records);
  };
  // 请求Trading History
  const getOrderPageData = async (tokenId: number, contractAddr: string) => {
    console.log(contractAddr, 'contractAddr');

    const obj = {
      tokenId: tokenId,
      page: 1,
      size: 20,
      contractAddr: contractAddr,
    };
    const res: any = await getOrderEventPage(obj);
    setTradingHistoryData(res?.data?.records);
  };
  const isOwner = () => {
    // 连接钱包，并且拥有者=登录账户
    return !!account && DetailData?.ownerAddr === accountAddress;
  };
  const isCancelSell = () => {
    
    // 用户资产跳过来进行出售操作，刷新后用数量判断
    const canEdit = userTokenId && amount === 0;
    // userNftStatus用于判断nft是否正在出售
    return isOwner() && (canEdit || userNftStatus === 0 || status === 0);
  };
  const isBuyNow = () => {
    // 正在出售 状态：0-正在出售；1-已售空；2-已取消
    return status === 0;
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
      message.error(t('hint.switchMainnet'));
      history.push('/login');
      return;
    }
    if (chainId !== 1319 && isProd) {
      message.success(t('hint.cancellation'));
      return;
    }
    instanceLoading.service();
    try {
      const cancelOrderRes = await cancelMarketItem(
        web3,
        Number(DetailData?.orderId),
        accountAddress,
        marketPlaceContractAddr,
      );
      if (cancelOrderRes?.transactionHash) {
        message.success(t('hint.cancellation'));
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
      instanceLoading.close();
    }
  };
  const getUpdateLowerPriceOrder = () => {
    // 修改价格
    setIsOpen(true);
    setSellOrderFlag(false);
  };
  const toggleFansCollected = () => {
    fansStatus
      ? removeFansData(DetailData?.tokenId, DetailData?.contractAddr)
      : fansCollected(DetailData?.tokenId, DetailData?.contractAddr);
  };
  // 取消收藏
  const removeFansData = async (tokenId: string, contractAddr: string) => {
    const res: any = await removeFans(tokenId, contractAddr);
    if (res?.message === 'success') {
      getFansByGoodsIdData(tokenId, contractAddr);
      checkIsOwner();
    }
  };
  // 添加收藏
  const fansCollected = async (tokenId: string, contractAddr: string) => {
    const res: any = await getFans(tokenId, contractAddr);
    if (res?.message === 'success') {
      getFansByGoodsIdData(tokenId, contractAddr);
      checkIsOwner();
    }
  };
  const handleToCollection = () => {
    history.push(`/collection/${DetailData?.collectionId}`);
  };

  // 买nft合约
  const getBuy = async () => {
    // 未链接钱包跳转
    if (!account) {
      return history.push(`/login`);
    }
    const Erc20ContractAddr = USDT.address || '';
    let approvedRes: any = undefined;
    let fillOrderRes: any = undefined;
    let allowance = 0;

    const obj = {
      orderId, // 订单id
      price: toPriceDecimals(DetailData?.price, isAITD ? 18 : USDT.decimals), // nft 价格 USDT.decimals
      // marketType: 2, // 用于标注二级市场
      Erc1155ContractAddr: DetailData?.contractAddr,
      moneyMintAddress: DetailData?.moneyAddr,
      marketPlaceContractAddr: DetailData?.marketAddr,
      account: accountAddress,
      tokenId: DetailData?.tokenId,
      ctype: contractType === ContractType.ERC721 ? 0 : 1,
      amounts: 1, // TODO: 暂时写死
      coin: DetailData?.coin,
    };

    if (!accountAddress || !token || !Erc20ContractAddr) {
      message.error(t('hint.pleaseLog'));
      history.push('/login');
      return;
    }
    if (chainId !== 1319 && isProd) {
      message.error(t('hint.switchMainnet'));
      return;
    }
    instanceLoading.service();
    try {
      // 非原生币需要授权
      if (isAITD) {
        fillOrderRes = await createMarketSale(web3, obj);
      } else {
        // 查看erc20是否已授权, 获取授权余额
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
          fillOrderRes = await createMarketSale(web3, obj);
        }
      }
      if (!!fillOrderRes?.transactionHash) {
        message.success(t('hint.purchaseSuccess'));
        updateGoods();
      }
      instanceLoading.close();
    } catch (error) {
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
    // 用户资产跳转过来状态为用户撤单 或 个数不为0
    const canSell = userTokenId ? amount !== 0 || userNftStatus === 2 : true;
    // 判断属于本人, status 不是正在出售
    if (isOwner() && canSell && status !== 0) {
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
    getFansByGoodsIdData(DetailData?.tokenId, DetailData?.contractAddr);
  };
  const notify = (status: number | string) => {
    setFansStatus(status);
    setNoticeStatus(status);
  };
  // 购买按钮
  const handeClickBuy = () => {
    setBuyModalOpen(true);
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
          <div className='header-pic'>
            <div className='header-image'>
              <div className='prod-image'>
                <img src={detailMetadata?.imageUrl} alt='' />
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
              {/* <h1>{name}</h1>  */}
              <p className='collections-name' onClick={handleToCollection}>
                {DetailData?.collectionName}
              </p>
              <h1 className='name'>{detailMetadata?.name + '#' + (detailMetadata?.tokenId || DetailData.tokenId)}</h1>
              <div className='author'>
                <div className='auth'>
                  {/* <img src={require('../../../assets/favorite_black.svg')} alt='' className='svg-img' /> */}
                  <img src={detailMetadata?.imageUrl} alt='' />
                  <span>{t('marketplace.Owner')} {isOwner() ? ownerLink : ownerAddress}</span>
                </div>
              </div>
              <div className='buy'>
                {DetailData?.price && (
                  <div className='price'>
                    <p>{t('marketplace.curPrice')}</p>
                    <p>
                      {intlFloorFormat(DetailData?.price,4)} {DetailData?.coin || 'AITD'}
                      {/* { Math.floor(Number(DetailData?.price) * 10000) / 10000} {DetailData?.coin || 'AITD'} */}
                    </p>
                  </div>
                )}
                {!isOwner() && (
                  <button disabled={!isBuyNow()} onClick={getBuy}>
                     {t('common.buyNow')}
                  </button>
                  // <button disabled={!isBuyNow()} onClick={handeClickBuy}>
                  //   Buy Now
                  // </button>
                )}
              </div>
            </div>
            {/* Description List */}
            <DescInfo
              metadata={detailMetadata}
              description={detailMetadata?.description}
              contractAddr={DetailData.contractAddr}
              tokenId={DetailData.tokenId}
              collectionsData={collectionsData}
              DetailData={DetailData}
            />
          </div>
        </div>
        {/* trading */}
        <Trading tradingHistoryData={tradingHistoryData} />
        <MoreCollects
          collectGoodsData={collectGoodsData}
          collectionId={DetailData?.collectionId}
          // belongsId={belongsId}
          notify={notify}
        />
        {/* 价格弹框 */}
        <UpdatePriceView
          price={DetailData.price}
          tokenId={DetailData.tokenId}
          contractAddr={DetailData.contractAddr}
          isAITD={isAITD}
          contractType={contractType}
          accountAddress={accountAddress}
          moneyAddr={DetailData.moneyAddr}
          goodsId={userTokenId ? DetailData.id : goodsId}
          orderId={Number(orderId)}
          isOpen={isOpen}
          sellOrderFlag={sellOrderFlag}
          close={updateClose}
          updateGoods={updateGoods}
        />
        {/* 购买弹窗  下版本在放开 */}
        {/* <BugModal visible={bugModalOpen} onCancel={()=>setBuyModalOpen(false)} data={DetailData}/> */}
      </div>
    </div>
  );
};
