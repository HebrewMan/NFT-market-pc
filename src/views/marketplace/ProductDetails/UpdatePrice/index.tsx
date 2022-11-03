import React, { useState, memo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button, message } from 'antd';
import { isMobile } from 'react-device-detect';
import useWeb3 from '../../../../hooks/useWeb3';
// import { useFixedPriceCreateSellOrder } from "../../../../hooks/sellContract"
import { getIsApprovedForAll, getSetApprovalForAll } from '../../../../hooks/web3Utils';
import { createMarketItemErc1155, getModifyPrice } from '../../../../hooks/marketplace';
import { getUpdateSellOrder, getUpdateLowerPrice } from '../../../../api/index';
import instanceLoading from '../../../../utils/loading';
import { getLocalStorage, toPriceDecimals, debounce, getCookie } from '../../../../utils/utils';
import config, { USDT, isProd } from '../../../../config/constants';
import './index.scss';

const UpdatePriceView = ({
  price,
  tokenId,
  contractAddr,
  accountAddress,
  goodsId,
  orderId,
  isOpen,
  sellOrderFlag,
  close,
  updateGoods,
}: {
  price: string | number;
  tokenId: string;
  contractAddr: string;
  accountAddress: string | null | undefined;
  goodsId: string;
  orderId: number;
  isOpen: boolean;
  sellOrderFlag: boolean;
  close: Function;
  updateGoods: Function;
}) => {
  const web3 = useWeb3();
  const history = useHistory();
  const account = getLocalStorage('wallet') || '';
  const token = getCookie('web-token') || '';
  const _chainId = window?.ethereum?.chainId;
  const chainId = !isMobile ? parseInt(_chainId, 16) : parseInt(_chainId);
  const marketPlaceContractAddr = (config as any)[chainId]?.MARKET_ADDRESS;
  const Erc1155ContractAddr = (config as any)[chainId]?.ERC1155;
  const USDT_ADDRESS = (config as any)[chainId]?.USDT_ADDRESS;
  const [isModalVisible, setIsModalVisible] = useState<boolean>(isOpen);
  const [updatePrice, setUpdatePrice] = useState(price);

  const showModal = (isOpen: boolean) => {
    setIsModalVisible(isOpen);
    setUpdatePrice(price);
  };
  const updateClose = () => {
    setIsModalVisible(false);
    setUpdatePrice('');
    close(false);
  };
  // 上架之后给后台传goodsId和价格
  // const updateSellOrder = (updateObj: any) => {
  //   getUpdateSellOrder(updateObj).then((res: any) => {
  //     if (res?.message === 'success') {
  //       message.success('上架成功！');
  //       updateClose();
  //       updateGoods();
  //     }
  //   });
  // };
  // 更新价格，给后台传goodsId和价格
  const updateLowerPrice = async (updateObj: any) => {
    getUpdateLowerPrice(updateObj)
      .then((res: any) => {
        if (res?.message === 'success') {
          updateClose();
          updateGoods();
        }
      })
      .catch((err: any) => {
        console.log('getUpdateLowerPrice error', err);
      });
  };
  const getSellOrder = async () => {
    // 上架
    if (!account || !token) {
      message.error('Please log in first!');
      history.push('/login');
      return;
    }
    if (chainId !== 1319 && isProd) {
      message.error('Please switch to mainnet!');
      return;
    }
    const isApproval = await getIsApprovedForAll(account, marketPlaceContractAddr, contractAddr, web3);
    let approvalRes: any = undefined;
    let orderRes: any = undefined;
    const _price = !updatePrice ? Number(price) : Number(updatePrice);
    if (!price && !updatePrice) {
      message.error('Price must be set for blind box！');
      return;
    }
    instanceLoading.service();
    // 未授权，先授权
    if (!isApproval) {
      approvalRes = await getSetApprovalForAll(account, marketPlaceContractAddr, true, contractAddr, web3);
    }
    // 已授权，调用上架合约
    if (isApproval || approvalRes?.transactionHash) {
      const obj = {
        // moneyMintAddress: (config as any)?.ZERO_ADDRESS, // 购买nft的token合约地址，原生币传0地址
        moneyMintAddress: USDT_ADDRESS, // test 暂时只用U的地址
        tokenId, // nft ID
        price: toPriceDecimals(_price, USDT.decimals),
        Erc1155ContractAddr: contractAddr,
        marketPlaceContractAddr,
        account,
      };

      try {
        orderRes = await createMarketItemErc1155(web3, obj);
      } catch (error: any) {
        console.log('createMarketItemErc1155 error', error);
        instanceLoading.close();
      }
    }
    if (orderRes?.transactionHash) {
      // 上架通知后台
      message.success('Order successful!');
      updateClose();
      updateGoods();
      // const updateObj = {
      //   nftId: Number(goodsId),
      //   price: _price,
      // };
      // updateSellOrder(updateObj);
    }
    instanceLoading.close();
  };
  const getUpdatePrice = async () => {
    const _price = !updatePrice ? Number(price) : Number(updatePrice);
    const obj = {
      orderId, // 订单id
      newPrice: toPriceDecimals(_price, USDT.decimals), // 价格
      marketType: 2, // 二级市场
      marketPlaceContractAddr,
      account,
    };
    if (!account || !token) {
      message.error('Please log in first!');
      history.push('/login');
      return;
    }
    if (chainId !== 1319 && isProd) {
      message.error('Please switch to mainnet!');
      return;
    }
    instanceLoading.service();
    try {
      const modifyPriceRes = await getModifyPrice(web3, obj);
      if (modifyPriceRes?.transactionHash) {
        // 修改价格通知后台
        const updateObj = {
          nftId: Number(goodsId),
          price: _price,
        };
        updateLowerPrice(updateObj);
      }
    } catch (error: any) {
      console.log('createMarketItemErc1155 error', error);
      instanceLoading.close();
    }
    instanceLoading.close();
  };
  const getSellOrderOrUpdatePrice = () => {
    if (sellOrderFlag) {
      getSellOrder();
    } else {
      getUpdatePrice();
    }
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    const reg = /[^\d.]{1,18}/;

    if (reg.test(value)) {
      message.error('Please enter numbers only！');
      return;
    }
    if (value <= 0) {
      message.error('Please only enter numbers greater than zero!');
      setUpdatePrice('');
      return;
    }
    const posDot = value.indexOf('.');
    if (posDot < 0) {
      if (value.length < 18) {
        setUpdatePrice(value);
        return;
      } else {
        if (value.length > 18) {
          setUpdatePrice(value.substring(0, 18));
        }
        return;
      }
    }
    setUpdatePrice(value.substring(0, posDot + 19));
  };

  useEffect(() => {
    showModal(isOpen);
  }, [isOpen]);
  return (
    <>
      <Modal
        title={sellOrderFlag ? 'Set the listing price' : 'Update the listing price'}
        visible={isModalVisible}
        onOk={getSellOrderOrUpdatePrice}
        onCancel={updateClose}
        footer={[
          <Button key='back' onClick={updateClose}>
            Never mind
          </Button>,
          <Button key='submit' type='primary' onClick={getSellOrderOrUpdatePrice}>
            Complete listing
          </Button>,
        ]}
        className='sellOrderAndUpdatePrice'
      >
        <div className='update-price'>
          <div className='price'>
            <input defaultValue='USDT' disabled />
            <input placeholder='please enter price' defaultValue={updatePrice} onChange={debounce(handleChange)} />
          </div>
          <p>
            Tips: NFT must set the price. You must pay an additional gas fee if you want to cancel this listing at a
            later point.
          </p>
        </div>
      </Modal>
    </>
  );
};
export default memo(UpdatePriceView);
