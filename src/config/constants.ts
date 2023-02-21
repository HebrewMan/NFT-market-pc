import DEV_CONSTANTS from './development';
import PRO_CONSTANTS from './production';
import PRE_CONSTANTS from './preProduction';

let conditionConfig = null;

if (process.env.APP_MODE === 'production') {
  conditionConfig = PRO_CONSTANTS;
} else if (process.env.APP_MODE === 'pre') {
  conditionConfig = PRE_CONSTANTS;
} else {
  conditionConfig = DEV_CONSTANTS;
}

export const isProd = process.env.APP_MODE === 'production' || process.env.APP_MODE === 'pre';


/**
 *  baseURL: 'http://192.168.1.59:4000',
    baseURL: 'https://nft-web-test.helios-a.com/',
    baseURL: 'http://nft-pre.aitd.io',
    https://www.diffgalaxy.com/
    本地服务：http://172.16.2.12:7077/
 */
const devBase = 'http://192.168.1.59:4000'
const baseURL = "http://172.16.2.12:7077"; // 预生产要用dev临时配置
// const baseURL = isProd ? window.location.origin : devBase; // dev临时配置

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

export const CoinType = {
  AITD: 'AITD',
  USDT: 'USDT',
};

export const ContractType = {
  ERC721: 'ERC721',
  ERC1155: 'ERC1155',
};

export default configs;
