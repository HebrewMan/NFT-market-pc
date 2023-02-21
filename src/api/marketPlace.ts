import { post } from '../ajax/quest';

// 获取NFT详情
export function getNftDetail(params: any) {
  return post(`/v1/api/nftMeta/getDetail`, {...params});
}
