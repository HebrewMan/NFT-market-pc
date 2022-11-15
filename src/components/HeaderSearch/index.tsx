import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getSearchGoods } from '../../api';
import { debounce } from 'lodash';
import './index.scss';

const { Option, OptGroup } = Select;
export const HeaderSearch = (props: any) => {
  const { t } = useTranslation();
  const [keyword, setKeyWord] = useState(props.keyWord);
  const [placeholder, setPlaceholder] = useState(props.placeholder);
  const onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      props.getKeyWord(e.target.value);
    }
  };

  const handleSearch = debounce(function (e) {
    setKeyWord(e.target.value);
    props.getKeyWord(e.target.value);
  }, 1000);

  useEffect(() => {
    setKeyWord(props.keyWord);
  }, [props.reset]);
  return (
    <div className='g-search'>
      <div className='prepend'>
        <img src={require('../../assets/search.svg')} width='22' style={{ verticalAlign: 'bottom' }} alt='' />
      </div>
      <input
        type='text'
        // value={keyword || ''}
        onKeyDownCapture={(e) => onKeyDown(e)}
        onInput={handleSearch}
        placeholder={placeholder}
      />
    </div>
  );
};

export const SelectGroup = () => {
  const [nftGoodsList, setNftGoodsList] = useState<any[]>([]);
  const [keyWord, setKeyWord] = useState<string>('');
  const { t } = useTranslation();

  // const [blindGoodsList, setBlindGoodsList] = useState<any[]>([]);
  const history = useHistory();
  const handleChange = (value: any) => {
    const optionValue = JSON.parse(value);
    const { id } = optionValue;
    if (optionValue.type === 0) {
      history.push(`/primary-details/${id}/1/true`);
    } else {
      history.push(`/product-details/${id}`);
    }
  };
  const handleSearch = debounce((value: string) => {
    if (value) setKeyWord(value);
  }, 1000);
  const initList = async () => {
    const res: any = await getSearchGoods({ keyWord });
    setNftGoodsList(res?.data[1] || []);
    // setBlindGoodsList(res?.data[0] || [])
  };
  useEffect(() => {
    initList();
  }, [keyWord]);

  return (
    <Select
      placeholder={t('nav.searchTips')}
      suffixIcon={<SearchOutlined />}
      optionLabelProp='label'
      style={{ width: '100%' }}
      showArrow={true}
      showSearch={true}
      onChange={handleChange}
      onSearch={handleSearch}
      // value={keyWord}
    >
      <OptGroup label='NFT(Goods)'>
        {nftGoodsList.map((item) => {
          return (
            <Option key={item.id} value={JSON.stringify(item)} label={item.name}>
              <img className='option-img' src={item.imageUrl} alt='' width={24} />
              <span>{item.name}</span>
            </Option>
          );
        })}

        {/* <Option value="lucy">Lucy</Option> */}
      </OptGroup>
      {/* <OptGroup label='盲盒（商品）'>
        {blindGoodsList.map((item) => {
          return (
            <Option key={item.id} value={JSON.stringify(item)} label={item.name}>
              <img className='option-img' src={item.headUrl} alt='' width={24} />
              <span>{item.name}</span>
            </Option>
          );
        })}
      </OptGroup> */}
    </Select>
  );
};
