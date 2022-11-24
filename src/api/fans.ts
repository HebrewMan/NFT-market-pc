import { post } from '../ajax/quest';

// 关注、收藏  增加一个合约地址 参数
export function getFans(tokenId: string | number,contractAddr:string) {
  return post(`/v1/api/collect/collect/${tokenId}/${contractAddr}`);
}
// 取消关注、收藏
export function removeFans(tokenId: string,contractAddr:string) {
  return post(`/v1/api/collect/cancel/${tokenId}/${contractAddr}`);
}
// 查询所有粉丝表
export function getFansList(params: any) {
  return post(`/v1/api/collect/page`, params);
}
// 根据goodsId查询粉丝表
export function getFansByGoodsId(params: any) {
  return post(`/v1/api/collect/detail`,{
    ...params,
  });
}
