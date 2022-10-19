import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'

type ChainName = ChainInfo['chainName']
export type ShortName = ChainInfo['shortName']

// Remain agnostic and follow CGW by using the following
export type ChainId = ChainInfo['chainId']

// Only use the following for edge cases
export const CHAIN_ID: Record<ChainName, ChainId> = {
  UNKNOWN: '0',
  ETHEREUM: '1',
  RINKEBY: '4',
  MOONBEAM: '1284',
  MOONRIVER: '1285',
  MOONBASE: '1287',
  GNOSIS_CHAIN: '100',
  GOERLI: '5',
  VOLTA: '73799',
}

// Values match that required of onboard and returned by CGW
export enum WALLETS {
  SAFE_MOBILE = 'safeMobile',
  METAMASK = 'metamask',
  TALLYHO = 'tally',
  WALLET_CONNECT = 'walletConnect',
  TREZOR = 'trezor',
  LEDGER = 'ledger',
  TRUST = 'trust',
  FORTMATIC = 'fortmatic',
  PORTIS = 'portis',
  AUTHEREUM = 'authereum',
  TORUS = 'torus',
  COINBASE = 'coinbase',
  WALLET_LINK = 'walletLink',
  OPERA = 'opera',
  OPERA_TOUCH = 'operaTouch',
  LATTICE = 'lattice',
  KEYSTONE = 'keystone',
}
