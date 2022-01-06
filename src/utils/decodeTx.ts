import { getDecodedData, DecodedDataResponse } from '@gnosis.pm/safe-react-gateway-sdk'
import { _getChainId, getClientGatewayUrl } from 'src/config'

export const fetchTxDecoder = async (encodedData: string): Promise<DecodedDataResponse | null> => {
  if (!encodedData?.length || encodedData === '0x') {
    return null
  }

  try {
    return await getDecodedData(getClientGatewayUrl(), _getChainId(), encodedData)
  } catch (error) {
    return null
  }
}
