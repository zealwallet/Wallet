import { DeviceEventEmitter } from 'react-native'

import { notReachable } from '@zeal/toolkit/notReachable'

import { ZealPlatform } from '../OS/ZealPlatform'

const nativeSessionStorage: Record<string, string> = {}

export const get = async (key: string): Promise<string | null> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return nativeSessionStorage[key] || null

        case 'web': {
            return chrome.storage.session
                .get(key)
                .then((data) => data[key] || null)
        }

        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const set = async ({
    key,
    value,
}: {
    key: string
    value: string
}): Promise<void> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            nativeSessionStorage[key] = value
            DeviceEventEmitter.emit('storageChange')
            return

        case 'web': {
            return chrome.storage.session.set({ [key]: value })
        }

        default:
            return notReachable(ZealPlatform.OS)
    }
}
