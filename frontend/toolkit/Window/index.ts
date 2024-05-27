import { openURL } from 'expo-linking'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { ImperativeError } from '@zeal/domains/Error'

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

export const openNewBrowserTab = (url: string): Window | null => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            throw new ImperativeError(
                'Opening a new browser tab is not supported on mobile'
            )
        case 'web':
            // eslint-disable-next-line no-restricted-syntax
            return window.open(url, '_blank')
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const closeCurrentBrowserTab = () => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            throw new ImperativeError(
                'Closing a new browser tab is not supported on mobile'
            )
        case 'web':
            // eslint-disable-next-line no-restricted-syntax
            window.close()
            break
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}
