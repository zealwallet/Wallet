import Messaging from '@react-native-firebase/messaging'

import { match, number, oneOf, Result, string } from '@zeal/toolkit/Result'

import { NotificationPermission } from '.'

export const parseNotificationPermissions = (
    input: unknown
): Result<unknown, NotificationPermission> =>
    oneOf(input, [
        number(input).andThen((statusValue) =>
            oneOf(statusValue, [
                match(
                    statusValue,
                    Messaging.AuthorizationStatus.NOT_DETERMINED
                ).map(() => 'not_granted' as const),

                match(statusValue, Messaging.AuthorizationStatus.DENIED).map(
                    () => 'cant_ask_again' as const
                ),

                match(statusValue, Messaging.AuthorizationStatus.EPHEMERAL).map(
                    () => 'granted' as const
                ),
                match(
                    statusValue,
                    Messaging.AuthorizationStatus.AUTHORIZED
                ).map(() => 'granted' as const),
                match(
                    statusValue,
                    Messaging.AuthorizationStatus.PROVISIONAL
                ).map(() => 'granted' as const),
            ])
        ),

        string(input).andThen((statusValue) =>
            oneOf(statusValue, [
                match(statusValue, 'granted' as const).map(
                    () => 'granted' as const
                ),
                match(statusValue, 'denied' as const).map(
                    () => 'not_granted' as const
                ),
                match(statusValue, 'never_ask_again' as const).map(
                    () => 'cant_ask_again' as const
                ),
            ])
        ),
    ])
