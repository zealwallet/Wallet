import { PermissionsAndroid } from 'react-native'

import Messaging from '@react-native-firebase/messaging'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { ImperativeError } from '@zeal/domains/Error'

import { NotificationPermission } from '..'
import { parseNotificationPermissions } from '../parseNotificationPermissions'

const nativeFetcher = async (): Promise<unknown> => {
    switch (ZealPlatform.OS) {
        case 'ios': {
            return Messaging().requestPermission()
        }
        case 'android': {
            // PermissionsAndroid
            return PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            )
        }
        case 'web':
            throw new ImperativeError(
                'Push notifications are not supported on web'
            )
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const requestPushNotificationPermissions =
    async (): Promise<NotificationPermission> =>
        parseNotificationPermissions(
            await nativeFetcher()
        ).getSuccessResultOrThrow('Unable to parse notification permissions')
