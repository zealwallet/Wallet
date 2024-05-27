import memoize from 'memoize-one'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { parse as parseJSON } from '@zeal/toolkit/JSON/index'
import { keys } from '@zeal/toolkit/Object'
import { getOS, getUserAgent } from '@zeal/toolkit/OS'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'
import {
    object,
    oneOf,
    recordStrict,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'
import * as storage from '@zeal/toolkit/Storage'

import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { CustomNetworkMap, NetworkMap } from '@zeal/domains/Network'
import { getPredefinedNetworkMap } from '@zeal/domains/Network/helpers/getPredefinedNetworkMap'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { parse as parsePortfolio } from '@zeal/domains/Portfolio/helpers/parse'
import { Storage } from '@zeal/domains/Storage'
import {
    INSTALL_ID_STORE_KEY,
    LS_KEY,
    PORTFOLIO_MAP_KEY,
    SESSION_PASSWORD_KEY,
} from '@zeal/domains/Storage/constants'
import { parseLocalStorage } from '@zeal/domains/Storage/helpers/fromLocalStorage'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

const getLocalStorage = async (): Promise<Storage | null> => {
    const [portfolioMap, localStorage] = await Promise.all([
        storage.local.getChunked(PORTFOLIO_MAP_KEY),
        storage.local.get(LS_KEY),
    ])

    return (
        shape({
            local: string(localStorage),
            portfolioMap: parsePortfolioMap(portfolioMap),
        })
            .andThen(({ local, portfolioMap }) =>
                parseStorageHelper(local, portfolioMap)
            )
            .getSuccessResult() || null
    )
}

const parsePortfolioMap = memoize(
    (portfolioMap: unknown): Result<unknown, PortfolioMap> =>
        oneOf(portfolioMap, [
            string(portfolioMap)
                .andThen(parseJSON)
                .andThen(object)
                .andThen((json) =>
                    recordStrict(json, {
                        keyParser: parseAddress,
                        valueParser: parsePortfolio,
                    })
                ),

            success({}),
        ])
)

const parseStorageHelper = memoize(
    (local: string, portfolioMap: PortfolioMap): Result<unknown, Storage> =>
        parseJSON(local).andThen((local) =>
            parseLocalStorage(local, portfolioMap)
        )
)

const getInstallationId = async (): Promise<{
    type: 'new_installation' | 'existing_installation'
    installationId: string
}> => {
    const installationId = await storage.local.get(INSTALL_ID_STORE_KEY)

    if (!installationId) {
        const newId = uuid()
        await storage.local.set(INSTALL_ID_STORE_KEY, newId)

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
    const local = await getLocalStorage()

    const sessionPassword = await storage.session.get(SESSION_PASSWORD_KEY)
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

    const predefinedNetworkMap = getPredefinedNetworkMap()
    const storageCustomNetworkMap = local?.customNetworkMap || {}

    const customNetworkMap = keys(storageCustomNetworkMap)
        .filter((hexId) => !predefinedNetworkMap[hexId])
        .reduce((acc, hexId) => {
            acc[hexId] = storageCustomNetworkMap[hexId]
            return acc
        }, {} as CustomNetworkMap)

    const networkMap = {
        ...predefinedNetworkMap,
        ...customNetworkMap,
    }

    return {
        storage: local,
        sessionPassword,
        installationId,
        networkMap,
    }
}
