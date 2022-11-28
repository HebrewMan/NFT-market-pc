import Web3 from 'web3';
import { getMarketPlaceContract, getMarketPlacePrimaryContract, getMarketPlaceAitdV3Abi } from './web3Utils';
import instanceLoading from '../utils/loading';
import { multipliedBy } from '../utils/bigNumber';

// 定义gasPrice
export  const commonGasPrice = async (web3: Web3) =>{
  const _gasPrice = await web3.eth.getGasPrice()
  const commonGasPrice = Web3.utils.toHex(multipliedBy(_gasPrice,1.1));
  return commonGasPrice;
}

// 上架 1155
export const createMarketItemErc1155 = async (web3: Web3, obj: any) => {
  const { moneyMintAddress, tokenId, price, Erc1155ContractAddr, marketPlaceContractAddr, account } = obj;
  const nftContract = Erc1155ContractAddr; // nft合约地址
  const result = await getMarketPlaceContract(marketPlaceContractAddr, web3)
    .methods.createMarketItemErc1155(nftContract, moneyMintAddress, tokenId, price)
    .send({ from: account, gasPrice:commonGasPrice });
  return result;
};

/*
nftContract nft合约地址
moneyMintAddress 订单币种地址，如果是AITD原生币，则该字段传入 0x0000000000000000000000000000000000000000
tokenId nft token id
amount 挂单数量，此字段针对erc1155，如果是erc721则传1
price 挂单价格
ctype nft类型，0 为 ERC721, 1 为 ERC1155
*/
// 最新上架  区分1155 和 721
export const createMarketItem = async (web3: Web3, obj: any) => {
  const { moneyMintAddress, tokenId, price, Erc1155ContractAddr, marketPlaceContractAddr, account, ctype, amounts } =
    obj;
  const nftContract = Erc1155ContractAddr; // nft合约地址
  // 如果是721类型 amount传1
  // const count = (ctype === 0 ? 1 : amounts) || 1;
  const type = ctype === 'ERC1155' ? 1 : 0;
  const result = await getMarketPlaceAitdV3Abi(marketPlaceContractAddr, web3)
    .methods.createMarketItem(nftContract, moneyMintAddress, tokenId, amounts, price, type)
    .send({ from: account, gasPrice:commonGasPrice });
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
    .send({ from: account, gasPrice:commonGasPrice });
  return result;
};

// 最新下架
/*
  itemId 订单ID，挂单时合约会生成一个订单ID，订单id为一个自增的整数，每一个订单都有唯一的订单ID
*/
export const cancelMarketItem = async (web3: Web3, orderId: number, account: any, marketPlaceContractAddr: string) => {
  const result = await getMarketPlaceAitdV3Abi(marketPlaceContractAddr, web3)
    .methods.cancelMarketItem(orderId)
    .send({ from: account, gasPrice:commonGasPrice });
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
      .send({ from: account, value: price, gasPrice:commonGasPrice });
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
      .send({ from: account, gasPrice:commonGasPrice });
    return result;
  } catch (error: any) {
    console.log('error', error);
    instanceLoading.close();
  }
};

// 2.0.1新增 购买NFT
export const createMarketSale = async (web3: Web3, obj?: any) => {
  const { orderId, price, Erc1155ContractAddr, moneyMintAddress, marketPlaceContractAddr, account, amounts, coin } =
    obj;
  console.log('🚀 ~ file: marketplace.ts ~ line 119 ~ createMarketSale ~ obj', obj);

  const nftContract = Erc1155ContractAddr; // nft合约地址
  let sendObj: any = { from: account, gasPrice:commonGasPrice };
  // 原生币支付要给value传值, value为发交易的时候支付多少
  if (coin === 'AITD') {
    sendObj = { ...sendObj, value: price };
  }
  try {
    const result = await getMarketPlaceAitdV3Abi(marketPlaceContractAddr, web3)
      .methods.createMarketSale(nftContract, moneyMintAddress, orderId, amounts, price)
      .send(sendObj);
    return result;
  } catch (error: any) {
    console.log('error', error);
    instanceLoading.close();
  }
};

// 最新订单成交
/*
  nftContract nft合约地址
  moneyMintAddress 订单币种地址，如果是AITD原生币，则该字段传入 0x0000000000000000000000000000000000000000
  itemId 订单ID，由后端提供
  amount 成交数量，此字段针对erc1155，如果是erc721则传1。成交数量不能大于订单剩余数量
  price 订单价格
*/
export const MarketItemSold = async (web3: Web3, obj?: any) => {
  const { price, Erc1155ContractAddr, moneyMintAddress, marketPlaceContractAddr, account, amount, itemId, ctype } = obj;
  const nftContract = Erc1155ContractAddr; // nft合约地址
  try {
    const result = await getMarketPlaceAitdV3Abi(marketPlaceContractAddr, web3)
      .methods.MarketItemSold(nftContract, moneyMintAddress, itemId, amount, price)
      .send({ from: account, gasPrice:commonGasPrice });
    return result;
  } catch (error: any) {
    console.log('error', error);
    instanceLoading.close();
  }
};

// 2.0.1 修改价格，marketType 区分一、二级市场
export const getModifyPrice = async (web3: Web3, obj: any) => {
  console.log('modifyPrice', obj);
  const { orderId, newPrice, marketType, marketPlaceContractAddr, account } = obj;
  try {
    // const result = await (marketType === 1
    //   ? getMarketPlacePrimaryContract(marketPlaceContractAddr, web3)
    //   : getMarketPlaceContract(marketPlaceContractAddr, web3)
    // )
    const result = await getMarketPlaceAitdV3Abi(marketPlaceContractAddr, web3)
      .methods.modifyPrice(orderId, newPrice)
      .send({ from: account, gasPrice:commonGasPrice });
    console.log('result', result);
    return result;
  } catch (error: any) {
    console.log('error', error);
    instanceLoading.close();
  }
};

// 最新修改价格
export const getPriceChange = async (web3: Web3, obj: any) => {
  const { orderId, price, marketPlaceContractAddr } = obj;
  try {
    const result = await getMarketPlaceAitdV3Abi(marketPlaceContractAddr, web3)
      .methods.MarketItemPriceChange(orderId, price)
      .send({ gasPrice:commonGasPrice });
    console.log('result', result);
    return result;
  } catch (error: any) {
    console.log('error', error);
    instanceLoading.close();
  }
};
