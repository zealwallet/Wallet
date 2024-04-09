// TODO :: consider to move to Entry Point domain

import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store' // TODO @resetko-zeal will peer dependency work?

import { notReachable } from '@zeal/toolkit/notReachable'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { LS_KEY, SESSION_PASSWORD_KEY } from '@zeal/domains/Storage/constants'

// I'm not sure about this one... but lets see
export const logout = async () => {
    await lock()

    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return AsyncStorage.removeItem(LS_KEY)

        case 'web':
            return chrome.storage.local.remove(LS_KEY)

        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const lock = async () => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return SecureStore.deleteItemAsync(SESSION_PASSWORD_KEY)

        case 'web':
            return chrome.storage.session.remove(SESSION_PASSWORD_KEY)

        default:
            return notReachable(ZealPlatform.OS)
    }
}
