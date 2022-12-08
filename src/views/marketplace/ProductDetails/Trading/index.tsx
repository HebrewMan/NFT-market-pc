import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { formatTime } from '../../utils';
import config from '../../../../config/constants';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { intlFloorFormat } from 'Utils/bigNumber'

export const Trading = (props: any) => {
  const { t } = useTranslation()
  const _chainId = window?.ethereum?.chainId;
  const chainId = !isMobile ? parseInt(_chainId, 16) : parseInt(_chainId);
  const [tradingHistoryData, setTradingHistoryData] = useState<any>([]);
  const deepTradingHistoryData = [...props.tradingHistoryData];
  const [detailsState, setDetailsState] = useState(false);
  const [filterState, setFilterState] = useState(false);
  const linkEth = (config as any)[chainId]?.BLOCKCHAIN_LINK;
  const [filterList, setFilterList] = useState([
    { label: '3', name: t('marketplace.details.mintTo'), checked: false },
    { label: '0', name: t('marketplace.details.listings'), checked: false },
    { label: '1', name: t('marketplace.details.cancel'), checked: false },
    { label: '2', name: t('marketplace.details.trade'), checked: false },
    { label: '4', name: t('marketplace.details.batchMintTo'), checked: false },
    { label: '5', name: t('marketplace.details.updatePrcie'), checked: false },
    { label: '6', name: t('marketplace.details.transfer'), checked: false },
  ]);
  const [eventBtn, setEventBtn] = useState<any>([]);
  const history = useHistory();
  useEffect(() => {
    setTradingHistoryData(props.tradingHistoryData);
  }, [props]);

  const handleClearCurrent = (current: any) => {
    const currentList = eventBtn.filter((item: any) => item !== current);
    const currentFilterList = filterList.map((item) =>
      currentList.includes(item.label) ? { ...item, checked: true } : { ...item, checked: false },
    );
    setFilterList([...currentFilterList]);
    setEventBtn(currentList);
    filterEventData(currentList);
  };
  const handleClearAll = () => {
    setEventBtn([]);
    setFilterList(filterList.map((item) => ({ ...item, checked: false })));
    filterEventData([]);
  };
  const showEventName = (method: any) => {
    switch (method) {
      case 3:
        return t('marketplace.details.mintTo');
      case 0:
        return t('marketplace.details.listings');
      case 1:
        return t('marketplace.details.cancel');
      case 2:
        return t('marketplace.details.trade');
      case 4:
        return t('marketplace.details.batchMintTo');
      case 5:
        return t('marketplace.details.updatePrcie');
      case 6:
        return t('marketplace.details.transfer');
    }
  };
  const iconClass = (item: any) => {
    switch (item.method) {
      case 3:
        return 'minto';
      case 0:
        return 'listing';
      case 1:
        return 'listing';
      case 2:
        return 'match';
      case 4:
        return 'minto';
      case 5:
        return 'listing';
      case 6:
        return 'transfer';
      default:
        return 'minto';
    }
  };
  const handleChangeFromRoute = (item: any) => {
    switch (item.method) {
      case 3:
        return false;
      default:
        return history.push(`/account/0/${item?.fromAddr}`);
    }
  };
  const handleChangeToRoute = (item: any) => {
    return history.push(`/account/0/${item?.toAddr}`);
  };
  const setAddrFrom = (item: any) => {
    switch (item.method) {
      case 3:
        return 'NullAddress';
      default:
        return item?.fromAddr?.substr(2, 6);
    }
  };
  const handleChangeValue = (e: any, index: number) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setFilterState(true);
    const deepList = [...filterList];
    deepList[index].checked = !deepList[index].checked;
    const eventList: Array<string> = deepList
      .map((item) => (item.checked ? item.label : ''))
      .filter((item) => item.trim());
    setFilterList([...deepList]);
    setEventBtn(eventList);
    filterEventData(eventList);
  };
  const filterEventData = (eventList: any) => {
    if (eventList.length <= 0) {
      return setTradingHistoryData(deepTradingHistoryData);
    }
    const list = new Array();
    deepTradingHistoryData.forEach((item) => {
      if (eventList.includes(item.method.toString())) {
        list.push({ ...item });
      }
    });
    setTradingHistoryData([...list]);
  };
  const Uli = () => (
    <div className='filter-checkbox'>
      {/* onClick={e => changeCheckbox(e)} */}
      <ul id='filter-checkbox-select'>
        {filterList.map((item, index) => {
          return (
            <label htmlFor={item.label} key={index} onClick={(e) => handleChangeValue(e, index)}>
              <li>
                <input type='checkbox' checked={item.checked} onClick={(e) => handleChangeValue(e, index)} />
                {item.name}
              </li>
            </label>
          );
        })}
      </ul>
    </div>
  );

  const TrItem = () =>
    tradingHistoryData.length > 0 &&
    tradingHistoryData.map((item: any, index: number) => {
      return (
        <tr key={index}>
          <td className='first-child'>
            <img src={require(`../../../../assets/${iconClass(item)}.svg`)} className='svg-img-16' alt='' />
            <span>{showEventName(item.method)}</span>
          </td>
          <td>
            {(
              <img src={require('../../../../assets/coin/aitd.svg')} alt='' className='svg-img' />
            )}
            {intlFloorFormat(item.price,4)}
          </td>
          <td>
            <a onClick={() => handleChangeFromRoute(item)}>{setAddrFrom(item)}</a>
          </td>
          <td>
            <a onClick={() => handleChangeToRoute(item)}>{item?.toAddr?.substr(2, 6)}</a>
          </td>
          <td>
            <a
              href={item.txHash ? linkEth + 'tx/' + item.txHash : ''}
              target={item.txHash ? '_blank' : ''}
              rel='noreferrer'
            >
              <span>{formatTime(item?.createDate)}</span>
              {/* {item.txHash ? (
                <img src={require('../../../../assets/linkEth.svg')} style={{ marginLeft: 10 }} alt='' />
              ) : (
                <></>
              )} */}
            </a>
          </td>
        </tr>
      );
    });

  const Table = () => (
    <div className='details-table'>
      <table>
        <thead>
        <tr>
            <td className='first-child'>{t('marketplace.details.transaction')}</td>
            <td>{t('marketplace.price')}</td>
            <td>{t('marketplace.from')}</td>
            <td>{t('marketplace.to')}</td>
            <td>{t('common.date')}</td>
          </tr>
        </thead>
        <tbody>
          <TrItem />
        </tbody>
      </table>
    </div>
  );

  const Content = () => (
    <div className='list-content'>
      <div className='details-filter'>
        <div className='details-top'>
          <div className='filter' onClick={() => setFilterState(!filterState)}>
            <p>{t('marketplace.details.filter')}</p>
            <img
              src={
                !filterState
                  ? require('../../../../assets/arrow.svg')
                  : require('../../../../assets/expand_less_gray.svg')
              }
              alt=''
            />
            {filterState ? <Uli /> : <></>}
          </div>
        </div>
        <div className='details-button' id='filter-button'>
          {eventBtn.map((item: any) => (
            <button key={item} id='mintToBtn' onClick={() => handleClearCurrent(item)}>
              {showEventName(Number(item))} <img src={require('../../../../assets/close.svg')} width={20} alt='' />
            </button>
          ))}
          {eventBtn.length > 0 && <span onClick={handleClearAll}>{t('marketplace.details.clearAll')}</span>}
        </div>
      </div>
      {<Table />}
    </div>
  );
  return (
    <div className='trading-history'>
      <div className='list-title title-point' onClick={() => setDetailsState(!detailsState)}>
        <img src={require('../../../../assets/tradding.svg')} alt='' className='svg-default-size' />
        <h2>{t('marketplace.details.history')}</h2>
        <div className='arrow-icon'>
          <img
            src={
              !detailsState
                ? require('../../../../assets/arrow.svg')
                : require('../../../../assets/expand_less_gray.svg')
            }
            alt=''
          />
        </div>
      </div>
      {/* filter */}
      {!detailsState ? <Content /> : <></>}
    </div>
  );
};
