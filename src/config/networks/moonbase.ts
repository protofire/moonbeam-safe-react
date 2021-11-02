import devLogo from 'src/config/assets/token_moonbase.svg'
import {
  EnvironmentSettings,
  ETHEREUM_LAYER,
  ETHEREUM_NETWORK,
  SHORT_NAME,
  FEATURES,
  NetworkConfig,
  WALLETS,
} from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://gateway.moonbase.multisig.moonbeam.network/v1',
  txServiceUrl: 'https://transaction.moonbase.multisig.moonbeam.network/api/v1',
  gasPrice: 1e9,
  rpcServiceUrl: 'https://rpc.testnet.moonbeam.network',
  safeAppsRpcServiceUrl: 'https://rpc.testnet.moonbeam.network',
  networkExplorerName: 'Blockscout Moonbase DEV Explorer',
  networkExplorerUrl: 'https://moonbase-blockscout.testnet.moonbeam.network',
  networkExplorerApiUrl: 'https://moonbase-blockscout.testnet.moonbeam.network/api',
}

const moonbase: NetworkConfig = {
  environment: {
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
    isTestNet: true,
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
