import React, { useState, memo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button, message } from 'antd';
import { isMobile } from 'react-device-detect';
import useWeb3 from '../../../../hooks/useWeb3';
// import { useFixedPriceCreateSellOrder } from "../../../../hooks/sellContract"
import {
  getIsApprovedForAll,
  getSetApprovalForAll,
  getSetERC711ApprovalForAll,
  getERC711IsApproved,
} from '../../../../hooks/web3Utils';
import { createMarketItemErc1155, getModifyPrice, createMarketItem } from '../../../../hooks/marketplace';
import { getUpdateSellOrder, getUpdateLowerPrice } from '../../../../api/index';
import instanceLoading from '../../../../utils/loading';
import { getLocalStorage, toPriceDecimals, debounce, getCookie } from '../../../../utils/utils';
import config, { USDT, isProd, ContractType, CoinType } from '../../../../config/constants';
import './index.scss';
import { useTranslation } from 'react-i18next';
const UpdatePriceView = ({
  price,
  tokenId,
  contractAddr,
  accountAddress,
  goodsId,
  orderId,
  isOpen,
  sellOrderFlag,
  isAITD,
  contractType,
  moneyAddr,
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
  isAITD: boolean;
  contractType: string | null;
  moneyAddr: string | null;
  close: Function;
  updateGoods: Function;
}) => {
  const {t} = useTranslation()
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
  const [sellAmounts, setSellAmounts] = useState(1);
  const isERC721: boolean = contractType === ContractType.ERC721;
  const walletAccount = localStorage.getItem('wallet') || '';
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
          // message.success('Update successful!');
          updateClose();
          updateGoods();
        }
      })
      .catch((err: any) => {
      });
  };
  const getSellOrder = async () => {
    // 上架
    if (!account || !token) {
      message.error(t('hint.pleaseLog'));
      history.push('/login');
      return;
    }
    if (chainId !== 1319 && isProd) {
      message.error(t('hint.switchMainnet'));
      return;
    }
    const isApproval = isERC721
      ? await getERC711IsApproved(tokenId, marketPlaceContractAddr, web3)
      : await getIsApprovedForAll(account, marketPlaceContractAddr, contractAddr, web3);
    let approvalRes: any = undefined;
    let orderRes: any = undefined;
    const _price = !updatePrice ? price : updatePrice;
    // console.log(_price, typeof _price,'_price_price_price');
    if (!price && !updatePrice) {
      message.error(t('hint.priceSet'));
      return;
    }
    if (_price <= 0) {
      message.error(t('hint.numbersGreater'));
      setUpdatePrice('');
      return;
    }
    instanceLoading.service();
    // 未授权，先授权
    if (!isApproval) {
      // ERC721 返回值为用户当前tokenid所授权的地址，如果未授权则返回 0x0000000000000000000000000000000000000000 地址
      approvalRes = isERC721
        ? await getSetERC711ApprovalForAll(account, marketPlaceContractAddr, tokenId, contractAddr, web3)
        : await getSetApprovalForAll(account, marketPlaceContractAddr, true, contractAddr, web3);
    }

    // 已授权，调用上架合约
    if (isApproval || approvalRes?.transactionHash) {
      const obj = {
        // moneyMintAddress: (config as any)?.ZERO_ADDRESS, // 购买nft的token合约地址，原生币传0地址
        moneyMintAddress: moneyAddr || (config as any)?.ZERO_ADDRESS, // 后台返回币种地址，否则默认原生币
        tokenId, // nft ID
        price: toPriceDecimals(_price, 18), // nft 价格
        Erc1155ContractAddr: contractAddr,
        marketPlaceContractAddr,
        account,
        ctype: contractType,
        amounts: sellAmounts,
      };
      console.log(obj,'commints price');

      try {
        orderRes = await createMarketItem(web3, obj);

      } catch (error: any) {
        instanceLoading.close();
      }
    }
    if (orderRes?.transactionHash) {
      // 上架通知后台
      message.success(t('hint.order'));
       // 上架成功 跳转到个人资产
       history.push(`/account/0/${walletAccount}`)
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
    const _price = !updatePrice ? (price) : (updatePrice);
    const obj = {
      orderId, // 订单id
      newPrice: toPriceDecimals(_price, 18), // 价格
      marketType: 2, // 二级市场
      marketPlaceContractAddr,
      account,
    };
    if (!account || !token) {
      message.error(t('hint.pleaseLog'));
      history.push('/login');
      return;
    }
    if (chainId !== 1319 && isProd) {
      message.error(t('hint.switchMainnet'));
      return;
    }
    instanceLoading.service();
    try {
      const modifyPriceRes = await getModifyPrice(web3, obj);
      if (modifyPriceRes?.transactionHash) {
        // 修改价格通知后台
        const updateObj = {
          id: Number(goodsId),
          tokenId,
          price: _price,
        };
        updateLowerPrice(updateObj);
      }
    } catch (error: any) {
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
      message.error(t('hint.numbersOnly'));
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

  const handleAmountsChange = (event: any) => {
    const value = event.target.value;
    if (!/(^[1-9]\d*$)/.test(value)) {
      message.error('Please enter numbers only！');
      return;
    }
    if (value <= 0) {
      message.error('Please only enter numbers greater than zero!');
      return;
    }
    setSellAmounts(Number(value));
  };

  useEffect(() => {
    showModal(isOpen);
  }, [isOpen]);
  return (
    <>
      <Modal
        title={sellOrderFlag ? t('marketplace.details.setPrice') : t('marketplace.details.updateListPrice')}
        visible={isModalVisible}
        onOk={getSellOrderOrUpdatePrice}
        onCancel={updateClose}
        footer={[
          <Button key='back' onClick={updateClose}>
             {t('marketplace.details.neverMind')}
          </Button>,
          <Button key='submit' type='primary' onClick={getSellOrderOrUpdatePrice}>
            {t('marketplace.details.CompleteList')}
          </Button>,
        ]}
        className='sellOrderAndUpdatePrice'
      >
        <div className='update-price'>
          <div className='price'>
            <input defaultValue={CoinType.AITD} disabled />
            <input placeholder={t('marketplace.details.priceEnter') || undefined} defaultValue={updatePrice} onChange={debounce(handleChange)} />
            {/* {!isERC721 && (
              <input
                placeholder='please enter amounts'
                defaultValue={sellAmounts}
                onChange={debounce(handleAmountsChange)}
              />
            )} */}
          </div>
          <p></p>
          <p>{t('marketplace.details.sellTips')}</p>
        </div>
      </Modal>
    </>
  );
};
export default memo(UpdatePriceView);
