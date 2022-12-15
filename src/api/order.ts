import { post } from '../ajax/quest';
// 订单事件交易记录
export function getOrderEventPage(params: any) {
  return post(`/v1/api/transaction/page`, params);
}

// 查询NFT 订单列表
export function getOrderList(params: any) {
  return post(`/v1/api/nftOrder/getOrderList`, params);
}