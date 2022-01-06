import devLogo from 'src/config/assets/token_moonbase.svg'
import {
  EnvironmentSettings,
  ETHEREUM_LAYER,
  ETHEREUM_NETWORK,
  SHORT_NAME,
  NetworkConfig,
  WALLETS,
} from 'src/config/networks/network.d'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://gateway.moonbase.multisig.moonbeam.network/v1',
  txServiceUrl: 'https://transaction.moonbase.multisig.moonbeam.network/api/v1',
  gasPrice: 1e9,
  rpcServiceUrl: 'https://rpc.testnet.moonbeam.network',
  safeAppsRpcServiceUrl: 'https://rpc.testnet.moonbeam.network',
  networkExplorerName: 'Blockscout Moonbase DEV Explorer',
  networkExplorerUrl: 'https://moonbase.moonscan.io',
  networkExplorerApiUrl: 'https://api-moonbase.moonscan.io/api',
}

const moonbase: NetworkConfig = {
  environment: {
    local: {
      ...baseConfig,
      clientGatewayUrl: 'http://localhost:8001/v1',
      txServiceUrl: 'http://localhost:8000/api/v1',
    },
    dev: {
      ...baseConfig,
      clientGatewayUrl: 'https://gateway.staging.moonbase.multisig.moonbeam.network/v1',
      txServiceUrl: 'https://transaction.staging.moonbase.multisig.moonbeam.network/api/v1',
    },
    staging: {
      ...baseConfig,
      clientGatewayUrl: 'https://gateway.staging.moonbase.multisig.moonbeam.network/v1',
      txServiceUrl: 'https://transaction.staging.moonbase.multisig.moonbeam.network/api/v1',
    },
    production: {
      ...baseConfig,
    },
  },
  network: {
    id: ETHEREUM_NETWORK.MOONBASE,
    shortName: SHORT_NAME.MOONBASE,
    backgroundColor: '#222B60',
    textColor: '#ffffff',
    label: 'Moonbase',
    ethereumLayer: ETHEREUM_LAYER.L2,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'DEV',
      symbol: 'DEV',
      decimals: 18,
      logoUri: devLogo,
    },
  },
  disabledWallets: [
    WALLETS.TREZOR,
    WALLETS.LEDGER,
    WALLETS.COINBASE,
    WALLETS.FORTMATIC,
    WALLETS.OPERA,
    WALLETS.OPERA_TOUCH,
    WALLETS.TORUS,
    WALLETS.TRUST,
    WALLETS.WALLET_LINK,
    WALLETS.AUTHEREUM,
    WALLETS.LATTICE,
    WALLETS.PORTIS,
    WALLETS.KEYSTONE,
    WALLETS.WALLET_CONNECT,
  ],
  disabledFeatures: [FEATURES.DOMAIN_LOOKUP, FEATURES.SPENDING_LIMIT],
}

export default moonbase
