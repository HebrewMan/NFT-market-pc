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

const _chainId = window?.ethereum?.chainId;
export const chainId = !isMobile ? parseInt(_chainId, 16) : parseInt(_chainId);

export const hasWallet = () => Boolean(window?.ethereum);

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

export const getContract = (abi: any, addr: string, web3?: any) => {
  // const _web3 = web3 || getWeb3NoAccount();
  return new web3.eth.Contract(abi, addr);
};

// marketPlace 合约
export const getMarketPlaceContract = (marketPlaceContractAddr: string, web3?: Web3) => {
  return getContract(MarketPlaceAbi.abi, marketPlaceContractAddr, web3);
};

// 一级市场marketPlace 合约
export const getMarketPlacePrimaryContract = (marketPlaceContractAddr: string, web3?: Web3) => {
  return getContract(MarketPlacePrimaryAbi.abi, marketPlaceContractAddr, web3);
};

// ERC1155合约
export const getERC1155Contract = (Erc1155ContractAddr: string, web3?: Web3) => {
  return getContract(ERC1155Abi.abi, Erc1155ContractAddr, web3);
};

// ERC20合约
export const getERC20Contract = (Erc20ContractAddr: string, web3?: Web3) => {
  return getContract(ERC20Abi.abi, Erc20ContractAddr, web3);
};

// V2.0.1版本新增合约
// ERC721合约
export const getERC721Contract = (Erc711ContractAddr: string, web3?: Web3) => {
  return getContract(ERC721Abi.abi, Erc711ContractAddr, web3);
};

// 市场合约
export const getMarketPlaceAitdV3Abi = (marketPlaceContractAddr: string, web3?: Web3) => {
  return getContract(marketPlaceAitdV3Abi.abi, marketPlaceContractAddr, web3);
};

export const getMarketPlaceAitdV2_1Abi = (marketPlaceContractAddr: string, web3?: Web3) => {
  return getContract(marketPlaceAitdV2_1Abi.abi, marketPlaceContractAddr, web3);
};

// erc1155授权
export const getSetApprovalForAll = async (
  account: string,
  operator: string,
  bool: boolean,
  Erc1155ContractAddr: string,
  web3?: Web3,
) => {
  try {
    const res = await getERC1155Contract(Erc1155ContractAddr, web3)
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
  web3?: Web3,
) => {
  try {
    const res = await getERC1155Contract(Erc1155ContractAddr, web3).methods.isApprovedForAll(owner, operator).call();
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
  web3?: Web3,
) => {
  try {
    const res = await getERC20Contract(Erc20ContractAddr, web3)
      .methods.approve(operator, price)
      .send({ from: account });
    return res;
  } catch (error) {
    console.log('error:::', error);
  }
};

// 查看erc20是否授权
export const getIsApproved = async (owner: string, operator: boolean, Erc20ContractAddr: string, web3?: Web3) => {
  try {
    const res = await getERC20Contract(Erc20ContractAddr, web3).methods.allowance(owner, operator).call();
    return res;
  } catch (error) {
    console.log('error:::', error);
  }
};

// erc20查询账户余额
export const getBalanceOf = async (Erc20ContractAddr: string, account: string, web3?: Web3) => {
  try {
    const res = await getERC20Contract(Erc20ContractAddr, web3).methods.balanceOf(account).call();
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
  Erc711ContractAddr: string,
  web3?: Web3,
) => {
  try {
    const res = await getERC721Contract(Erc711ContractAddr, web3).methods.getApproved(tokenId).call();
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
  web3?: Web3,
) => {
  try {
    const res = await getERC721Contract(Erc711ContractAddr, web3)
      .methods.approve(operator, tokenId)
      .send({ from: account });
    return res;
  } catch (error) {
    console.log('error:::', error);
  }
};
