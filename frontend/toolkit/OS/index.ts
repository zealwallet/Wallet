import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

export type OS =
    | 'Windows'
    | 'MacOS'
    | 'Unix'
    | 'Linux'
    | 'Android'
    | 'iOS'
    | 'Unknown'

export const getUserAgent = (): string => {
    switch (ZealPlatform.OS) {
        case 'ios':
            return 'iOS'
        case 'android':
            return 'Android'
        case 'web':
            return navigator.userAgent
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const getOS = (): OS => {
    switch (ZealPlatform.OS) {
        case 'ios':
            return 'iOS'
        case 'android':
            return 'Android'
        case 'web':
            switch (true) {
                case navigator.userAgent.indexOf('Win') !== -1:
                    return 'Windows'
                case navigator.userAgent.indexOf('Mac') !== -1:
                    return 'MacOS'
                case navigator.userAgent.indexOf('Linux') !== -1:
                    return 'Linux'
                case navigator.userAgent.indexOf('Android') !== -1:
                    return 'Android'

                case navigator.userAgent.indexOf('like Mac') !== -1:
                    return 'iOS'
                default:
                    return 'Unknown'
            }
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}
