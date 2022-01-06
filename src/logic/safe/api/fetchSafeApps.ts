import { getSafeApps, SafeAppData } from '@gnosis.pm/safe-react-gateway-sdk'
import { _getChainId, getClientGatewayUrl } from 'src/config'

export const fetchSafeAppsList = async (): Promise<SafeAppData[]> => {
  return getSafeApps(getClientGatewayUrl(), _getChainId())
}
