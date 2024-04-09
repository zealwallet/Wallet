import { noop } from '@zeal/toolkit'

import { Manifest } from '@zeal/domains/Manifest'

type Listener = (...args: unknown[]) => unknown

export type ChromeMocks = {
    runtimeOnConnectListeners: Listener[]
    runtimeOnMessageListeners: Listener[]
    storageListeners: Listener[]
    storages: {
        session: Record<string, unknown>
        local: Record<string, unknown>
    }
    manifest: Manifest

    runtimeGetURL: (input: string) => string
}

/**
 * @todo Can be removed with if jest 28+ available for react-scripts, where selective mocking is available (so process.nextTick will not be blocked)
 * @deprecated
 */
const runTimersIfNeeded = () => {
    if (
        typeof jest !== 'undefined' &&
        (setTimeout as any).clock != null &&
        typeof (setTimeout as any).clock.Date === 'function'
    ) {
        jest.runOnlyPendingTimers()
    }
}

const returnAsync = <T>(val: T): Promise<T> =>
    new Promise((resolve) => process.nextTick(() => resolve(val)))

const mocks: ChromeMocks = {
    runtimeOnConnectListeners: [],
    runtimeOnMessageListeners: [],
    storageListeners: [],
    storages: {
        session: {},
        local: {},
    },
    manifest: require('../../../manifest.json'),

    runtimeGetURL: (resource: string) =>
        `chrome-extension://ext-id/${resource}`,
}

Object.assign(global, {
    chrome: {
        runtime: {
            id: 1,
            getManifest: () => mocks.manifest,
            onConnect: {
                addListener: (listener: Listener) => {
                    mocks.runtimeOnConnectListeners.push(listener)
                },
                removeListener: (listener: Listener) => {
                    mocks.runtimeOnConnectListeners =
                        mocks.runtimeOnConnectListeners.filter(
                            (item) => item !== listener
                        )
                },
            },
            onMessage: {
                addListener: (listener: Listener) =>
                    mocks.runtimeOnMessageListeners.push(listener),
                removeListener: (listener: Listener) => {
                    mocks.runtimeOnMessageListeners =
                        mocks.runtimeOnMessageListeners.filter(
                            (item) => item !== listener
                        )
                },
            },
            getURL: mocks.runtimeGetURL,
        },
        storage: {
            session: {
                clear: noop,
                get: (key: string) => {
                    const value = mocks.storages.session[key]
                    const result = returnAsync(value ? { [key]: value } : {})
                    runTimersIfNeeded()
                    return result
                },
                set: async (objectToSet: object) => {
                    mocks.storages.session = {
                        ...mocks.storages.session,
                        ...objectToSet,
                    }
                    process.nextTick(() => {
                        mocks.storageListeners.forEach((listener) => listener())
                    })
                    runTimersIfNeeded()
                },
            },
            local: {
                clear: noop,
                get: (key: string) => {
                    const value = mocks.storages.local[key]
                    const result = returnAsync(value ? { [key]: value } : {})
                    runTimersIfNeeded()
                    return result
                },
                set: async (objectToSet: object) => {
                    mocks.storages.local = {
                        ...mocks.storages.local,
                        ...objectToSet,
                    }

                    mocks.storageListeners.forEach((listener) => listener())

                    runTimersIfNeeded()
                },
            },
            onChanged: {
                addListener: (listener: Listener) =>
                    mocks.storageListeners.push(listener),
                removeListener: (listener: Listener) => {
                    mocks.storageListeners = mocks.storageListeners.filter(
                        (item) => item !== listener
                    )
                },
            },
        },
    },
})

export const clearMocks = () => {
    mocks.storageListeners = []
    mocks.runtimeOnConnectListeners = []
    mocks.manifest = require('../../../manifest.json')
    mocks.storages.session = {}
    mocks.storages.local = {}
}

export const getMocks = (): ChromeMocks => mocks
