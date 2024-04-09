import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Progress } from '@zeal/uikit/Progress'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { Simulated } from '@zeal/domains/TransactionRequest'
import { TransactionHeader } from '@zeal/domains/TransactionRequest/components/TransactionHeader'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'

type Props = {
    installationId: string
    transactionRequest: Simulated
    networkMap: NetworkMap
    state: State
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_minimize_click' }
    | MsgOf<typeof ConnectedMinimized>

export type State = { type: 'minimised' } | { type: 'maximised' }

export const Layout = ({
    transactionRequest,
    onMsg,
    state,
    networkMap,
    installationId,
    actionSource,
}: Props) => {
    const { account } = transactionRequest
    const network = findNetworkByHexChainId(
        transactionRequest.networkHexId,
        networkMap
    )

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
                <Screen background="light" padding="form">
                    <ActionBar
                        title={
                            <FormattedMessage
                                id="submitTransaction.sign.title"
                                defaultMessage="Transaction preview"
                            />
                        }
                        account={account}
                        network={network}
                        actionSource={actionSource}
                        onMsg={onMsg}
                    />

                    <Column spacing={12} alignY="stretch">
                        <Content
                            header={
                                <TransactionHeader
                                    networkMap={networkMap}
                                    transactionRequest={transactionRequest}
                                    simulationResult={
                                        transactionRequest.simulation
                                    }
                                />
                            }
                            footer={
                                <Progress
                                    title={
                                        <FormattedMessage
                                            id="submitTransaction.state.sendingToNetwork"
                                            defaultMessage="Sending to network"
                                        />
                                    }
                                    variant="neutral"
                                    initialProgress={0}
                                    progress={10}
                                />
                            }
                        >
                            <Content.Splash
                                onAnimationComplete={null}
                                variant="paper-plane"
                                title={
                                    <FormattedMessage
                                        id="submitTransaction.state.sendingToNetwork"
                                        defaultMessage="Sending to network"
                                    />
                                }
                            />
                        </Content>

                        <Actions>
                            <Button size="regular" variant="secondary" disabled>
                                <FormattedMessage
                                    id="submitTransaction.stop"
                                    defaultMessage="Stop"
                                />
                            </Button>

                            <Button size="regular" variant="secondary" disabled>
                                <FormattedMessage
                                    id="submitTransaction.speedUp"
                                    defaultMessage="Speed up"
                                />
                            </Button>
                        </Actions>
                    </Column>
                </Screen>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
