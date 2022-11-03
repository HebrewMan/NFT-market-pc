import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
export const PageTitle = (props: any) => {
  const { title } = props;
  return (
    <div className='page-title'>
      <h2>{title}</h2>
    </div>
  );
};
export const SetupDetails = () => {
  return (
    <div>
      <PageTitle title={'Buy And Sell Your NFT'} />
      <div className='nft-list'>
        <div className='nft-list-item'>
          <img src={require(`../../../assets/setting.png`)} alt='' />
          <p className='item-title'>Setting your wallet</p>
          <p className='item-text'>Once you've set up your wallet of choice, connect it to Diffgalaxy by clicking the wallet icon in the top right corner. Learn about thewallets we support.
          </p>
        </div>

        <div className='nft-list-item'>
          <img src={require(`../../../assets/nft.png`)} alt='' />
          <p className='item-title'>Buy NFT</p>
          <p className='item-text'>Enter the name of the NFT you want to purchase in the search box to see the details of the NFT. Click the Buy Now button,Select Pay and follow the instructions in your wallet.</p>
        </div>

        <div className='nft-list-item'>
          <img src={require(`../../../assets/sale.png`)} alt='' />
          <p className='item-title'>Sell NFT</p>
          <p className='item-text'>Select the NFT to sell in my NFTS list, Set the NFT price and click the Sell button. Once the transaction is completed, the NFT will be transferred to purchaser wallet and you will receive the funds.</p>
        </div>
      </div>
    </div>
  );
};
