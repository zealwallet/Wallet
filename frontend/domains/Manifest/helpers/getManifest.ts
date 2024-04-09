import { nativeApplicationVersion } from 'expo-application'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { Manifest } from '..'

export const getManifest = (): Manifest => {
    const os = ZealPlatform.OS
    switch (os) {
        case 'web':
            return chrome.runtime.getManifest() as Manifest
        case 'ios':
        case 'android':
            return {
                version: nativeApplicationVersion || '',
            }

        /* istanbul ignore next */
        default:
            return notReachable(os)
    }
}
