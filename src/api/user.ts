import { get, post } from '../ajax/quest';
import axios from 'axios';

export function updateUserInfo(data: any) {
  return post('/v1/api/user/update', { ...data });
}

export const ethToUSD = async (): Promise<number> => {
  try {
    const { data }: any = await axios.post('https://helios-price.aitd.io/', {
      jsonrpc: '2.0',
      id: 1,
      params: ['ETH', 'USDT'],
      method: 'coinmarket_rate',
    });
    return data?.result || 0;
  } catch (error) {
    return 0;
  }
};

// 获取当前登录地址用户信息
export function getAccountInfo(address: string) {
  return get(`/v1/api/user/address/${address}`);
}

// 获取当前登录用户钱包余额
export function getAccountWallet() {
  return get(`/v1/api/user/wallet`);
}

// 获取手续费配置
export function getHandlingFee(params: any) {
  return post(`/v1/api/config/getValue`, params);
}

// 获取版税信息
export function getNFTRoyalty() {
  return get(`/v1/api/nftRoyalty/summaryByCurrentUser`);
}

// 获取版税列表
export function getNFTRoyaltyList(params: any) {
  return post(`/v1/api/nftRoyalty/pageByCurrentUser`,params);
}


// 用户资产
export function getUserAsset(params: any) {
  return post(`/v1/api/asset/userInfo`,params);
}
