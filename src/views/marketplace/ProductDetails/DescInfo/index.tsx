import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { formatAdd } from '../../utils';
import config from '../../../../config/constants';
import './index.scss';
import { Table, Button } from 'antd';


export const DescInfo = (props: any) => {
  const [type, setType] = useState(0);
  const { t } = useTranslation();

  return (
    <div className='desc-information'>
      <div className='information-list'>
        {/* list 只有1155 才显示 */}
        { props?.DetailData.contractType === "ERC1155" && (
          <div className={`list-inner ${type === 0 ? 'active' : ''}`} onClick={() => setType(0)}>
            <div className='list-title title-point'>
              <h2>{t('marketplace.details.list')}</h2>
            </div>
          </div>
        )}
        
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
        <div className={`list-inner ${type === 4 ? 'active' : ''}`} onClick={() => setType(4)}>
          <div className='list-title title-point'>
            <h2>{t('marketplace.details.info')}</h2>
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
  
  // 模拟数据
  const columns:any = [
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      width:120,
      title: '',
      render: () => {
        return <Button type='primary' size={'small'}>{t('common.buy')}</Button>
      },
    },
  ];
  
  const data: any = [
    {
      key: '1',
      price: '5 USDT',
      amount: 32,
      address: 'AF0F4',
  
    },
    {
      key: '2',
      price: '5 USDT',
      amount: 32,
      address: 'AF0F4',
     
    },
    {
      key: '3',
      price: '5 USDT',
      amount: 32,
      address: 'AF0F4',
    
    },
    {
      key: '4',
      price: '5 USDT',
      amount: 32,
      address: 'AF0F4',
    },
  ];
  // 多订单
  const handlerMultipleOrders = () =>{
    return (
      <div className='MultipleOrders'>
        <Table columns={columns} dataSource={data} size="small" pagination={false} className={'TableWaper'}/>
      </div>
    )
  }


  if(props.type === 0){
    return handlerMultipleOrders()
  }
  else if (props.type === 1) {
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
