import { useEffect } from 'react'

import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { NotificationPermission } from '@zeal/domains/Notification'
import { registerPushNotifications } from '@zeal/domains/Notification/api/registerPushNotifications'
import { requestPushNotificationPermissions } from '@zeal/domains/Notification/api/requestPushNotificationPermissions'

type Props = {
    notificationPermission: NotificationPermission
    accountsMap: AccountsMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof EnableNotificationsPrompt>,
          { type: 'on_user_enabled_notifications' }
      >

export const CardNotificationsSettings = ({
    notificationPermission,
    accountsMap,
    onMsg,
}: Props) => {
    switch (notificationPermission) {
        case 'granted':
            // https://www.figma.com/design/IWPVfGOlwGyHUnmATmNGSu/Payment%2C-Debit-Card?node-id=1822-52417&t=91XY7ZLFTIlASl3Q-0
            throw new Error(
                `Not implemented ${() =>
                    onMsg({
                        type: 'close',
                    })} or redirect to settings to disable`
            )

        case 'cant_ask_again':
            // https://www.figma.com/design/IWPVfGOlwGyHUnmATmNGSu/Payment%2C-Debit-Card?node-id=1822-52354&t=91XY7ZLFTIlASl3Q-0
            throw new Error(
                `Not implemented ${() =>
                    onMsg({
                        type: 'close',
                    })} or redirect to settings to disable`
            )

        case 'not_granted':
            return (
                <EnableNotificationsPrompt
                    accountsMap={accountsMap}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(notificationPermission)
    }
}

type EnableNotificationsPromptProps = {
    accountsMap: AccountsMap
    onMsg: (msg: EnableNotificationsPromptMsg) => void
}

type EnableNotificationsPromptMsg =
    | { type: 'close' }
    | { type: 'on_user_enabled_notifications' }

const subscribeForNotificationsWithPrompt = async ({
    accountsMap,
}: {
    accountsMap: AccountsMap
}): Promise<void> => {
    // FIXME @resetko-zeal implement
    throw new Error(
        `Not implemented check if we are on mobile,
        prompt user to enable notifications,
        and if we have permissions ${requestPushNotificationPermissions}, then take all
        addresses ${accountsMap},
        take firebase token and send it to the backend ${registerPushNotifications}`
    )
}

export const EnableNotificationsPrompt = ({
    accountsMap,
    onMsg,
}: EnableNotificationsPromptProps) => {
    const [loadable, setLoadable] = useLazyLoadableData(
        subscribeForNotificationsWithPrompt,
        { type: 'not_asked' }
    )

    useEffect(() => {
        // FIXME @resetko-zeal capture error
        // FIXME @resetko-zeal switch over loadable and fire message if error or success
    }, [])

    // FIXME @resetko-zeal analytics https://www.figma.com/design/IWPVfGOlwGyHUnmATmNGSu/Payment%2C-Debit-Card?node-id=1611-58600&t=91XY7ZLFTIlASl3Q-0

    throw new Error(
        `Not implemented layout with cancel ${() =>
            onMsg({
                type: 'close',
            })} and enable which toggles ${loadable} ${setLoadable({
            type: 'loading',
            params: { accountsMap },
        })}`
    )
}
