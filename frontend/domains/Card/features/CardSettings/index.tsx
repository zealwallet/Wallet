import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { AccountsMap } from '@zeal/domains/Account'
import { GnosisPayAccountOnboardedState } from '@zeal/domains/Card'
import { fetchNotificationPermissions } from '@zeal/domains/Notification/api/fetchNotificationPermissions'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    onMsg: (msg: Msg) => void
    accountsMap: AccountsMap
    gnosisPayAccountOnboardedState: GnosisPayAccountOnboardedState
    encryptedPassword: string
}

type Msg = { type: 'close' }

export const CardSettings = ({
    gnosisPayAccountOnboardedState,
    encryptedPassword,
    accountsMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })
    const [
        notificationsPermissionsLoadable,
        setNotificationsPermissionsLoadable,
    ] = useLoadableData(fetchNotificationPermissions, {
        type: 'loading',
        params: undefined,
    })

    return (
        <>
            <Layout
                notificationPermissionLoadable={
                    notificationsPermissionsLoadable
                }
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg({ type: 'close' })
                            break
                        case 'on_card_reveal_pin_clicked':
                            setState({ type: 'view_pin' })
                            break
                        case 'on_card_notifications_toggle_clicked':
                            setState({
                                type: 'card_notifications_settings',
                                notificationPermission:
                                    msg.notificationPermission,
                            })
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                accountsMap={accountsMap}
                state={state}
                gnosisPayAccountOnboardedState={gnosisPayAccountOnboardedState}
                encryptedPassword={encryptedPassword}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break

                        case 'on_user_enabled_notifications':
                            setNotificationsPermissionsLoadable({
                                type: 'loading',
                                params: undefined,
                            })
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
