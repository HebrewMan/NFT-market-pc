import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { formatAdd } from '../../utils';
import config from '../../../../config/constants';
import './index.scss';

// const PropertyList = (props: any) => {
//   const [iconState, setIconState] = useState(false);
//   const list = props.propertyList || [];
//   const listItem = () =>
//     list.map((item: any, index: number) => {
//       return (
//         <div className='content' key={index}>
//           <p className='colour'>{item.traitType}</p>
//           <h2>{item.value}</h2>
//           <p className='trait'>{/* <!-- <span>{{ item.scale }}</span> have this trait --> */}</p>
//         </div>
//       );
//     });
//   return (
//     <div className='list-inner'>
//       <div className='list-title title-point'>
//         <h2>Properties</h2>
//       </div>
//       {iconState ? <div className='content-wrap'>{listItem()}</div> : <></>}
//     </div>
//   );
// };

// const LevelsList = (props: any) => {
//   const [levelsState, setLevelsState] = useState(false);
//   const list = props.levelList || [];
//   const listItem = list.map((item: any, index: number) => {
//     return (
//       <div key={index} className='product-levels'>
//         <div className='levels'>
//           <span>{item.name}</span>
//           <span>
//             {item.value} of {item.max}
//           </span>
//         </div>
//         <div className='line'>
//           <div style={{ width: (item.value / item.max) * 100 + '%' }} className='line-color'></div>
//         </div>
//       </div>
//     );
//   });
//   return (
//     <div className='list-inner'>
//       <div className='list-title title-point'>
//         <img src='/sol/star.svg' alt='' className='svg-default-size' />
//         <h2>levels</h2>
//       </div>
//       {levelsState ? <div className='list-inner-levels'>{listItem}</div> : <></>}
//     </div>
//   );
// };

// const StatsList = (props: any) => {
//   const [statsState, setStatsState] = useState(false);
//   const list = props.statList || [];
//   const listItem = list.map((item: any, index: number) => {
//     return (
//       <div key={index} className='list-content stats'>
//         <p>{item.name}</p>
//         <p>
//           {item.value} of {item.max}
//         </p>
//       </div>
//     );
//   });
//   return (
//     <div className='list-inner'>
//       <div className='list-title title-point' onClick={() => setStatsState(!statsState)}>
//         <img src={require('../../../../assets/chart.svg')} alt='' className='svg-default-size' />
//         <h2>Stats</h2>
//         <div className='arrow-icon'>
//           <img
//             src={
//               !statsState ? require('../../../../assets/arrow.svg') : require('../../../../assets/expand_less_gray.svg')
//             }
//             alt=''
//           />
//         </div>
//       </div>
//       {statsState ? <div className='list-inner-levels'>{listItem}</div> : <></>}
//     </div>
//   );
// };

// const Details = (props: any) => {
//   const _chainId = window?.ethereum?.chainId;
//   const chainId = !isMobile ? parseInt(_chainId, 16) : parseInt(_chainId);
//   const linkEth = (config as any)[chainId]?.BLOCKCHAIN_LINK;
//   const [detailsState, setDetailsState] = useState(false);
//   const { contractAddr, tokenId } = props;
//   return (
//     <div className='list-inner'>
//       <div className='list-title title-point'>
//         <h2>Details</h2>
//       </div>
//       <div className='list-content details'>
//         <div className='details-left'>
//           <p>Contract Address</p>
//           <p>Token ID</p>
//           <p>Token Standard</p>
//           <p>Blockchain</p>
//         </div>
//         <div className='details-right'>
//           <a href={linkEth + 'address/' + contractAddr} target='_blank'>
//             {formatAdd(contractAddr)}
//           </a>
//           <p>{tokenId}</p>
//           <p>ERC-1155</p>
//           <p>AITD</p>
//         </div>
//       </div>
//     </div>
//   );
// };

export const DescInfo = (props: any) => {
  const [type, setType] = useState(1);
  const { t } = useTranslation();

  return (
    <div className='desc-information'>
      <div className='information-list'>
        {/* desc */}
        <div className={`list-inner ${type === 1 ? 'active' : ''}`} onClick={() => setType(1)}>
          <div className='list-title title-point'>
            <h2>{t('marketplace.details.description')}</h2>
          </div>
        </div>

        <div className={`list-inner ${type === 2 ? 'active' : ''}`} onClick={() => setType(2)}>
          <div className='list-title title-point'>
            <h2>{t('marketplace.details.properties')}</h2>
          </div>
        </div>
        {/* <div className={`list-inner ${type === 3 ? 'active' : ''}`} onClick={() => setType(3)}>
          <div className='list-title title-point'>
            <h2>{t('marketplace.details.collection')}</h2>
          </div>
        </div> */}
        <div className={`list-inner ${type === 4 ? 'active' : ''}`} onClick={() => setType(4)}>
          <div className='list-title title-point'>
            <h2>{t('marketplace.details.tokenDetails')}</h2>
          </div>
        </div>
      </div>
      <ContentDetail {...props} type={type} />
    </div>
  );
};

const ContentDetail = (props: any) => {
  const { t } = useTranslation();
  const { metadata, collectionsData } = props;
  const list = metadata.propertyList || [];
  const { contractAddr, tokenId } = props;

  if (props.type === 1) {
    return (
      <div className='content-wrap desc'>
        <div className='list-content'>
          <p>{props.description}</p>
        </div>
      </div>
    );
  } else if (props.type === 2) {
    const listItem = () =>
      list.map((item: any, index: number) => {
        return (
          <div className='content' key={index}>
            <p className='colour'>{item.traitType}</p>
            <h2>{item.value}</h2>
          </div>
        );
      });
    return <div className='content-wrap properties'>{listItem()}</div>;
  } else if (props.type === 3) {
    return (
      <div className='content-wrap desc'>
        <div className='list-content'>
          <p>{collectionsData.description}</p>
        </div>
      </div>
    );
  } else if (props.type === 4) {
    const _chainId = window?.ethereum?.chainId;
    const chainId = parseInt(_chainId);
    const linkEth = (config as any)[chainId]?.BLOCKCHAIN_LINK;
    return (
      <div className='content-wrap detail'>
        <div className='list-content details'>
          <div className='details-left'>
            <p>{t('marketplace.details.address')}</p>
            <p>{t('marketplace.details.token')}</p>
            <p>{t('marketplace.details.standard')}</p>
            <p>{t('marketplace.details.blockchain')}</p>
          </div>
          <div className='details-right'>
            <a href={linkEth + 'address/' + contractAddr} target='_blank'>
              {formatAdd(contractAddr)}
            </a>
            <p>{tokenId}</p>
            <p>ERC-1155</p>
            <p>AITD</p>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
