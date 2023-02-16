import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './index.scss'
export const PageTitle = (props: any) => {
  const { title } = props
  return (
    <div className='page-title'>
      <h2>{title}</h2>
    </div>
  )
}
export const SetupDetails = () => {
  const { t } = useTranslation()
  return (
    <div>
      {/* <PageTitle title={t('home.assets.title')} /> */}
      <div className='nft-list'>
        <div className='nft-list-item safety-bg'>
          <img src={require(`Src/assets/home/safety.png`)} alt='' />
          <p className='item-title'>
            安全可靠
            {/* {t('home.assets.setting')} */}
          </p>
          <p className='item-text'>
            去中心化设计，且继承了世界上最分散的区块链特性和智能合约的安全和可靠性。
            {/* {t('home.assets.settingRemind')} */}
          </p>
        </div>

        <div className='nft-list-item fee-bg'>
          <img src={require(`Src/assets/home/fee.png`)} alt='' />
          <p className='item-title'>
            超低手续费
            {/* {t('home.assets.buy')} */}
          </p>
          <p className='item-text'>
            设置业界最低的交易手续费，极大地为用户交易 NFT 降低了成本。
            {/* {t('home.assets.buyRemind')} */}
          </p>
        </div>

        <div className='nft-list-item relation-bg'>
          <img src={require(`Src/assets/home/relation.png`)} alt='' />
          <p className='item-title'>
            为GameFi而生
            {t('home.assets.sell')}
          </p>
          <p className='item-text'>
            专注于 GameFi 领域的 NFT 资产交易，只为链接您与 GameFi 的未来。
            {/* {t('home.assets.sellRemind')} */}
          </p>
        </div>
      </div>
    </div>
  )
}
