import { uuid } from '@zeal/toolkit/Crypto'

import { firstSignUp } from '@zeal/domains/Storage/api/fixtures/localStorage'
import { sessionPassword } from '@zeal/domains/Storage/api/fixtures/sessionStorage'
import { LS_KEY } from '@zeal/domains/Storage/constants'

import { ApiMock, getMocks as getApiMocks } from './mocks/api'
import {
    ChromeMocks,
    clearMocks as clearChromeMocks,
    getMocks as getChromeMocks,
} from './mocks/chrome'
import { clearLocationMock, getLocationMock } from './mocks/location'

export type TestEnvironment = {
    chromeMocks: ChromeMocks
    api: ApiMock
}

jest.setTimeout(1000 * 60 * 5)

export const cleanEnv = (env: TestEnvironment) => {
    clearChromeMocks()
    clearLocationMock()
}

export const mockEnv = (): TestEnvironment => {
    const env: TestEnvironment = {
        chromeMocks: getChromeMocks(),
        api: getApiMocks(),
    }

    getLocationMock()

    env.chromeMocks.storages.local[LS_KEY] = JSON.stringify(firstSignUp)
    env.chromeMocks.storages.session['password'] = sessionPassword
    env.chromeMocks.storages.local['installationId'] = uuid()

    return env
}
