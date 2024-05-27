import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { GnosisPayIcon } from '@zeal/uikit/Icon/GnosisPayIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { openGnosisPaySignup } from '@zeal/domains/Card/helpers/openGnosisPaySignup'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { fetchNotificationPermissions } from '@zeal/domains/Notification/api/fetchNotificationPermissions'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { EnableNotificationsPrompt } from '../EnableNotificationsPrompt'

type Props = {
    account: Account
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_order_new_card_gnosis_pay_click'; address: Address }

export const OrderNewCard = ({
    onMsg,
    account,
    accountsMap,
    keyStoreMap,
    installationId,
}: Props) => {
    const [loadable] = useLoadableData(fetchNotificationPermissions, {
        type: 'loading',
        params: undefined,
    })

    useEffect(() => {
        // FIXME @resetko-zeal reporting
    }, [])

    switch (loadable.type) {
        case 'loading':
            // FIXME @resetko-zeal check if it looks good
            return null

        case 'loaded': {
            switch (loadable.data) {
                case 'granted':
                case 'cant_ask_again':
                    return (
                        <Layout
                            installationId={installationId}
                            account={account}
                            onMsg={onMsg}
                        />
                    )
                case 'not_granted':
                    return (
                        <Flow
                            installationId={installationId}
                            account={account}
                            accountsMap={accountsMap}
                            keyStoreMap={keyStoreMap}
                            onMsg={onMsg}
                        />
                    )

                default:
                    return notReachable(loadable.data)
            }
        }

        case 'error':
            return (
                <Layout
                    installationId={installationId}
                    account={account}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(loadable)
    }
}

type State =
    | { type: 'prompt_for_notifaction_permissions' }
    | { type: 'order_new_card' }

const Flow = ({
    account,
    onMsg,
    accountsMap,
    keyStoreMap,
    installationId,
}: {
    account: Account
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    installationId: string
    onMsg: (msg: MsgOf<typeof Layout>) => void
}) => {
    const [state, setState] = useState<State>({
        type: 'prompt_for_notifaction_permissions',
    })

    switch (state.type) {
        case 'prompt_for_notifaction_permissions':
            return (
                <EnableNotificationsPrompt
                    accountsMap={accountsMap}
                    keyStoreMap={keyStoreMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_user_skipped_notifications':
                            case 'on_user_enabled_notifications':
                                setState({ type: 'order_new_card' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'order_new_card':
            return (
                <Layout
                    installationId={installationId}
                    account={account}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(state)
    }
}

const Layout = ({
    onMsg,
    account,
    installationId,
}: {
    account: Account
    installationId: string
    onMsg: (msg: Msg) => void
}) => {
    useEffect(() => {
        postUserEvent({
            installationId: installationId,
            type: 'GnosisHomepageEnteredEvent',
        })
    }, [installationId])

    return (
        <Screen padding="form" background="light" onNavigateBack={noop}>
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />
            <Column spacing={0} fill>
                <Header
                    title={
                        <FormattedMessage
                            id="cards.order-new.layout.header"
                            defaultMessage="Order a new card with our partner Gnosis"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="cards.order-new.layout.subtite"
                            defaultMessage="You order and set up your Visa card on Gnosis Pay’s homepage. You will then be able to see your card and activity inside Zeal."
                        />
                    }
                    icon={({ size }) => <GnosisPayIcon size={size} />}
                />
            </Column>
            <Actions>
                <Button
                    variant="secondary"
                    size="regular"
                    onClick={() => {
                        onMsg({ type: 'close' })
                    }}
                >
                    <FormattedMessage
                        defaultMessage="Cancel"
                        id="cards.order-new.layout.cta.secondary"
                    />
                </Button>
                <Button
                    variant="primary"
                    size="regular"
                    onClick={() => {
                        openGnosisPaySignup()
                        onMsg({
                            type: 'on_order_new_card_gnosis_pay_click',
                            address: account.address,
                        })
                    }}
                >
                    <Row spacing={6}>
                        <Text>
                            <FormattedMessage
                                defaultMessage="Gnosis Pay"
                                id="cards.order-new.layout.cta.primary"
                            />
                        </Text>
                        <ExternalLink size={20} />
                    </Row>
                </Button>
            </Actions>
        </Screen>
    )
}
