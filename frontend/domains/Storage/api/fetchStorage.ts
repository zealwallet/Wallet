import memoize from 'memoize-one'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { parse as parseJSON } from '@zeal/toolkit/JSON/index'
import { getOS, getUserAgent } from '@zeal/toolkit/OS'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'
import { Result, string } from '@zeal/toolkit/Result'
import {
    get as localStorageGet,
    set as localStorageSet,
} from '@zeal/toolkit/Storage/localStorage'
import { get as sessionStorageGet } from '@zeal/toolkit/Storage/sessionStorage'

import { NetworkMap } from '@zeal/domains/Network'
import { getPredefinedNetworkMap } from '@zeal/domains/Network/helpers/getPredefinedNetworkMap'
import { Storage } from '@zeal/domains/Storage'
import { LS_KEY, SESSION_PASSWORD_KEY } from '@zeal/domains/Storage/constants'
import { parseLocalStorage } from '@zeal/domains/Storage/helpers/fromLocalStorage'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

const INSTALL_ID_STORE_KEY = 'installationId'

const getLocalStorage = async (): Promise<Storage | null> =>
    string(await localStorageGet(LS_KEY))
        .andThen(parseStorageHelper)
        .getSuccessResult() || null

const parseStorageHelper = memoize((str: string): Result<unknown, Storage> => {
    return parseJSON(str).andThen(parseLocalStorage)
})

const getInstallationId = async (): Promise<{
    type: 'new_installation' | 'existing_installation'
    installationId: string
}> => {
    const installationId = await localStorageGet(INSTALL_ID_STORE_KEY)

    if (!installationId) {
        const newId = uuid()
        await localStorageSet(INSTALL_ID_STORE_KEY, newId)

        return { type: 'new_installation', installationId: newId }
    }

    return { type: 'existing_installation', installationId }
}

export const fetchStorage = async (): Promise<{
    storage: Storage | null
    sessionPassword: string | null
    installationId: string
    networkMap: NetworkMap
}> => {
    // FIXME :: max-tern remove just a tip how to measure performance on RN
    // const now = performance.now()
    const storage = await getLocalStorage()

    const sessionPassword = await sessionStorageGet(SESSION_PASSWORD_KEY)
    // console.log('takes', performance.now() - now, 'ms')

    const installationIdResult = await getInstallationId()

    const installationId = installationIdResult.installationId

    switch (installationIdResult.type) {
        case 'new_installation': {
            postUserEvent({
                type: 'WalletInstalledEvent',
                installationId,
                os: getOS(),
                userAgent: getUserAgent(),
            })

            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    break
                case 'web':
                    chrome.runtime.setUninstallURL(
                        `https://www.zeal.app/uninstall-survey?i=${installationId}`
                    )
                    break
                default:
                    notReachable(ZealPlatform.OS)
            }
            break
        }
        case 'existing_installation':
            break

        default:
            notReachable(installationIdResult.type)
    }

    const networkMap = {
        ...getPredefinedNetworkMap(),
        ...storage?.customNetworkMap,
    }

    return {
        storage,
        sessionPassword,
        installationId,
        networkMap,
    }
}
