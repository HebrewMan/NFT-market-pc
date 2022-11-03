import DEV_CONSTANTS from './development';
import PRO_CONSTANTS from './production';

const conditionConfig = process.env.NODE_ENV === 'production' ? PRO_CONSTANTS : DEV_CONSTANTS;
export const isProd = process.env.NODE_ENV === 'production';

/**
 *  baseURL: 'http://192.168.1.59:4000',
    baseURL: 'https://nft-web-test.helios-a.com/',
    baseURL: 'http://nft-pre.aitd.io',
    https://nft-pre.diffgalaxy.com/
 */

const baseURL = isProd ? window.location.origin : window.location.origin; // 预生产要用dev临时配置

const constants = {
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  INIT_CHAIN: 1319, // 1319主网
  SUPPORTED_CHAINS: [1319, 1320],
  BASE_URL: baseURL,
  CHAIN_CACHE_KEY: 'ACCESS_CHAIN',
  CHAIN_INFO: {
    '1320': {
      chainName: 'AITD TEST',
      chainNameShort: 'AITD',
      rpcUrl: ['http://http-testnet.aitd.io'],
      blockExplorerUrs: [''],
      nativeCurrency: {
        name: 'Aitd Coin',
        symbol: 'AITD',
        decimals: 18,
      },
    },
    '1319': {
      chainName: 'AITD MAIN',
      chainNameShort: 'AITD',
      rpcUrl: ['https://walletrpc.aitd.io', 'https://node.aitd.io'],
      blockExplorerUrs: [''],
      nativeCurrency: {
        name: 'Aitd Coin',
        symbol: 'AITD',
        decimals: 6,
      },
    },
  },
};

const configs = { ...conditionConfig, ...constants };
class Token {
  constructor(public name: string, public decimals: number, public address?: string) {
    this.name = name;
    this.decimals = decimals;
    this.address = address || '';
  }
}
export const USDT = new Token(
  'USDT',
  isProd ? 6 : 18,
  isProd ? '0x848cb1a9770830da575DfD246dF2d4e38c1D40ed' : '0x4b6b9f3695205c8468ddf9ab4025ec2a09bdff1a',
);
export const AITD = new Token('AITD', 18);

export const ChainIds = {
  eth: {
    chainId: 1337,
  },
  bsc: {
    chainId: 1337,
  },
  aitd: {
    chainId: isProd ? 1319 : 1320,
    // chainId: chainId,
    // chainId: 1319,
  },
  sol: {
    chainId: 10,
  },
};

export default configs;
