import { get, post } from '../ajax/quest';

// 图片上传
export function createIpfs(params: any) {
  return post(`/v1/api/ipfs/upload`, params, 'form');
}

// 获取签名
export function getNonce(address: string) {
  return get(`/v1/api/user/nonce/${address}`);
}
// 获取token
export function login(userAddr: string, signature: string) {
  return post(`/v1/api/user/auth`, {
    userAddr,
    signature,
  });
}
// 查询所有的nft商品;nft详情查询该合集下的所有商品(传集合id)
export function getGoods(params: any) {
  return post(`/v1/api/nft/findPage`, {
    ...params,
  });
}
// 查询所有的已上架的nft商品：721和1155资产;
export function getListedNftList(params: any) {
  return post(`/v1/api/nftOrder/page`, {
    ...params,
  });
}
// 查询所有的nft商品;nft详情查询该合集下的所有商品(传集合id)
export function getGoodsByCollectionId(params: any) {
  return post(`/v1/api/nft/findPageByCollectionId`, {
    ...params,
  });
}

// 根据商品goodsId查询指定商品
export function getGood(id: string) {
  return get(`/v1/api/nft/${id}`);
}
//根据id 查询NfT 详情
export function getNFTDetail(params: any) {
  return post(`/v1/api/nftOrder/getNft`, { ...params });
}

//根据tokenId 查询用户NFT 详情
export function getUserNFTDetail(params: any) {
  return post(`/v1/api/nftOrder/getUserNftInfo`, { ...params });
}

// 查询自己钱包下，且属于该合集id的所有nft商品
export function getSelfGoods(params: any) {
  return post(`/v1/api/nft/findSelfPage`, {
    ...params,
    page: 1,
    size: 20,
  });
}
// 查询已上架成功的nft商品
export function getRecommendGoods(params: any) {
  return post(`/v1/api/nft/recommendedPage`, {
    ...params,
    page: 1,
    size: 10,
  });
}
// 查询别人的合集
export function getOtherPersonGoods(address: string, params: any) {
  return post(`/v1/api/nft/findOtherPage/${address}`, { ...params });
}
// 查看我的Nft API
export function getMyNFTList(params: any) {
  return post(`/v1/api/nftOrder/selecAssetNftPage`, { ...params });
}

// 上架
export function getUpdateSellOrder(params: any) {
  return post(`/v1/api/nft/sell`, {
    page: 1,
    size: 10,
    ...params,
  });
}
// 下架
export function getUpdateCancelSellOrder(nftId: string) {
  return post(`/v1/api/nft/cancelSell/${nftId}`);
}
// 降低价格
export function getUpdateLowerPrice(params: any) {
  return post(`/v1/api/nftOrder/changePrice`, params);
}
// buy now 之后获取状态
export function getUpdateBuyOrder(params: any) {
  return post(`/v1/api/nft/onlineSell`, params);
}

// 首页banner
export function getHomePageBanner() {
  return post(`/v1/api/collections/banner`);
}

// 首页搜索
export function getSearchGoods(params: any) {
  return post(`/v1/api/nft/homeSearchPage`, {
     ...params,
  });
}

// 退出
export function logout() {
  return get('/v1/api/user/loginOut');
}
