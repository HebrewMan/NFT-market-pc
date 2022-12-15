
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from 'antd'
import { Select } from 'Src/views/marketplace/Select'
import { getListedNftList } from 'Src/api'
import './index.scss'
import { HeaderSearch } from 'Src/components/HeaderSearch'
import { useTranslation } from 'react-i18next'
import { intlFloorFormat } from 'Utils/bigNumber'
import AEmpty from "Src/components/Empty"
import ListItem from 'Src/components/ListItem'
import { formatTokenId } from 'Utils/utils'

export const GatherDetail: React.FC<any> = () => {
  const { t } = useTranslation()
  const [grid, setGrid] = useState(localStorage.getItem('listItenGrid'))
  const [sort, setSort] = useState<any>("new")
  const [keyWord, setKeyWord] = useState('')
  const [inputMin, setInputMin] = useState('')
  const [inputMax, setInputMax] = useState('')
  const [listData, setListData] = useState<any[]>([])
  const queryList = [
    { name: `${t('marketplace.recentlyListed')}`, value: 'new' },
    { name: `${t('marketplace.LowToHigh')}`, value: 'low' },
    { name: `${t('marketplace.highToLow')}`, value: 'high' },
  ]
  useEffect(() => {
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
              <section className='name'>Star Minebronze</section>
              <div className='info-address'>
                <div>合约：0x5d25...01ded2 <img src={require('Src/assets/account/content_copy_gray.png')} alt="" /></div>
                <div>创作者：0x5d25...01ded2 <img src={require('Src/assets/account/content_copy_gray.png')} alt="" /></div>
              </div>
              <div className='moreinfo'>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod...</p>
                <label>更多</label>
              </div>
              <div className='detail-amount'>
                <section>
                  <p className='label'>地板价</p>
                  <div className='text'>
                    <img src={require('Src/assets/coin/aitd.svg')} alt="" />
                    <span>0.5</span>
                  </div>
                </section>
                <section>
                  <p className='label'>总成交量</p>
                  <div className='text'>
                    <img src={require('Src/assets/coin/aitd.svg')} alt="" />
                    <span>2354.45</span>
                  </div>
                </section>
                <section>
                  <p className='label'>总数</p>
                  <div className='text'>
                    <span>120k</span>
                  </div>
                </section>
                <section>
                  <p className='label'>持有者</p>
                  <div className='text'>
                    <span>0x5d25...01ded2</span>
                  </div>
                </section>
                <section>
                  <p className='label'>总挂单</p>
                  <div className='text'>
                    <span>232.08k</span>
                  </div>
                </section>
                <section>
                  <p className='label'>版税</p>
                  <div className='text'>
                    <span>5%</span>
                  </div>
                </section>
              </div>
            </div>
          </div>
          <div className='shareLink'>
            <a href='http://www.baidu.com' target="_window">
              <img src={require('Src/assets/account/icon-gw.png')} alt="" />
            </a>
            <a href='http://www.baidu.com' target="_window">
              <img src={require('Src/assets/account/icon-Twitter.png')} alt="" />
            </a>
            <a href='http://www.baidu.com' target="_window">
              <img src={require('Src/assets/account/icon-Discord.png')} alt="" />
            </a>
            <a href='http://www.baidu.com' target="_window">
              <img src={require('Src/assets/account/icon-Instagram.png')} alt="" />
            </a>
            <a href='http://www.baidu.com' target="_window">
              <img src={require('Src/assets/account/icon-Medium.png')} alt="" />
            </a>
            <Link to={'/gather-edit/1'}>
              <img src={require('Src/assets/account/icon-edit.png')} alt="" />
            </Link>

          </div>
        </div>
        <div className='marketplace-waper'>
          <div className='filter'>
            <section>
              <HeaderSearch getKeyWord={getKeyWord} keyWord={keyWord} placeholder={t('marketplace.serach')} />
              <div className='condition'>
                <Select list={queryList} placeholder={t('marketplace.sortBy')} change={handleChangeQuery} value={sort} />
              </div>
              <div className='price'>
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
              </div>
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
