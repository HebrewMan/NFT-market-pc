import { post } from '../ajax/quest';

// 关注、收藏
export function getFans(nftId: string | number) {
  return post(`/v1/api/collect/collect/${nftId}`);
}
// 取消关注、收藏
export function removeFans(nftId: string) {
  return post(`/v1/api/collect/cancel/${nftId}`);
}
// 查询所有粉丝表
export function getFansList(params: any) {
  return post(`/v1/api/collect/page`, params);
}
// 根据goodsId查询粉丝表
export function getFansByGoodsId(nftId: string | number) {
  return post(`/v1/api/collect/detail/${nftId}`);
}
