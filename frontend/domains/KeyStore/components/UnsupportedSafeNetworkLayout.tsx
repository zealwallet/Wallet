import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { ActionSource } from '@zeal/domains/Main'
import { Network } from '@zeal/domains/Network'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'

type Props = {
    installationId: string
    network: Network
    account: Account
    state: VisualState
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg =
    | { type: 'on_minimize_click' }
    | { type: 'on_wrong_network_accepted' }
    | MsgOf<typeof ConnectedMinimized>

export const UnsupportedSafeNetworkLayout = ({
    network,
    account,
    state,
    actionSource,
    installationId,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'minimised':
            return (
                <ConnectedMinimized
                    installationId={installationId}
                    onMsg={onMsg}
                />
            )

        case 'maximised':
            return (
                <Screen
                    background="light"
                    padding="form"
                    onNavigateBack={() => onMsg({ type: 'on_minimize_click' })}
                >
                    <ActionBar
                        title={null}
                        account={account}
                        actionSource={actionSource}
                        network={null}
                        onMsg={onMsg}
                    />

                    <Column spacing={12} fill>
                        <Header
                            title={
                                <FormattedMessage
                                    id="UnsupportedSafeNetworkLayoutk.title"
                                    defaultMessage="Network is not supported for Smart Wallet"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="UnsupportedSafeNetworkLayout.subtitle"
                                    defaultMessage="You can’t make transactions or sign messages on {network} with a Zeal Smart Wallet{br}{br}Switch to a supported network or use a Legacy wallet."
                                    values={{ network: network.name, br: '\n' }}
                                />
                            }
                            icon={({ size }) => (
                                <BoldDangerTriangle
                                    size={size}
                                    color="iconStatusWarning"
                                />
                            )}
                        />

                        <Spacer />

                        <Actions>
                            <Button
                                onClick={() =>
                                    onMsg({ type: 'on_wrong_network_accepted' })
                                }
                                size="regular"
                                variant="primary"
                            >
                                <FormattedMessage
                                    id="sendSafeTransaction.notSupportedNetwork.iUnderstand"
                                    defaultMessage="I understand"
                                />
                            </Button>
                        </Actions>
                    </Column>
                </Screen>
            )
        default:
            return notReachable(state)
    }
}
