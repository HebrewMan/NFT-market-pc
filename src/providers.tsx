import type { ReactNode } from 'react'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { ethers } from 'ethers'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { UnsupportedChainIdError, Web3ReactProvider, useWeb3React } from '@web3-react/core'
import JSBI from 'jsbi'
import { Account, AccountType, Balance, Connector, ConnectorConfig, EthereumProvider, Status, Wallet } from './types'
import { getConnectors } from './connectors'
import { ConnectionRejectedError, ChainUnsupportedError, ConnectorUnsupportedError } from './errors'
import { getAccountIsContract, getBlockNumber, getNetworkName, pollEvery } from './utils'
import { Spin } from 'antd'
import { AppLayout } from './components/Layout'
import { store } from 'Src/store'
import $web3js from './hooks/web3'

const UseWalletContext = React.createContext<WalletContext>(null)

type WalletContext = {
  addBlockNumberListener: (callback: (blockNumber: number) => void) => void
  pollBalanceInterval: number
  pollBlockNumberInterval: number
  removeBlockNumberListener: (callback: (blockNumber: number) => void) => void
  wallet: Wallet
} | null

type UseWalletProviderProps = {
  chainId: number
  children: ReactNode
  connectors: { [key: string]: Connector | ConnectorConfig }
  pollBalanceInterval: number
  pollBlockNumberInterval: number
}

function useWallet(): Wallet {
  const walletContext = useContext(UseWalletContext)

  if (walletContext === null) {
    throw new Error(
      'useWallet() can only be used inside of <UseWalletProvider />, ' + 'please declare it at a higher level.',
    )
  }

  const getBlockNumber = useGetBlockNumber()
  const { wallet } = walletContext

  return useMemo(() => {
    return { ...wallet, getBlockNumber }
  }, [getBlockNumber, wallet])
}

function useGetBlockNumber(): () => number | null {
  const walletContext = useContext(UseWalletContext)
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const requestedBlockNumber = useRef<boolean>(false)

  const getBlockNumber = useCallback<() => number | null>(() => {
    if (walletContext === null) {
      return null
    }

    requestedBlockNumber.current = true
    walletContext.addBlockNumberListener(setBlockNumber)

    return blockNumber
  }, [walletContext, blockNumber])

  useEffect(() => {
    if (!requestedBlockNumber.current || walletContext === null) {
      return
    }

    walletContext.addBlockNumberListener(setBlockNumber)
    return () => {
      walletContext.removeBlockNumberListener(setBlockNumber)
    }
  }, [requestedBlockNumber, walletContext])

  return getBlockNumber
}

// Only watch block numbers, and return functions allowing to subscribe to it.
function useWatchBlockNumber({
  ethereum,
  pollBlockNumberInterval,
}: {
  ethereum: EthereumProvider
  pollBlockNumberInterval: number
}) {
  const lastBlockNumber = useRef<number | null>(null)

  // Using listeners lets useWallet() decide if it wants to expose the block
  // number, which implies to re-render whenever the block number updates.
  const blockNumberListeners = useRef<Set<(blockNumber: number) => void>>(new Set())

  const addBlockNumberListener = useCallback((cb: any) => {
    if (blockNumberListeners.current.has(cb)) {
      return
    }

    // Immediately send the block number to the new listener
    cb(lastBlockNumber.current)

    // Add the listener
    blockNumberListeners.current.add(cb)
  }, [])

  const removeBlockNumberListener = useCallback((cb: any) => {
    blockNumberListeners.current.delete(cb)
  }, [])

  // Update the block number and broadcast it to the listeners
  const updateBlockNumber = useCallback((blockNumber: any) => {
    if (lastBlockNumber.current === blockNumber) {
      return
    }

    lastBlockNumber.current = blockNumber
    blockNumberListeners.current.forEach((cb) => cb(blockNumber))
  }, [])

  useEffect(() => {
    if (!ethereum) {
      updateBlockNumber(null)
      return
    }

    let cancel = false

    const pollBlockNumber = pollEvery(() => {
      return {
        request: () => getBlockNumber(ethereum),
        onResult: (latestBlockNumber: number) => {
          if (!cancel) {
            updateBlockNumber(latestBlockNumber === null ? null : JSBI.BigInt(latestBlockNumber).toString())
          }
        },
      }
    }, pollBlockNumberInterval)

    const stopPollingBlockNumber = pollBlockNumber()

    return () => {
      cancel = true
      stopPollingBlockNumber()
    }
  }, [ethereum, pollBlockNumberInterval, updateBlockNumber])

  return { addBlockNumberListener, removeBlockNumberListener }
}

function UseWalletProvider({
  chainId,
  children,
  // connectors contains init functions and/or connector configs.
  connectors: connectorsInitsOrConfigs,
  pollBalanceInterval,
  pollBlockNumberInterval,
}: UseWalletProviderProps) {
  const walletContext = useContext(UseWalletContext)

  if (walletContext !== null) {
    throw new Error('<UseWalletProvider /> has already been declared.')
  }

  const [loadingStatus, setLoadingStatus] = useState(false)
  const [connector, setConnector] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [type, setType] = useState<AccountType | null>(null)
  const [status, setStatus] = useState<Status>('disconnected')
  const web3ReactContext = useWeb3React()
  const activationId = useRef<number>(0)
  const { account, library: ethereum, deactivate } = web3ReactContext
  // const balancex = useWalletBalancex({ account, pollBalanceInterval })
  // const allowance = useWalletAllowance({ account, pollBalanceInterval })
  const { addBlockNumberListener, removeBlockNumberListener } = useWatchBlockNumber({
    ethereum,
    pollBlockNumberInterval,
  })
  // Combine the user-provided connectors with the default ones (see connectors.js).
  const connectors = useMemo(() => getConnectors(connectorsInitsOrConfigs), [connectorsInitsOrConfigs])

  const reset = useCallback(() => {
    if (web3ReactContext.active) {
      web3ReactContext.deactivate()
    }
    setConnector(null)
    setError(null)
    setStatus('disconnected')
  }, [web3ReactContext])

  const connect = useCallback(
    async (connectorId = 'injected') => {
      console.log('connect:::', connectorId)

      // Prevent race conditions between connections by using an external ID.
      const id = ++activationId.current

      reset()

      // Check if another connection has happened right after deactivate().
      if (id !== activationId.current) {
        return
      }

      if (!connectors[connectorId]) {
        setStatus('error')
        setError(new ConnectorUnsupportedError(connectorId))
        return
      }

      // If no connection happens, we're in the right context and can safely update
      // the connection stage status
      setStatus('connecting')

      const [connectorInit, connectorConfig] = connectors[connectorId] || []

      // Initialize the (useWallet) connector if it exists.
      const connector = await connectorInit?.()

      // Initialize the web3-react connector if it exists.
      const web3ReactConnector = connector?.web3ReactConnector?.({
        chainId,
        ...(connectorConfig || {}),
      })

      if (!web3ReactConnector) {
        setStatus('error')
        setError(new ConnectorUnsupportedError(connectorId))
        return
      }

      try {
        // TODO: there is no way to prevent an activation to complete, but we
        // could reconnect to the last provider the user tried to connect to.
        setConnector(connectorId)
        // await web3ReactContext.activate(web3ReactConnector, undefined, true)
        setStatus('connected')
      } catch (err: any) {
        // Don’t throw if another connection has happened in the meantime.
        if (id !== activationId.current) {
          return
        }

        // If not, the error has been thrown during the current connection attempt,
        // so it's correct to indicate that there has been an error
        setConnector(null)
        setStatus('error')

        if (err instanceof UnsupportedChainIdError) {
          setError(new ChainUnsupportedError(-1, chainId))
          return
        }
        // It might have thrown with an error known by the connector
        if (connector.handleActivationError) {
          const handledError = connector.handleActivationError(err)
          if (handledError) {
            setError(handledError)
            return
          }
        }
        // Otherwise, set to state the received error
        setError(err)
      }
    },
    [chainId, connectors, reset, web3ReactContext],
  )

  useEffect(() => {
    if (!account || !ethereum) {
      return
    }

    let cancel = false

    setType(null)

    getAccountIsContract(ethereum, account).then((isContract: any) => {
      if (!cancel) {
        setStatus('connected')
        setType(isContract ? 'contract' : 'normal')
      }
    })

    return () => {
      cancel = true
      setStatus('disconnected')
      setType(null)
    }
  }, [account, ethereum])

  useEffect(() => {
    // 监听账号和chainId变化
    $web3js.onEthereumEvent()
  }, [])

  useEffect(() => {
    store.subscribe(() => {
      setLoadingStatus(store.getState().load.loading)
    })
  }, [loadingStatus])

  const wallet = useMemo(
    () => ({
      _web3ReactContext: web3ReactContext,
      account: account || null,
      chainId,
      connect,
      connector,
      connectors,
      error,
      ethereum,
      networkName: getNetworkName(chainId),
      reset,
      status,
      type,
    }),
    [account, chainId, connect, connector, connectors, error, ethereum, type, reset, status, web3ReactContext],
  )

  return (
    <UseWalletContext.Provider
      value={{
        addBlockNumberListener,
        pollBalanceInterval,
        pollBlockNumberInterval,
        removeBlockNumberListener,
        wallet,
      }}
    >
      {/* {children} */}
      {/* loadingStatus */}
      <Spin spinning={loadingStatus} size='large'>
        <AppLayout>{children}</AppLayout>
      </Spin>
    </UseWalletContext.Provider>
  )
}

UseWalletProvider.propTypes = {
  chainId: PropTypes.number,
  children: PropTypes.node,
  connectors: PropTypes.objectOf(PropTypes.object),
  pollBalanceInterval: PropTypes.number,
  pollBlockNumberInterval: PropTypes.number,
}

UseWalletProvider.defaultProps = {
  chainId: 1,
  connectors: {},
  pollBalanceInterval: 2000,
  pollBlockNumberInterval: 5000,
}

// function getLibrary(library: any) {
//   // const library = new ethers.providers.Web3Provider(provider);
//   // library.pollingInterval = 10;
//   return library;
// }
const getLibrary = (library: any) => {
  // const library = new ethers.providers.Web3Provider(provider)
  // library.pollingInterval = 8000 // frequency provider is polling
  return library
}


function UseWalletProviderWrapper(props: UseWalletProviderProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <UseWalletProvider {...props} />
    </Web3ReactProvider>
  )
}

UseWalletProviderWrapper.propTypes = UseWalletProvider.propTypes
UseWalletProviderWrapper.defaultProps = UseWalletProvider.defaultProps

export {
  ConnectionRejectedError,
  ChainUnsupportedError,
  ConnectorUnsupportedError,
  UseWalletProviderWrapper as UseWalletProvider,
  useWallet,
}

export default useWallet
