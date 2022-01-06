import memoize from 'lodash.memoize'

import networks from 'src/config/networks'
import {
  ChainInfo,
  GasPriceFixed,
  GasPriceOracle,
  RpcUri,
  GAS_PRICE_TYPE,
  RPC_AUTHENTICATION,
  FEATURES,
} from '@gnosis.pm/safe-react-gateway-sdk'

import {
  EnvironmentSettings,
  ETHEREUM_NETWORK,
  SHORT_NAME,
  NetworkConfig,
  NetworkInfo,
  NetworkSettings,
  SafeFeatures,
  Wallets,
} from 'src/config/networks/network.d'
import { isValidShortChainName } from 'src/routes/routes'
import {
  APP_ENV,
  ETHERSCAN_API_KEY,
  GOOGLE_ANALYTICS_ID,
  DEFAULT_CHAIN_ID,
  INFURA_TOKEN,
  IS_PRODUCTION,
  NODE_ENV,
  SAFE_APPS_RPC_TOKEN,
  TX_SERVICE_VERSION,
} from 'src/utils/constants'
import { loadFromSessionStorage } from 'src/utils/storage/session'
import { ChainId, ChainName, ShortName } from './chain.d'
import { emptyChainInfo, getChains } from './cache/chains'
import { evalTemplate } from './utils'
import local from 'src/utils/storage/local'
import { ConfigState } from 'src/logic/config/store/reducer/reducer.d'

export const LOCAL_CONFIG_KEY = 'config'

export const getNetworks = (): NetworkInfo[] => {
  // NETWORK_ROOT_ROUTES follows the same destructuring
  const { local: _, ...usefulNetworks } = networks
  return Object.values(usefulNetworks).map((networkObj) => ({
    id: networkObj.network.id,
    shortName: networkObj.network.shortName,
    label: networkObj.network.label,
    backgroundColor: networkObj.network.backgroundColor,
    textColor: networkObj.network.textColor,
  }))
}

export const DEFAULT_NETWORK = IS_PRODUCTION ? ETHEREUM_NETWORK.MOONRIVER : ETHEREUM_NETWORK.MOONBASE

const isNetworkId = (id: unknown): id is ETHEREUM_NETWORK => {
  return Object.values(ETHEREUM_NETWORK).some((network) => network === id)
}

export const NETWORK_ID_KEY = 'SAFE__networkId'
export const getInitialNetworkId = (): ETHEREUM_NETWORK => {
  const { pathname } = window.location

  const network = getNetworks().find(({ shortName }) => {
    return pathname.split('/').some((el) => el.startsWith(`${shortName}:`))
  })

  if (network?.id) {
    return network.id
  }

  const networkId = loadFromSessionStorage(NETWORK_ID_KEY)
  return isNetworkId(networkId) ? networkId : DEFAULT_NETWORK
}

// TODO: Centralise networkId and sessionStorage in store under currentSession.networkId
// May be able to make extraction of the shortName in URL a bit better
let networkId = getInitialNetworkId()

/**
 * Determine the initial chain id
 */
const getInitialChainId = (): ChainId => {
  const localItem = local.getItem<ConfigState>(LOCAL_CONFIG_KEY)
  return localItem?.chainId || DEFAULT_CHAIN_ID
}

export const getChainById = (chainId: ChainId): ChainInfo => {
  return getChains().find((chain) => chain.chainId === chainId) || emptyChainInfo
}

let _chainId = getInitialChainId()

export const _setChainId = (newChainId: ChainId) => {
  _chainId = newChainId
}

export const _getChainId = (): ChainId => {
  return _chainId
}

export const isValidChainId = (chainId: unknown): chainId is ChainId =>
  getChains().some((chain) => chain.chainId === chainId)

export const getChainInfo = (): ChainInfo => {
  return getChainById(_getChainId())
}

export const getChainName = (): ChainName => {
  return getChainInfo().chainName
}

export const getDisabledWallets = (): ChainInfo['disabledWallets'] => {
  return getChainInfo().disabledWallets
}

export const getExplorerUrl = (): string => {
  const { address } = getExplorerUriTemplate()
  return new URL(address).origin
}

const getExplorerUriTemplate = (): ChainInfo['blockExplorerUriTemplate'] => {
  return getChainInfo().blockExplorerUriTemplate
}

export const getFixedGasPrice = (): Extract<ChainInfo['gasPrice'][number], GasPriceFixed> => {
  const isFixed = (gasPrice: ChainInfo['gasPrice'][number]): gasPrice is GasPriceFixed => {
    return gasPrice.type === GAS_PRICE_TYPE.FIXED
  }
  return getChainInfo().gasPrice.filter(isFixed)[0]
}

export const getHashedExplorerUrl = (hash: string): string => {
  const isTx = hash.length > 42
  const param = isTx ? 'txHash' : 'address'
  const uri = getExplorerUriTemplate()[param]
  return evalTemplate(uri, { [param]: hash })
}

// CGW does not return `nativeCurrency.address` as it is `ZERO_ADDRESS`
export const getNativeCurrency = (): ChainInfo['nativeCurrency'] => {
  return getChainInfo().nativeCurrency
}

const formatRpcServiceUrl = ({ authentication, value }: RpcUri, TOKEN: string): string => {
  const needsToken = authentication === RPC_AUTHENTICATION.API_KEY_PATH
  return needsToken ? `${value}${TOKEN}` : value
}

export const getRpcServiceUrl = (): string => {
  const { rpcUri } = getChainInfo()
  return formatRpcServiceUrl(rpcUri, INFURA_TOKEN)
}

export const getPublicRpcUrl = (): string => {
  const { publicRpcUri } = getChainInfo()
  // Don't pass any auth token because this RPC is for user's wallet
  return formatRpcServiceUrl(publicRpcUri, '')
}

/**
 * Checks if a particular feature is enabled in the current network configuration
 * @params {FEATURES} feature
 * @returns boolean
 */
export const isFeatureEnabled = (feature: FEATURES): boolean => {
  const { disabledFeatures } = getConfig()
  return !disabledFeatures?.some((disabledFeature) => disabledFeature === feature)
}

export const getShortName = (): ShortName => {
  return getChainInfo().shortName
}

export const getSafeAppsRpcServiceUrl = (): string => {
  const { safeAppsRpcUri } = getChainInfo()
  return formatRpcServiceUrl(safeAppsRpcUri, SAFE_APPS_RPC_TOKEN)
}

export const getNetworkInfo = (): NetworkSettings => getConfig().network

export const getGasPriceOracles = (): Extract<ChainInfo['gasPrice'][number], GasPriceOracle>[] => {
  const isOracleType = (gasPrice: ChainInfo['gasPrice'][number]): gasPrice is GasPriceOracle => {
    return gasPrice.type === GAS_PRICE_TYPE.ORACLE
  }
  return getChainInfo().gasPrice.filter(isOracleType)
}

const fetchContractABI = memoize(
  async (url: string, contractAddress: string, apiKey?: string) => {
    let params: Record<string, string> = {
      module: 'contract',
      action: 'getAbi',
      address: contractAddress,
    }

    if (apiKey) {
      params = { ...params, apiKey }
    }

    const response = await fetch(`${url}?${new URLSearchParams(params)}`)

    if (!response.ok) {
      return { status: 0, result: [] }
    }

    return response.json()
  },
  (url, contractAddress) => `${url}_${contractAddress}`,
)

export const getNetworkId = (): ETHEREUM_NETWORK => networkId

export const getNetworkName = (networkId: ETHEREUM_NETWORK = getNetworkId()): string => {
  const networkNames = Object.keys(ETHEREUM_NETWORK)
  const name = networkNames.find((networkName) => ETHEREUM_NETWORK[networkName] == networkId)
  return name || ''
}

export const getNetworkConfigById = (id: ETHEREUM_NETWORK): NetworkConfig | undefined => {
  return Object.values(networks).find((cfg) => cfg.network.id === id)
}

// @TODO: Remove after Safe Apps reliance
export const getTxServiceUrl = (): ChainInfo['transactionService'] => {
  const { transactionService } = getChainInfo()
  // To avoid breaking changes, we define the version the web uses manually
  return `${transactionService}/api/v${TX_SERVICE_VERSION}`
}

const getNetworkExplorerApiKey = (networkExplorerName: string): string | undefined => {
  switch (networkExplorerName.toLowerCase()) {
    case 'etherscan': {
      return ETHERSCAN_API_KEY
    }
    default: {
      return undefined
    }
  }
}

export const getNetworkLabel = (id: ETHEREUM_NETWORK = getNetworkId()): string => {
  const cfg = getNetworkConfigById(id)
  return cfg ? cfg.network.label : ''
}

export const usesInfuraRPC = null //[ETHEREUM_NETWORK.RINKEBY].includes(getNetworkId())

export const getCurrentShortChainName = (): SHORT_NAME => getConfig().network.shortName

export const getShortChainNameById = (networkId = getNetworkId()): string =>
  getNetworkConfigById(networkId)?.network?.shortName || getCurrentShortChainName()

export const getNetworkIdByShortChainName = (shortName: string): ETHEREUM_NETWORK => {
  if (!isValidShortChainName(shortName)) return DEFAULT_NETWORK
  return getNetworks().find((network) => network.shortName === shortName)?.id || DEFAULT_NETWORK
}

export const getCurrentEnvironment = (): 'test' | 'local' | 'production' | 'dev' => {
  switch (APP_ENV) {
    case 'test': {
      return 'test'
    }
    case 'local': {
      return 'local'
    }
    case 'production': {
      return 'production'
    }
    case 'dev':
    default: {
      // We need to check NODE_ENV calling jest outside of scripts
      return NODE_ENV === 'test' ? 'test' : 'dev'
    }
  }
}

export type NetworkSpecificConfiguration = EnvironmentSettings & {
  network: NetworkSettings
  disabledFeatures?: SafeFeatures
  disabledWallets?: Wallets
}

// Matches return type of ExplorerInfo from SRC
export const getExplorerInfo = (hash: string): (() => { url: string; alt: string }) => {
  const url = getHashedExplorerUrl(hash)

  const { hostname } = new URL(url)
  const alt = `View on ${hostname}` // Not returned by CGW
  return () => ({ url, alt })
}

export const getConfig = (): NetworkSpecificConfiguration => {
  const currentEnvironment = getCurrentEnvironment()

  // lookup the config file based on the network specified in the NETWORK variable
  const configFile = networks[getNetworkName().toLowerCase()]
  // defaults to 'production' as it's the only environment that is required for the network configs
  const networkBaseConfig = configFile.environment[currentEnvironment] ?? configFile.environment.production

  return {
    ...networkBaseConfig,
    network: configFile.network,
    disabledFeatures: configFile.disabledFeatures,
    disabledWallets: configFile.disabledWallets,
  }
}

export const getClientGatewayUrl = (): string => getConfig().clientGatewayUrl

const getExplorerApiKey = (apiUrl: string): string | undefined => {
  return apiUrl.includes('etherscan') && ETHERSCAN_API_KEY ? ETHERSCAN_API_KEY : undefined
}

const fetchContractAbi = async (contractAddress: string) => {
  const apiUri = getExplorerUriTemplate().api
  const apiKey = getExplorerApiKey(apiUri)

  const params = {
    module: 'contract',
    action: 'getAbi',
    address: contractAddress,
    ...(apiKey && { apiKey }),
  }

  const finalUrl = evalTemplate(apiUri, params)

  const response = await fetch(finalUrl)

  if (!response.ok) {
    return { status: 0, result: [] }
  }
}

const getNetworkExplorerInfo = (): { name: string; url: string; apiUrl: string } => {
  const cfg = getConfig()
  return {
    name: cfg.networkExplorerName,
    url: cfg.networkExplorerUrl,
    apiUrl: cfg.networkExplorerApiUrl,
  }
}

export const getContractABI = async (contractAddress: string) => {
  const { apiUrl, name } = getNetworkExplorerInfo()

  const apiKey = getNetworkExplorerApiKey(name)

  try {
    const { result, status } = await fetchContractABI(apiUrl, contractAddress, apiKey)

    if (status === '0') {
      return []
    }

    return result
  } catch (e) {
    console.error('Failed to retrieve ABI', e)
    return undefined
  }
}

export type BlockScanInfo = () => {
  alt: string
  url: string
}
