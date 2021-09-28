import devLogo from 'src/config/assets/token_movr.svg'
import {
  EnvironmentSettings,
  ETHEREUM_LAYER,
  ETHEREUM_NETWORK,
  FEATURES,
  NetworkConfig,
  WALLETS,
} from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://gateway.moonriver.multisig.moonbeam.network/v1',
  txServiceUrl: 'https://transaction.moonriver.multisig.moonbeam.network/api/v1',
  safeUrl: 'https://multisig.moonbeam.network/',
  gasPrice: 1e9,
  rpcServiceUrl: 'https://rpc.moonriver.moonbeam.network',
  safeAppsRpcServiceUrl: 'https://rpc.moonriver.moonbeam.network',
  networkExplorerName: 'Blockscout Moonriver MOVR Explorer',
  networkExplorerUrl: 'https://blockscout.moonriver.moonbeam.network',
  networkExplorerApiUrl: 'https://blockscout.moonriver.moonbeam.network/api',
}

const moonriver: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
    },
    staging: {
      ...baseConfig,
    },
    production: {
      ...baseConfig,
    },
  },
  network: {
    id: ETHEREUM_NETWORK.MOONRIVER,
    backgroundColor: ' #F2A007',
    textColor: '#ffffff',
    label: 'Moonriver',
    isTestNet: false,
    ethereumLayer: ETHEREUM_LAYER.L2,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'MOVR',
      symbol: 'MOVR',
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
  ],
  disabledFeatures: [FEATURES.DOMAIN_LOOKUP, FEATURES.SPENDING_LIMIT],
}

export default moonriver
