import { getOwnedSafes } from '@gnosis.pm/safe-react-gateway-sdk'
import { _getChainId, getClientGatewayUrl } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const fetchSafesByOwner = async (ownerAddress: string): Promise<string[]> => {
  return getOwnedSafes(getClientGatewayUrl(), _getChainId(), checksumAddress(ownerAddress)).then(({ safes }) => safes)
}
