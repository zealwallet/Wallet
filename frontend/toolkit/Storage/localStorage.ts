import { DeviceEventEmitter } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { notReachable } from '@zeal/toolkit/notReachable'

import { ZealPlatform } from '../OS/ZealPlatform'

export const get = async (key: string): Promise<string | null> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            try {
                return AsyncStorage.getItem(key)
            } catch (e) {
                return null
            }

        case 'web':
            return chrome.storage.local
                .get(key)
                .then((data) => data[key] || null)

        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const set = async (key: string, value: string): Promise<void> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            const result = await AsyncStorage.setItem(key, value)
            DeviceEventEmitter.emit('storageChange')
            return result

        case 'web':
            return chrome.storage.local.set({ [key]: value })

        default:
            return notReachable(ZealPlatform.OS)
    }
}
