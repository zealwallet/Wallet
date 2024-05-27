import { PermissionsAndroid } from 'react-native'

import Messaging from '@react-native-firebase/messaging'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { ImperativeError } from '@zeal/domains/Error'

import { NotificationPermission } from '..'
import { parseNotificationPermissions } from '../parseNotificationPermissions'

const nativeFetcher = (): Promise<unknown> => {
    switch (ZealPlatform.OS) {
        case 'ios':
            return Messaging().hasPermission()

        case 'android':
            return PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            )

        case 'web':
            throw new ImperativeError(
                'Push notifications are not yet supported on web'
            )

        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const fetchNotificationPermissions =
    async (): Promise<NotificationPermission> =>
        parseNotificationPermissions(
            await nativeFetcher()
        ).getSuccessResultOrThrow(
            'Unable to parse notification permission status'
        )
