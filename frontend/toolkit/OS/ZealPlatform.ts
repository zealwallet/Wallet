import { Platform } from 'react-native'

import { notReachable } from '@zeal/toolkit'

import { ImperativeError } from '@zeal/domains/Error'

export type ZealPlatform = { OS: 'ios' | 'android' | 'web' }

export const ZealPlatform: ZealPlatform = ((): ZealPlatform => {
    switch (Platform.OS) {
        case 'android':
        case 'ios':
        case 'web':
            return Platform
        case 'windows':
        case 'macos':
            throw new ImperativeError('Platform not supported', {
                platformOS: Platform.OS,
            })
        /* istanbul ignore next */
        default:
            return notReachable(Platform)
    }
})()
