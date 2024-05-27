import { DeviceEventEmitter } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { notReachable } from '@zeal/toolkit/notReachable'
import * as String from '@zeal/toolkit/String'

import { keys } from '../Object'
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

const CHUNK_SIZE = 1 * 1024 * 1024 // Taking 1MB size, twice small from 2MB limit, so we don't need to bother with edge cases of decoding UTF8

const getChunkedKeys = async (key: string): Promise<string[]> =>
    (await AsyncStorage.getAllKeys())
        .map((item) => item.match(new RegExp(`^${key}_\\d+$`))?.[0])
        .filter((item): item is string => Boolean(item))

export const setChunked = async (key: string, value: string): Promise<void> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            const chunks: [string, string][] = String.chunk(
                value,
                CHUNK_SIZE
            ).map((chunk, index) => [`${key}_${index}`, chunk])

            const result = await AsyncStorage.multiSet(chunks)
            DeviceEventEmitter.emit('storageChange')
            return result

        case 'web':
            // We do not chunk for web
            return set(key, value)

        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const getChunked = async (key: string): Promise<string | null> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            const keys = await getChunkedKeys(key)
            const result = await AsyncStorage.multiGet(keys)

            return result
                .toSorted(([keyA], [keyB]) => keyA.localeCompare(keyB))
                .map(([, value]) => value)
                .join('')

        case 'web':
            // We do not chunk for web
            return get(key)

        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const remove = async (key: string): Promise<void> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            const result = await AsyncStorage.removeItem(key)
            DeviceEventEmitter.emit('storageChange')
            return result

        case 'web':
            return chrome.storage.local.remove(key)

        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const removeChunked = async (key: string): Promise<void> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            const keys = await getChunkedKeys(key)
            const result = await AsyncStorage.multiRemove(keys)
            DeviceEventEmitter.emit('storageChange')
            return result

        case 'web':
            // We do not chunk for web
            return chrome.storage.local.remove(key)

        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const getAllKeys = async (): Promise<readonly string[]> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return AsyncStorage.getAllKeys()

        case 'web':
            return keys(await chrome.storage.local.get())

        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const removeMany = async (keys: string[]): Promise<void> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            const result = await AsyncStorage.multiRemove(keys)
            DeviceEventEmitter.emit('storageChange')
            return result

        case 'web':
            return chrome.storage.local.remove(keys)

        default:
            return notReachable(ZealPlatform.OS)
    }
}
