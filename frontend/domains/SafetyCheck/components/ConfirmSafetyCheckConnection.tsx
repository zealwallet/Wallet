import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { ShieldFail } from '@zeal/uikit/Icon/ShieldFail'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ConnectionItem } from '@zeal/domains/SafetyCheck/components/ConnectionItem'

type Props = {
    safetyChecks: ConnectionSafetyCheck[]
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_user_confirmed_connection_with_safety_checks' }
    | { type: 'confirmation_modal_close_clicked' }

export const ConfirmSafetyCheckConnection = ({
    safetyChecks,
    onMsg,
}: Props) => {
    return (
        <Popup.Layout
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'close':
                        onMsg({
                            type: 'confirmation_modal_close_clicked',
                        })
                        break

                    default:
                        notReachable(msg.type)
                }
            }}
        >
            <Header
                icon={({ size }) => (
                    <ShieldFail size={size} color="statusCritical" />
                )}
                title={
                    <FormattedMessage
                        id="connectionSafetyConfirmation.title"
                        defaultMessage="This site looks dangerous"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="connectionSafetyConfirmation.subtitle"
                        defaultMessage="Are you sure you want to continue?"
                    />
                }
            />
            <Popup.Content>
                <Column spacing={12}>
                    {safetyChecks.map((check) => (
                        <ConnectionItem key={check.type} safetyCheck={check} />
                    ))}
                </Column>
            </Popup.Content>
            <Popup.Actions>
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() =>
                        onMsg({
                            type: 'confirmation_modal_close_clicked',
                        })
                    }
                >
                    <FormattedMessage
                        id="connection_state.connect.cancel"
                        defaultMessage="Cancel"
                    />
                </Button>
                <Button
                    variant="secondary"
                    size="regular"
                    onClick={() =>
                        onMsg({
                            type: 'on_user_confirmed_connection_with_safety_checks',
                        })
                    }
                >
                    <FormattedMessage
                        id="connection_state.connect.connect_button"
                        defaultMessage="Connect"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
