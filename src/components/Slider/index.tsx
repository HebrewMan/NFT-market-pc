import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { isMobile } from 'react-device-detect'
import { fromPriceDecimals, getLocalStorage } from '../../utils/utils'
import { formatAdd } from '../../views/marketplace/utils/index'
import './index.scss'
import useWeb3 from '../../hooks/useWeb3'
import useWindowDimensions from '../../utils/layout'
import { getBalanceOf } from '../../hooks/web3Utils'
import { USDT } from '../../config/constants'

export const Slider = (props: any) => {
  const web3 = useWeb3()
  const { account, deactivate } = useWeb3React()
  const { width } = useWindowDimensions()
  const { showDropper } = props
  const [action, setAction] = useState(false)
  const [walletAccount, setWalletAccount] = useState<string | null | undefined>(getLocalStorage('wallet'))
  const [balance, setBalance] = useState<string>('0')
  const pathname = window.location.pathname || ''
  const chainId = parseInt(window.ethereum?.chainId)
  const Erc20ContractAddr = USDT.address || ''

  // 获取eth 钱包余额
  const getBalance = () => {
    const wallet = walletAccount || account
    if (!wallet || !Erc20ContractAddr) {
      return
    }
    try {
      // web3?.eth?.getBalance(wallet).then((res) => {
      getBalanceOf(Erc20ContractAddr, wallet).then((res) => {
        const decimals = chainId === 1319 ? 6 : 18
        const balance = fromPriceDecimals(res, decimals).toFixed(4)
        if (!res) {
          return
        }
        setBalance(balance)
      })
    } catch (error) {
      console.log('getBalance', error)
    }
  }
  // 监听钱包地址、钱包余额变化
  useEffect(() => {
    if (!deactivate) {
      return
    }
    if (
      (pathname === '/wallet' && (account || walletAccount))
    ) {
      getBalance()
    }
  }, [account, walletAccount, showDropper])

  const Ul = () => (
    <ul>
      <li>
        {/* <svg-icon icon-class="logout"></svg-icon> */}
        <span>Log out</span>
      </li>
      <li>
        {/* <svg-icon icon-class="loop"></svg-icon> */}
        <span>Refresh funds</span>
      </li>
    </ul>
  )
  const handleOnClick = (e: any, flag: boolean) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    setAction(flag)
  }
  // const stopAction = (e) => {
  //   e.stopPropagation()
  //   e.nativeEvent.stopImmediatePropagation()
  //   setAction(false)
  // }
  return (
    <>
      {(showDropper) && (
        <div
          className={`dropper-wrap`}
          onClick={(e) => handleOnClick(e, false)}
        >
          <div className='wrap-header'>
            <div className='header-select' onClick={(e) => handleOnClick(e, !action)}>
              <img src={require('../../assets/usdt.png')} alt='' />
              <span>My wallet</span>
              {/* <svg-icon icon-class="expand_more_gray"></svg-icon> */}
            </div>
            {action && <Ul />}

            <div className='walletAddr'>
              <span>{formatAdd(walletAccount || account)}</span>
            </div>
          </div>
          <div className='total'>
            {/* <div className="total-top">
              <p>Total balance</p>
              <h1>$1,216.40 USD</h1>
              <button>Add Funds</button>
            </div> */}
            <div className='total-footer'>
              <div className='footer-left'>
                <img src={require('../../assets/usdt.png')} alt='' />
                <div>
                  <h5 className='dark'>USDT</h5>
                  {/* <p className='light'>Aitd</p> */}
                </div>
              </div>
              <div className='footer-right'>
                <div>
                  <p className='dark'>{balance}</p>
                  {/* <p className='light'>{Number(balance).toFixed(4)} USD</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
