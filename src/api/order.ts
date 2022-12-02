import { post } from '../ajax/quest';
// 订单事件交易记录
export function getOrderEventPage(params: any) {
  return post(`/v1/api/transaction/page`, params);
}
