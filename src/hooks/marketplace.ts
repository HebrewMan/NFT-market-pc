import Web3 from 'web3';
import { getMarketPlaceContract, getMarketPlacePrimaryContract } from './web3Utils';
import instanceLoading from '../utils/loading';

// 上架
export const createMarketItemErc1155 = async (web3: Web3, obj: any) => {
  const { moneyMintAddress, tokenId, price, Erc1155ContractAddr, marketPlaceContractAddr, account } = obj;
  const nftContract = Erc1155ContractAddr; // nft合约地址
  const result = await getMarketPlaceContract(marketPlaceContractAddr, web3)
    .methods.createMarketItemErc1155(nftContract, moneyMintAddress, tokenId, price)
    .send({ from: account, gas: 2207160 });
  return result;
};

// 下架
export const cancelMarketItemErc1155 = async (
  web3: Web3,
  orderId: number,
  account: any,
  marketPlaceContractAddr: string,
) => {
  const result = await getMarketPlaceContract(marketPlaceContractAddr, web3)
    .methods.cancelMarketItemErc1155(orderId)
    .send({ from: account, gas: 2207160 });
  return result;
};

// 购买使用原生币, marketType 区分一、二级市场
export const createMarketSaleErc1155 = async (web3: Web3, obj?: any) => {
  const { orderId, price, marketType, Erc1155ContractAddr, marketPlaceContractAddr, account } = obj;
  const nftContract = Erc1155ContractAddr; // nft合约地址
  try {
    const result = await (marketType === 1
      ? getMarketPlacePrimaryContract(marketPlaceContractAddr, web3)
      : getMarketPlaceContract(marketPlaceContractAddr, web3)
    ).methods
      .createMarketSaleErc1155(nftContract, orderId)
      .send({ from: account, value: price, gas: 2207160 });
    return result;
  } catch (error: any) {
    console.log('error', error);
    instanceLoading.close();
  }
};

// 购买使用erc20, marketType 区分一、二级市场
export const createMarketSaleWithTokenErc1155 = async (web3: Web3, obj?: any) => {
  const { orderId, price, marketType, Erc1155ContractAddr, moneyMintAddress, marketPlaceContractAddr, account } = obj;

  const nftContract = Erc1155ContractAddr; // nft合约地址
  try {
    const result = await (marketType === 1
      ? getMarketPlacePrimaryContract(marketPlaceContractAddr, web3)
      : getMarketPlaceContract(marketPlaceContractAddr, web3)
    ).methods
      .createMarketSaleWithTokenErc1155(nftContract, moneyMintAddress, orderId, price)
      .send({ from: account, gas: 2207160 });
    return result;
  } catch (error: any) {
    console.log('error', error);
    instanceLoading.close();
  }
};

// 修改价格，marketType 区分一、二级市场
export const getModifyPrice = async (web3: Web3, obj: any) => {
  console.log('modifyPrice', obj);
  const { orderId, newPrice, marketType, marketPlaceContractAddr, account } = obj;
  try {
    const result = await (marketType === 1
      ? getMarketPlacePrimaryContract(marketPlaceContractAddr, web3)
      : getMarketPlaceContract(marketPlaceContractAddr, web3)
    ).methods
      .modifyPrice(orderId, newPrice)
      .send({ from: account, gas: 2207160 });
    console.log('result', result);
    return result;
  } catch (error: any) {
    console.log('error', error);
    instanceLoading.close();
  }
};
