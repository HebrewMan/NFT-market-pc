import { ethers } from 'ethers'
import { Account, EthereumProvider } from './types'

const KNOWN_CHAINS = new Map<number, string>([
  [1319, 'AITDMAIN'],
  [1320, 'AITDTEST'],
  [1337, 'AITDETH'],
  [10, 'SOLANATESTNET']
])
async function ethereumRequest(
  ethereum: EthereumProvider,
  method: string,
  params: string[]
): Promise<any> {
  // If ethereum.request() exists, the provider is probably EIP-1193 compliant.
  if (ethereum.request) {
    return ethereum.request({ method, params }).then(rpcResult)
  }

  // This is specific to some older versions of MetaMask combined with Web3.js.
  if (ethereum.sendAsync && ethereum.selectedAddress) {
    return new Promise((resolve, reject) => {
      ethereum.sendAsync(
        {
          method,
          params,
          from: ethereum.selectedAddress,
          jsonrpc: '2.0',
          id: 0,
        },
        (err: Error, result: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        }
      )
    }).then(rpcResult)
  }

  // If none of the previous two exist, we assume the provider is pre EIP-1193,
  // using .send() rather than .request().
  if (ethereum.send) {
    return ethereum.send(method, params).then(rpcResult)
  }

  throw new Error(
    'The Ethereum provider doesn’t seem to provide a request method.'
  )
}

export async function getAccountIsContract(
    ethereum: EthereumProvider,
    account: Account
  ): Promise<boolean> {
    try {
      const code = await ethereumRequest(ethereum, 'eth_getCode', [account])
      return code !== '0x'
    } catch (err) {
      return false
    }
  }
  export async function getBlockNumber(ethereum: EthereumProvider) {
    return ethereumRequest(ethereum, 'eth_blockNumber', [])
  }

export function getNetworkName(chainId: number) {
  return KNOWN_CHAINS.get(chainId) || 'Unknown'
}
export function pollEvery<R, T>(
  fn: (
    // As of TS 3.9, it doesn’t seem possible to specify dynamic params
    // as a generic type (e.g. using `T` here). Instead, we have to specify an
    // array in place (`T[]`), making it impossible to type params independently.
    ...params: T[]
  ) => {
    request: () => Promise<R>
    onResult: (result: R) => void
  },
  delay: number
) {
  let timer: any // can be TimeOut (Node) or number (web)
  let stop = false
  const poll = async (
    request: () => Promise<R>,
    onResult: (result: R) => void
  ) => {
    const result = await request()
    if (!stop) {
      onResult(result)
      timer = setTimeout(poll.bind(null, request, onResult), delay)
    }
  }
  return (...params: T[]) => {
    const { request, onResult } = fn(...params)
    stop = false
    poll(request, onResult)
    return () => {
      stop = true
      clearTimeout(timer)
    }
  }
}
function isUnwrappedRpcResult(response: unknown): response is {
  error?: string
  result?: unknown
} {
  return (
    typeof response === 'object' && response !== null && 'jsonrpc' in response
  )
}
export function rpcResult(response: unknown): unknown | null {
  // Some providers don’t wrap the response
  if (isUnwrappedRpcResult(response)) {
    if (response.error) {
      throw new Error(response.error)
    }
    return response.result || null
  }

  return response || null
}
