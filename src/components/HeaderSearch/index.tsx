import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { getSearchGoods } from '../../api'
import { NumUnitFormat } from "Utils/bigNumber"
import { debounce } from 'lodash'
import './index.scss'

const { Option, OptGroup } = Select
export const HeaderSearch = (props: any) => {
  const { t } = useTranslation()
  const [keyword, setKeyWord] = useState(props.keyWord)
  const [placeholder, setPlaceholder] = useState(props.placeholder)
  const onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      props.getKeyWord(e.target.value)
    }
  }

  const handleSearch = debounce(function (e) {
    setKeyWord(e.target.value)
    props.getKeyWord(e.target.value)
  }, 200)

  useEffect(() => {
    setKeyWord(props.keyWord)
  }, [props.reset])
  return (
    <div className='g-search'>
      <div className='prepend'>
        <img src={require('../../assets/search.svg')} width='22' style={{ verticalAlign: 'bottom' }} alt='' />
      </div>
      <input
        type='text'
        onKeyDownCapture={(e) => onKeyDown(e)}
        onInput={handleSearch}
        placeholder={placeholder}
      />
    </div>
  )
}

export const SelectGroup = () => {
  const [keyWord, setKeyWord] = useState<string>('')
  const { t } = useTranslation()
  const [collectionList, setCollectionList] = useState<any>([])
  const [nftList, setNftList] = useState<any>([])
  const [userList, setUserList] = useState<any>([])
  const history = useHistory()

  const handleChange = (value: any) => {
    const optionValue = JSON.parse(value)
    const { id, contractAddr, tokenId, userAddr, orderId } = optionValue
    if (tokenId || orderId) {
      history.push({
        pathname: "/product-details",
        state: { tokenId, contractAddr, orderId }
      })
    } else if (userAddr) {
      history.push(`/account/0/${userAddr}`)
    }
    else {
      history.push(`/gather-detail/${id}`)
    }
  }
  const handleSearch = debounce((value: string) => {
    if (value.length >= 3) setKeyWord(value)
  }, 200)

  const initList = async () => {
    const res: any = await getSearchGoods({ keyWord })
    setCollectionList(res?.data.collectionList)
    setNftList(res?.data.nftList)
    setUserList(res?.data.userList)
  }
  useEffect(() => {
    keyWord != '' && initList()
  }, [keyWord])

  return (
    <div id='area' style={{ width: '100%' }}>
      <Select
        placeholder={t('nav.searchTips')}
        suffixIcon={<SearchOutlined />}
        style={{ width: '100%' }}
        showArrow={true}
        showSearch={true}
        onSelect={handleChange}
        onSearch={handleSearch}
        notFoundContent={null}
        getPopupContainer={triggerNode => triggerNode.parentNode}
        optionLabelProp={'label'}
      >
        {collectionList.length > 0 &&
          <OptGroup label={'集合'}>
            {collectionList.map((item: any) => {
              return (
                <Option key={item.id} value={JSON.stringify(item)} label={''}>
                  <div className='gatherSeacher'>
                    <section>
                      <img className='option-img' src={item.headUrl} alt='' width={24} />
                      <span>{item.name}</span>
                    </section>
                    <section>
                      {NumUnitFormat(item.nftSum)}
                    </section>
                  </div>

                </Option>
              )
            })}

          </OptGroup>
        }
        {nftList.length > 0 &&
          <OptGroup label={'Item'}>
            {nftList.map((item: any) => {
              return (
                <Option key={item.tokenId} value={JSON.stringify(item)} label={''}>
                  <img className='option-img' src={item.imageUrl} alt='' width={24} />
                  <span>{item.name}</span>
                </Option>
              )
            })}
          </OptGroup>
        }
        {userList.length > 0 &&
          <OptGroup label='账户'>
            {userList.map((item: any) => {
              return (
                <Option key={item.userAddr} value={JSON.stringify(item)} label={item.username}>
                  <img className='option-img' src={item.imageUrl} alt='' width={24} />
                  <span>{item.username}</span>
                </Option>
              )
            })}
          </OptGroup>
        }
      </Select>

    </div>
  )
}
