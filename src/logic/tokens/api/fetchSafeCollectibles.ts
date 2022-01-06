import { getCollectibles, SafeCollectibleResponse } from '@gnosis.pm/safe-react-gateway-sdk'
import { _getChainId, getClientGatewayUrl } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const fetchSafeCollectibles = async (safeAddress: string): Promise<SafeCollectibleResponse[]> => {
  return getCollectibles(getClientGatewayUrl(), _getChainId(), checksumAddress(safeAddress))
}
