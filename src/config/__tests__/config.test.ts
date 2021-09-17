import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { default as networks } from 'src/config/networks'

const { moonbase, moonriver } = networks

describe('Config Services', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it(`should load 'test' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: 'test',
    }))
    const { getNetworkInfo } = require('src/config')

    // When
    const networkInfo = getNetworkInfo()

    // Then
    expect(networkInfo.id).toBe(ETHEREUM_NETWORK.LOCAL)
  })

  it(`should load 'moonriver' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: '',
      NETWORK: 'MOONRIVER',
    }))
    const { getNetworkInfo } = require('src/config')

    // When
    const networkInfo = getNetworkInfo()

    // Then
    expect(networkInfo.id).toBe(ETHEREUM_NETWORK.MOONRIVER)
  })

  it(`should load 'moonriver.dev' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: '',
      NETWORK: 'MOONRIVER',
    }))
    const { getTxServiceUrl, getGnosisSafeAppsUrl } = require('src/config')
    const TX_SERVICE_URL = moonriver.environment.dev?.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })

  it(`should load 'moonriver.staging' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: 'production',
      NETWORK: 'MOONRIVER',
    }))
    const { getTxServiceUrl } = require('src/config')
    const TX_SERVICE_URL = moonriver.environment.staging?.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })

  it(`should load 'moonriver.production' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: 'production',
      NETWORK: 'MOONRIVER',
      APP_ENV: 'production',
    }))
    const { getTxServiceUrl, getGnosisSafeAppsUrl } = require('src/config')
    const TX_SERVICE_URL = moonriver.environment.production.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })

  it(`should load 'moonbase.production' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: 'production',
      NETWORK: 'MOONBASE',
      APP_ENV: 'production',
    }))
    const { getTxServiceUrl, getGnosisSafeAppsUrl } = require('src/config')
    const TX_SERVICE_URL = moonbase.environment.production.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()
    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })

  it(`should default to 'moonbase.dev' network config if no environment is found`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: '',
      NETWORK: 'MOONBASE',
    }))
    const { getTxServiceUrl, getGnosisSafeAppsUrl } = require('src/config')
    const TX_SERVICE_URL = moonbase.environment.dev?.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })
})
