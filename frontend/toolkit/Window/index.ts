import { openURL } from 'expo-linking'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

export const findRootWindow = (current: Window): Window => {
    if (current.parent === current) {
        return current
    }

    return findRootWindow(current.parent)
}

export const openExternalURL = (url: string) => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            openURL(url)
            break
        case 'web':
            // eslint-disable-next-line no-restricted-syntax
            window.open(url, '_blank')
            break
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}
