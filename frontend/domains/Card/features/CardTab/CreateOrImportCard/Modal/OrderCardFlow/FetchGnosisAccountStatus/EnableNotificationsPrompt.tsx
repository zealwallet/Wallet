import { useEffect } from 'react'

import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { keys } from '@zeal/toolkit/Object'

import { AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { registerPushNotifications } from '@zeal/domains/Notification/api/registerPushNotifications'
import { requestPushNotificationPermissions } from '@zeal/domains/Notification/api/requestPushNotificationPermissions'

type Props = {
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_user_skipped_notifications' }
    | { type: 'on_user_enabled_notifications' }

const subscribeForNotificationsWithPrompt = async ({
    accountsMap,
    keyStoreMap,
}: {
    keyStoreMap: KeyStoreMap
    accountsMap: AccountsMap
}): Promise<void> => {
    // FIXME @resetko-zeal implement
    throw new Error(
        `Not implemented check if we are on mobile,
        prompt user to enable notifications,
        and if we have permissions ${requestPushNotificationPermissions}, then take all
        addresses ${accountsMap} with signing keystore ${keys(keyStoreMap)},
        take firebase token and send it to the backend ${registerPushNotifications}`
    )
}

export const EnableNotificationsPrompt = ({
    accountsMap,
    keyStoreMap,
    onMsg,
}: Props) => {
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
        `Not implemented layout with skip ${() =>
            onMsg({
                type: 'on_user_skipped_notifications',
            })} and enable which toggles ${loadable} ${setLoadable({
            type: 'loading',
            params: { accountsMap, keyStoreMap },
        })}`
    )
}
