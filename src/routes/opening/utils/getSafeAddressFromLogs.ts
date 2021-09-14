import abiDecoder from 'abi-decoder'
import { getProxyFactoryDeployment } from '@gnosis.pm/safe-deployments'
import { Log } from 'web3-core'
import { checksumAddress } from 'src/utils/checksumAddress'

import { LATEST_SAFE_VERSION } from 'src/utils/constants'

// Init abiDecoder with ProxyCreation ABI
abiDecoder.addABI(
  getProxyFactoryDeployment({
    version: LATEST_SAFE_VERSION,
  })?.abi,
)

console.log('LATEST_SAFE_VERSION: ', LATEST_SAFE_VERSION)
console.log(
  'getProxyFactoryDeployment abiDecoder: ',
  getProxyFactoryDeployment({
    version: LATEST_SAFE_VERSION,
  }),
)

export const getNewSafeAddressFromLogs = (logs: Log[]): string => {
  // We find the ProxyCreation event in the logs
  const proxyCreationEvent = abiDecoder.decodeLogs(logs).find(({ name }) => name === 'ProxyCreation')
  console.log('decodeLogs', abiDecoder.decodeLogs(logs))
  // We extract the proxy creation information from the event parameters
  const proxyInformation = proxyCreationEvent?.events?.find(({ name }) => name === 'proxy')
  console.log('proxyInformation:', proxyInformation)
  return checksumAddress(proxyInformation?.value || '')
}
