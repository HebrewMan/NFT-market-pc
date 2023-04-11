import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { ethers } from 'ethers'
import { message } from 'antd'
import Portal from '../../../../../components/Dialog'
import { CommTimer } from '../../Timer'
import { Content, ContentSuccess } from './content'
// import $web3js from '../../../../../hooks/web3';
import useWeb3 from '../../../../../hooks/useWeb3'
// import { getUpdateBuyOrder } from '../../../../../api/index';
import { createMarketSaleWithTokenErc1155 } from '../../../../../hooks/marketplace'
import { getApproval, getIsApproved } from '../../../../../hooks/web3Utils'
// import { useAddBlindBoxContract, useOpenBlindBoxContract } from '../../../../../hooks/useContract';
import { openBlindBox } from '../../../../../api/blindbox'
import instanceLoading from '../../../../../utils/loading'
import { getCookie, getLocalStorage, toPriceDecimals } from '../../../../../utils/utils'
import config, { USDT, isProd } from '../../../../../config/constants'
import { useTranslation } from 'react-i18next'
import './index.scss'

export const ProDetails = (props: any) => {
  const web3: any = useWeb3()
  const { t } = useTranslation()
  const _chainId = window?.provider?.chainId
  const chainId = parseInt(_chainId)
  const Erc1155ContractAddr = (config as any)[chainId]?.ERC1155
  const primaryMarketPlaceContractAddr = (config as any)[chainId]?.PRIMARY_ADDRESS
  const account = getLocalStorage('wallet') || ''
  const token = getCookie('token') || ''
  const { nftGoods } = props
  const { blindStatus, tokenId, tags, metadataId } = useParams() as any
  const [visible, setVisible] = useState(false) // nft购买弹窗
  const [success, setSuccess] = useState(false) // nft购买成功弹窗
  const [ispay, setIspay] = useState(false)
  const [endTime, setEndTime] = useState({})
  const history = useHistory()
  // useEffect(() => {
  //   if (isSoldOut() || nftGoods.activityStatus == 3) {
  //     setEndTime({});
  //   } else {
  //     filterTime();
  //   }
  // }, [nftGoods]);
  // const filterTime = () => {
  //   const timeArr = localStorage.getItem('timeArr') ?? '[]';
  //   const time = JSON.parse(timeArr);
  //   const endTime = time.filter((item: any) => {
  //     return item.goodsId === nftGoods?.tokenId;
  //   });
  //   if (endTime.length) {
  //     setEndTime(endTime[0].downTime);
  //   }
  // };
  const blindbox = () => {
    return blindStatus ? blindStatus : ''
  }
  const wallectAccount = localStorage.getItem('wallet') // todo: 后续通过redux获取或者其它存储方式
  // 创建者按钮不显示
  const isOwner = () => {
    return (
      wallectAccount &&
      nftGoods.ownerAddr &&
      nftGoods.ownerAddr === wallectAccount &&
      nftGoods.createAddr !== wallectAccount
    )
  }
  //nft的购买按钮是否禁用  后台status状态: 0： 创建 1待上架  2：上架  3：下架  4：强制下架;
  const isBuy = () => {
    // || nftGoods.activityStatus !== 1不能购买逻辑 删除

    // 购买完成不能购买
    if (nftGoods.createAddr !== nftGoods.ownerAddr) {
      return false
    }
    return nftGoods.status === 2 && nftGoods.sellStatus === 1
  }
  // 下架
  const isBought = () => {
    // return nftGoods.firstSellStatus === 1 && nftGoods.status === 3;
    return nftGoods.status === 3
  }
  // 活动为进行中或者即将开始的展示  0-即将开始  1-进行中  2-已结束 3-已售罄
  const activted = () => {
    return nftGoods.activityStatus === 1 || (nftGoods.activityStatus === 0 && nftGoods.status === 2)
  }
  // 判断盲盒是否有买过, 买过则会产生tokenid
  const isBuying = () => {
    return tokenId !== '' && tokenId !== undefined
  }
  // 剩余数量为0不显示购买按钮
  const isSoldOut = () => {
    return nftGoods.blindBox?.availableNum === 0
  }
  const isOpen = () => {
    return tags == 1 || nftGoods.openStatus == 1 // 0 是未打开 1是打开
  }
  // 打开nft购买弹窗
  const handleNFTAction = () => {
    setVisible(true)
  }
  // 打开购买盲盒弹窗
  const handleBlindAction = () => {
    setVisible(true)
  }
  // 盲盒开启
  const handleOpenBlindBox = () => {
    setVisible(true)
    setIspay(true)
  }
  // 盲盒出价
  const handleOutPrice = () => {
    const id = nftGoods.metadata.goodsId
    history.push(`/asset/${id}`)
  }
  // 购买nft合约接口
  const handleChecked = () => {
    if (!ispay) {
      blindbox() ? buyBlindGoods() : buyNftGoods() // 购买nft或blind
    } else {
      // openBlind();
    }
  }
  // 打开盲盒
  // const openBlind = () => {
  //   instanceLoading.service();
  //   useOpenBlindBoxContract(tokenId)
  //     .then((res) => {
  //       if (res) {
  //         openBlindAction(res);
  //       }
  //     })
  //     .catch((err) => {
  //       instanceLoading.close();
  //       console.log(err);
  //     });
  // };
  const openBlindAction = (newTokenId: string) => {
    const params = {
      metadataId,
      tokenId: newTokenId,
    }
    openBlindBox(params).then((res: any) => {
      console.log(res)
      if (res.message == 'success') {
        message.success(t('hint.openBox'))
        setVisible(false)
        const { id, openStatus } = res.data
        const { tokenId } = res.data.metadata
        history.push(
          `/primary-details/${id}/${nftGoods.activityStatus}/${blindStatus}/${tokenId}/${openStatus}/${metadataId}`,
        )
        // this.$emit('openBlindBoxSuccess', { successBlindData: res.data });
      }
    })
  }
  // 购买盲盒
  const buyBlindGoods = () => {
    const { price } = nftGoods
    // instanceLoading.service();
    // useAddBlindBoxContract(price)
    //   .then((result: any) => {
    //     const params = {
    //       id: nftGoods.metadata.goodsId,
    //       tokenId: result?.tokenId,
    //       contractAddr: REACT_APP_CREATE_NFT,
    //     };
    //     if (result?.tokenId) {
    //       buyBlindBox(params).then((res: any) => {
    //         if (res.message === 'success') {
    //           setIspay(true);
    //           setSuccess(true);
    //           setVisible(false);
    //         }
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     instanceLoading.close();
    //     console.log('useMarketTrading return error', err);
    //   });
  }
  // 购买nft商品
  const buyNftGoods = async () => {
    // 买nft合约
    const _price = nftGoods.price
    const Erc20ContractAddr = USDT.address || ''
    let approvedRes: any = undefined
    let fillOrderRes: any = undefined
    let allowance = 0
    const obj = {
      orderId: nftGoods.orderId, // 订单id
      price: toPriceDecimals(_price, 18), // nft 价格
      marketType: 1, // 用于标注一级市场
      Erc1155ContractAddr: nftGoods.contractAddr,
      moneyMintAddress: USDT?.address,
      marketPlaceContractAddr: primaryMarketPlaceContractAddr,
      account,
    }

    if (!account || !token || !Erc20ContractAddr) {
      message.error('Please log in first！')
      history.push('/')
      return
    }
    if (chainId !== 1319 && isProd) {
      message.error('Please switch to mainnet!')
      return
    }
    instanceLoading.service()
    try {
      // 查看是否已授权
      const _allowance = await getIsApproved(account, primaryMarketPlaceContractAddr, Erc20ContractAddr)
      allowance = Number(_allowance) - Number(_price)
      if (allowance <= 0) {
        // 授权erc20 币种到市场合约
        approvedRes = await getApproval(
          account,
          primaryMarketPlaceContractAddr,
          ethers.constants.MaxUint256,
          Erc20ContractAddr,
        )
      }
      if (allowance > 0 || !!approvedRes?.transactionHash) {
        fillOrderRes = await createMarketSaleWithTokenErc1155(obj)
      }

      if (!!fillOrderRes?.transactionHash) {
        // 接后台购买接口
        const params = {
          nftId: nftGoods.metadata.nftId,
          txHash: fillOrderRes.transactionHash,
        }

        console.log(params, '---params')

        orderSuccess(params)
      }
      instanceLoading.close()
    } catch (error) {
      console.log('buyNftGoods error', error)
      instanceLoading.close()
    }
  }
  // 购买nft成功
  const orderSuccess = async (params: any) => {
    // const res: any = await getUpdateBuyOrder(params);
    // if (res.message === 'success') {
    setVisible(false)
    setSuccess(true)
    setIspay(true)
    // }
  }
  const handleBuySuccess = () => {
    setSuccess(false)
    if (blindbox()) {
      history.push(`/account/0/${wallectAccount}`)
    } else {
      // 在该页面时，重新刷新数据
      window.location.reload()
    }
  }
  const close = () => {
    setVisible(false)
  }
  const Timer = () => {
    if (!blindbox()) {
      if (activted())
        return (
          <li>
            <p>{t('primary.deadline')}</p>
            <div>
              <CommTimer
                className='wrap-header-timer'
                small={true}
                endTime={nftGoods?.countdown}
                activityStatus={Number(nftGoods.activityStatus)}
                isBought={isBought()}
              />
            </div>
          </li>
        )
    } else {
      if (!isOpen() && !isBuying()) {
        return (
          <li>
            <p>{t('primary.deadline')}</p>
            <div>
              <CommTimer
                className='wrap-header-timer'
                small={true}
                endTime={nftGoods?.countdown}
                isSoldOut={isSoldOut()}
                activityStatus={Number(nftGoods.activityStatus)}
              />
            </div>
          </li>
        )
      }
    }
  }
  const DefaultFooter = () => (
    <div className='footer'>
      {!isOwner() ? (
        <>
          <button onClick={handleNFTAction} disabled={!isBuy()}>
            {t('common.buyNow')}
          </button>
        </>
      ) : (
        <button onClick={handleNFTAction} disabled={isOwner() && nftGoods.activityStatus !== 1}>
          Bought
        </button>
      )}
    </div>
  )

  const BlindFooter = () => (
    <div className='footer'>
      {nftGoods.activityStatus == 1 ? (
        !isOwner() ? (
          !isBuying() ? (
            !isSoldOut() ? (
              <button onClick={handleBlindAction}>{t('common.buyNow')}</button>
            ) : (
              <button disabled={true}>{t('primary.soldOut')}</button>
            )
          ) : (
            isOpen() && <button onClick={handleOpenBlindBox}>{t('primary.openBox')}</button>
          )
        ) : (
          !isOpen() && isOwner() && <button onClick={handleOpenBlindBox}>{t('primary.openBox')}</button>
        )
      ) : isOpen() ? (
        isOwner() && <button onClick={handleOutPrice}>{t('primary.bidding')}</button>
      ) : (
        isOwner() && <button onClick={handleOpenBlindBox}>{t('primary.openBox')}</button>
      )}
    </div>
  )
  return (
    <>
      <div className='details-list'>
        <h1>{JSON.stringify(nftGoods) !== '{}' ? nftGoods.metadata.name : ''}</h1>
        <ul>
          {blindbox() && (
            <li>
              <p>{t('primary.Artist')}</p>
              <p>{nftGoods.metadata?.author}</p>
            </li>
          )}
          {(isOpen() || !blindbox()) && (
            <li>
              <p>{t('primary.owner')}</p>
              <p>{nftGoods.ownerAddr}</p>
            </li>
          )}
          {!blindbox() && (
            <li>
              <p>{t('primary.tokenId')}</p>
              <p>{JSON.stringify(nftGoods) !== '{}' ? nftGoods.tokenId : ''}</p>
            </li>
          )}
          <li>
            <p>{t('primary.amount')}</p>
            <p className={blindbox() ? (!isOpen() ? 'count' : '') : 'un-count'}>
              {!isOpen() && blindbox() && <img src='/sol/blind_box.svg' alt='' />}
              <span>✖ {!isOpen() && nftGoods.blindBox ? nftGoods.blindBox.num : 1}</span>
            </p>
          </li>
          <li>
            <p>{t('primary.address')}</p>
            <p className='address'>{nftGoods.contractAddr}</p>
          </li>
          {Timer()}
        </ul>
        {!isOpen() && (
          <div className='price'>
            <p>{blindbox() ? t('marketplace.price') : t('primary.currentPrice')}</p>
            <div className='price-heighting'>
              <span>
                <img src={require('../../../../../assets/usdt.png')} alt='' />
                {nftGoods.price}
              </span>
            </div>
          </div>
        )}
        {blindbox() ? <BlindFooter /> : <DefaultFooter />}
      </div>
      {/* <!-- 购买弹窗 --> */}
      <Portal
        closeText={t('common.cancel')}
        checkedText={!ispay ? t('common.cofirm') : blindbox() ? '开启盲盒' : ''}
        content={<Content ispay={ispay} nftGoods={nftGoods} />}
        visible={visible}
        close={close}
        checked={handleChecked}
      />
      {/* <!-- 购买成功 --> */}
      <Portal
        closeText={t('common.cancel')}
        checkedText={'OK'}
        content={<ContentSuccess />}
        visible={success}
        close={() => setSuccess(false)}
        checked={() => handleBuySuccess()}
      />
    </>
  )
}
