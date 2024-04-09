import { FormattedMessage, useIntl } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { CustomMetamask } from '@zeal/uikit/Icon/CustomMetamask'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItemButton } from '@zeal/uikit/ListItem/ListItemButton'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { Content as DAppContent } from '@zeal/domains/DApp/components/Content'
import {
    ConnectedToMetaMask,
    Disconnected,
    NotInteracted,
} from '@zeal/domains/DApp/domains/ConnectionState'
import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ConnectionSafetyChecksResponse } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { ConnectionBadge } from '@zeal/domains/SafetyCheck/components/ConnectionBadge'
import { getHighlighting } from '@zeal/domains/SafetyCheck/helpers/getTextHighlighting'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { SafetyChecks } from '../SafetyChecks'

type Props = {
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    alternativeProvider: 'metamask'
    connectionState: NotInteracted | Disconnected | ConnectedToMetaMask
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_safety_checks_click'; safetyChecks: ConnectionSafetyCheck[] }
    | { type: 'on_account_selector_click' }
    | { type: 'on_connect_to_zeal_click' }
    | { type: 'on_continue_with_meta_mask' }

export const Layout = ({
    alternativeProvider,
    connectionState,
    safetyChecksLoadable,
    installationId,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    return (
        <Screen padding="form" background="light">
            <ActionBar
                left={
                    <Text variant="title3" weight="medium" color="textPrimary">
                        <FormattedMessage
                            id="connection_state.connect.expanded.title"
                            defaultMessage="Connect"
                        />
                    </Text>
                }
                right={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <CloseCross size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={12} alignY="stretch">
                <Content
                    footer={
                        <SafetyChecks
                            safetyChecksLoadable={safetyChecksLoadable}
                            onMsg={onMsg}
                        />
                    }
                >
                    <DAppContent
                        highlightHostName={getHighlighting(
                            safetyChecksLoadable
                        )}
                        dApp={connectionState.dApp}
                        avatarBadge={({ size }) => (
                            <ConnectionBadge
                                size={size}
                                safetyChecksLoadable={safetyChecksLoadable}
                            />
                        )}
                    />
                </Content>

                <Column spacing={8}>
                    {(() => {
                        switch (alternativeProvider) {
                            case 'metamask':
                                return (
                                    <ListItemButton
                                        onClick={() => {
                                            onMsg({
                                                type: 'on_account_selector_click',
                                            })
                                        }}
                                        avatar={({ size }) => (
                                            <CustomMetamask size={size} />
                                        )}
                                        primaryText={
                                            <FormattedMessage
                                                id="connection_state.connect.metamask"
                                                defaultMessage="MetaMask"
                                            />
                                        }
                                        side={{
                                            rightIcon: ({ size }) => (
                                                <LightArrowDown2
                                                    size={size}
                                                    color="iconDefault"
                                                />
                                            ),
                                        }}
                                    />
                                )

                            /* istanbul ignore next */
                            default:
                                return notReachable(alternativeProvider)
                        }
                    })()}
                </Column>

                <Actions>
                    <Button
                        variant="warning"
                        size="regular"
                        onClick={() => {
                            postUserEvent({
                                type: 'ConnectionToggledToMetamaskEvent',
                                installationId,
                            })
                            return onMsg({
                                type: 'on_continue_with_meta_mask',
                            })
                        }}
                    >
                        <FormattedMessage
                            id="connection_state.connect.changeToMetamask"
                            defaultMessage="Continue with MetaMask  🦊"
                        />
                    </Button>
                </Actions>

                <Actions>
                    <Button
                        size="regular"
                        variant="secondary"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        <FormattedMessage
                            id="actions.cancel"
                            defaultMessage="Cancel"
                        />
                    </Button>

                    <Button
                        size="regular"
                        variant="primary"
                        aria-label={formatMessage({
                            id: 'connection_state.connect.changeToZeal.label',
                            defaultMessage: 'Change to Zeal',
                        })}
                        onClick={() =>
                            onMsg({ type: 'on_connect_to_zeal_click' })
                        }
                    >
                        <FormattedMessage
                            id="connection_state.connect.changeToZeal"
                            defaultMessage="Change to Zeal"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}
