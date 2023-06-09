import { AbstractConnector } from '@web3-react/abstract-connector'

export type AccountType = 'contract' | 'normal'

export type Status = 'connected' | 'disconnected' | 'connecting' | 'error'

export type Account = string
export type Balance = string

export type Wallet = {
  account: Account | null
  // balancex: string
  chainId: number
  connect: (connectorId: string) => void
  connector: string | null
  connectors: object
  error: Error | null
  ethereum?: any
  getBlockNumber?: () => number | null
  networkName: string
  reset: () => void
  status: Status
  type: AccountType | null
}

type EthereumProviderEip1193 = {
  request: (args: {
    method: string
    params?: unknown[] | object
  }) => Promise<unknown>
}

type EthereumProviderSend = {
  send: (method: string, params: string[]) => Promise<unknown>
}

type EthereumProviderSendAsync = {
  sendAsync: (
    params: {
      method: string
      params: string[]
      from: string
      jsonrpc: '2.0'
      id: number
    },
    callback: (err: Error, result: unknown) => void
  ) => void
  selectedAddress: string
}

export type EthereumProvider = EthereumProviderEip1193 &
  EthereumProviderSend &
  EthereumProviderSendAsync

export type ConnectorInit = () => Promise<Connector>

export type Connector = {
  // Using `params: any` rather than `params: { chainId: number; [key: string]: any }`:
  // TS 3.9 doesn’t seem to accept `[key: string]: any` as valid to add extra
  // parameters, when using `class implements Connector`. It also rejects any
  // extra parameters added to `{}` or `object` in this case.
  web3ReactConnector: (params: any) => AbstractConnector
  handleActivationError?: (error: Error) => Error | null
}

export type ConnectorConfig = {}


export class UserRejectedRequestError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "The user rejected the request.";
  }
}


export enum account_type{
  from = 1,
  to
}