import React from 'react';
import Web3 from 'web3';
import { isMobile } from 'react-device-detect';
import config from '../config/constants';
import MarketPlaceAbi from '../config/abi/marketPlace.json';
import MarketPlacePrimaryAbi from '../config/abi/marketPlacePrimary.json';
import BankCardsAbi from '../config/abi/bankCards.json';
import ERC20Abi from '../config/abi/ERC20.json';
import ERC721Abi from '../config/abi/ERC721.json';
import ERC1155Abi from '../config/abi/ERC1155.json';
import marketPlaceAitdV3Abi from '../config/abi/marketPlaceAitdV3.json';
import marketPlaceAitdV2_1Abi from '../config/abi/marketPlaceAitdV2_1.json';
import { ethers } from 'ethers';

const _chainId = window?.provider?.chainId;
export const chainId = !isMobile ? parseInt(_chainId, 16) : parseInt(_chainId);

export const hasWallet = () => Boolean(window?.provider);

export const getRpcUrl = (): string => {
  return (config as any)[chainId]?.RPC_URL;
};

export const getWeb3NoAccount = (rpcUrl: string): Web3 => {
  const httpProvider = new Web3.providers.HttpProvider(rpcUrl, { timeout: 10000 });
  return new Web3(httpProvider);
};

export const getLibrary = (provider: any) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 10000;
  return library;
};

export const getContract = (abi: any, addr: string) => {
  const _web = new Web3(window.provider);
  return new _web.eth.Contract(abi, addr);
};

// marketPlace 合约
export const getMarketPlaceContract = (marketPlaceContractAddr: string) => {
  return getContract(MarketPlaceAbi.abi, marketPlaceContractAddr);
};

// 一级市场marketPlace 合约
export const getMarketPlacePrimaryContract = (marketPlaceContractAddr: string) => {
  return getContract(MarketPlacePrimaryAbi.abi, marketPlaceContractAddr);
};

// ERC1155合约
export const getERC1155Contract = (Erc1155ContractAddr: string) => {
  return getContract(ERC1155Abi.abi, Erc1155ContractAddr);
};

// ERC20合约
export const getERC20Contract = (Erc20ContractAddr: string) => {
  return getContract(ERC20Abi.abi, Erc20ContractAddr);
};

// V2.0.1版本新增合约
// ERC721合约
export const getERC721Contract = (Erc711ContractAddr: string) => {
  return getContract(ERC721Abi.abi, Erc711ContractAddr);
};

// 市场合约
export const getMarketPlaceAitdV3Abi = (marketPlaceContractAddr: string) => {
  return getContract(marketPlaceAitdV3Abi.abi, marketPlaceContractAddr);
};

export const getMarketPlaceAitdV2_1Abi = (marketPlaceContractAddr: string) => {
  return getContract(marketPlaceAitdV2_1Abi.abi, marketPlaceContractAddr);
};

// erc1155授权
export const getSetApprovalForAll = async (
  account: string,
  operator: string,
  bool: boolean,
  Erc1155ContractAddr: string,
) => {
  try {
    const res = await getERC1155Contract(Erc1155ContractAddr)
      .methods.setApprovalForAll(operator, bool)
      .send({ from: account });
    return res;
  } catch (error) {
    console.log('error:::', error);
  }
};

// 查看erc1155是否授权
export const getIsApprovedForAll = async (
  owner: string,
  operator: boolean,
  Erc1155ContractAddr: string,
) => {
  try {
    const res = await getERC1155Contract(Erc1155ContractAddr).methods.isApprovedForAll(owner, operator).call();
    return res;
  } catch (error) {
    console.log('error:::', error);
  }
};

// erc20授权币种到市场合约
export const getApproval = async (
  account: string,
  operator: string,
  price: any,
  Erc20ContractAddr: string,
) => {
  try {
    const res = await getERC20Contract(Erc20ContractAddr)
      .methods.approve(operator, price)
      .send({ from: account });
    return res;
  } catch (error) {
    console.log('error:::', error);
  }
};

// 查看erc20是否授权
export const getIsApproved = async (owner: string, operator: boolean, Erc20ContractAddr: string) => {
  try {
    const res = await getERC20Contract(Erc20ContractAddr).methods.allowance(owner, operator).call();
    return res;
  } catch (error) {
    console.log('error:::', error);
  }
};

// erc20查询账户余额
export const getBalanceOf = async (Erc20ContractAddr: string, account: string) => {
  try {
    const res = await getERC20Contract(Erc20ContractAddr).methods.balanceOf(account).call();
    return res;
  } catch (error) {
    console.log('error:::', error);
  }
};

//查看erc721是否授权
export const getERC711IsApproved = async (
  // owner: string,
  // operator: boolean,
  tokenId: string,
  Erc711ContractAddr: string
) => {
  try {
    const res = await getERC721Contract(Erc711ContractAddr).methods.getApproved(tokenId).call();
    return res;
  } catch (error) {
    console.log('error:::', error);
  }
};
// erc721授权
export const getSetERC711ApprovalForAll = async (
  account: string,
  operator: string,
  tokenId: string,
  Erc711ContractAddr: string,
) => {
  try {
    const res = await getERC721Contract(Erc711ContractAddr)
      .methods.approve(operator, tokenId)
      .send({ from: account });
    return res;
  } catch (error) {
    console.log('error:::', error);
  }
};
