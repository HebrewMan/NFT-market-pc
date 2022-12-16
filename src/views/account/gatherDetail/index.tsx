
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Input, Typography } from 'antd'
import { Select } from 'Src/views/marketplace/Select'
import { getListedNftList } from 'Src/api'
import './index.scss'
import { HeaderSearch } from 'Src/components/HeaderSearch'
import { useTranslation } from 'react-i18next'
import { intlFloorFormat, NumUnitFormat } from 'Utils/bigNumber'
import AEmpty from "Src/components/Empty"
import ListItem from 'Src/components/ListItem'
import { formatTokenId, } from 'Utils/utils'
import { formatAdd } from '../../marketplace/utils'
import _ from 'lodash'

export const GatherDetail: React.FC<any> = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const [data, setData] = useState<any>(history.location.state)
  const [grid, setGrid] = useState(localStorage.getItem('listItenGrid'))
  const [sort, setSort] = useState<any>("new")
  const [keyWord, setKeyWord] = useState('')
  const [inputMin, setInputMin] = useState('')
  const [inputMax, setInputMax] = useState('')
  const [listData, setListData] = useState<any[]>([])
  const [infoVisible, setInfoVisible] = useState(false)

  const queryList = [
    { name: `${t('marketplace.recentlyListed')}`, value: 'new' },
    { name: `${t('marketplace.LowToHigh')}`, value: 'low' },
    { name: `${t('marketplace.highToLow')}`, value: 'high' },
  ]
  useEffect(() => {
    const state: any = history.location.state
    console.log(state?.item, 'state?.itemstate?.item')

    state && setData(state?.item)
    getList()
  }, [])

  // 获取集合列表
  const getList = async () => {
    const res: any = await getListedNftList({
      page: 1,
      size: 12,
    })
    setListData(res.data.records)
    // setTotal(res.data.total);
  }
  const getKeyWord = (value: string) => {
    // setGoodsList([]);
    // setParams({ ...params, name: value, page: 1 });
  }
  const handleChangeQuery = () => {

  }

  const getDescInfo = () => {
    const { Paragraph } = Typography
    const article = data.description
    return (
      <Paragraph
        ellipsis={
          infoVisible
            ? false
            : {
              rows: 3,
              expandable: true,
              symbol: (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    setInfoVisible(true)
                  }}
                >
                  展开
                </span>
              ),
            }
        }
      >
        {article}
        {infoVisible && <a onClick={() => setInfoVisible(false)}>收起</a>}
      </Paragraph>
    )
  }
  const CardItem = () => {
    return listData.map((item: any, index: number) => {
      return (
        <div className='card' key={index}>
          <Link to={`/product-details/${item.orderId}`}>
            <div className='assets'>
              <img src={item.imageUrl} alt='' />
            </div>
            <div className='assets-info'>
              <div className='desc'>
                <div className='name'>{formatTokenId(item.name, item.tokenId)}</div>
              </div>
              <div className='collection-name'>{item.collectionName}</div>
              <div className='price'>
                <img src={require('Src/assets/coin/aitd.svg')} alt='' className='coin-img' />
                {intlFloorFormat(item.price, 4) + ` ${item?.coin || 'AITD'}`}
              </div>
            </div>
          </Link>
        </div>
      )
    })
  }
  return (
    <div className='gatherDetail-body'>
      <div className='gatherDetail-banner'>
        <img src={require('Src/assets/account/bg-banner.png')} alt="" />
      </div>
      <div className='gatherDetail-center'>
        <div className='gatherDetail-info'>
          <div className='info-waper'>
            <img src="https://aitd-nft-images-test.s3.amazonaws.com/4e0fd1d406994e05a2ffe73006b1f0cf.jpg" alt="cover" className='cover' />
            <div className='info-list'>
              <section className='name'>{data.name}</section>
              <div className='info-address'>
                <div>合约：{formatAdd(data.contractAddr)}<img src={require('Src/assets/account/content_copy_gray.png')} alt="" /></div>
                <div>创作者: {formatAdd(data.createAddr)} <img src={require('Src/assets/account/content_copy_gray.png')} alt="" /></div>
              </div>
              <div className='moreinfo'>
                {getDescInfo()}
              </div>
              <div className='detail-amount'>
                <section>
                  <p className='label'>地板价</p>
                  <div className='text'>
                    <img src={require('Src/assets/coin/aitd.svg')} alt="" />
                    <span>{intlFloorFormat(data.lowestPrice)}</span>
                  </div>
                </section>
                <section>
                  <p className='label'>总成交量</p>
                  <div className='text'>
                    <img src={require('Src/assets/coin/aitd.svg')} alt="" />
                    <span>{NumUnitFormat(data.totalTransaction)}</span>
                  </div>
                </section>
                <section>
                  <p className='label'>总数</p>
                  <div className='text'>
                    <span>{NumUnitFormat(data.totalTokens)}</span>
                  </div>
                </section>
                <section>
                  <p className='label'>持有者</p>
                  <div className='text'>
                    <span>{NumUnitFormat(data.totalHolder)}</span>
                  </div>
                </section>
                <section>
                  <p className='label'>总挂单</p>
                  <div className='text'>
                    <span>{NumUnitFormat(data.totalOrder)}</span>
                  </div>
                </section>
                <section>
                  <p className='label'>版税</p>
                  <div className='text'>
                    <span>{data.royalty}%</span>
                  </div>
                </section>
              </div>
            </div>
          </div>
          <div className='shareLink'>
            {!_.isNull(data.linkSkypegmwcn) && <a href={data.linkSkypegmwcn} target="_window">
              <img src={require('Src/assets/account/icon-gw.png')} alt="" />
            </a>
            }
            {!_.isNull(data.linkTwitter) && <a href={data.linkTwitter} target="_window">
              <img src={require('Src/assets/account/icon-Twitter.png')} alt="" />
            </a>
            }
            {!_.isNull(data.linkDiscord) && <a href={data.linkDiscord} target="_window">
              <img src={require('Src/assets/account/icon-Discord.png')} alt="" />
            </a>
            }
            {!_.isNull(data.linkInstagram) && <a href={data.linkInstagram} target="_window">
              <img src={require('Src/assets/account/icon-Instagram.png')} alt="" />
            </a>
            }
            {!_.isNull(data.linkMedium) && <a href={data.linkMedium} target="_window">
              <img src={require('Src/assets/account/icon-Medium.png')} alt="" />
            </a>
            }
            {data.createAddr === data.ownerAddr &&
              <Link to={{ pathname: '/gather-edit', state: data }}>
                <img src={require('Src/assets/account/icon-edit.png')} alt="" />
              </Link>
            }

          </div>
        </div>
        <div className='marketplace-waper'>
          <div className='filter'>
            <section>
              <HeaderSearch getKeyWord={getKeyWord} keyWord={keyWord} placeholder={t('marketplace.serach')} />
              <div className='condition'>
                <Select list={queryList} placeholder={t('marketplace.sortBy')} change={handleChangeQuery} value={sort} />
              </div>
              {/* <div className='price'>
                {t('marketplace.price')}
                <Input
                  className='min'
                  value={inputMin}
                  placeholder={t('marketplace.min') || undefined}
                  style={{ width: 84, height: 41 }}
                // onChange={handleChangeMin}
                />
                <span className='to'>{t('marketplace.to')}</span>
                <Input
                  placeholder={t('marketplace.max') || undefined}
                  value={inputMax}
                  style={{ width: 84, height: 41 }}
                // onChange={handleChangeMax}
                />
              </div> */}
            </section>
            <ListItem handleGrid={() => { setGrid(localStorage.getItem('listItenGrid')) }} />
          </div>
          <div className={`g-list ${grid == '2' ? 'small' : ''}`}>
            {listData.length > 0 ? CardItem() : <AEmpty />}
          </div>
        </div>
      </div>
    </div>
  )
}
