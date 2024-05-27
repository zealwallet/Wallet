import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { CancelSubmited } from '@zeal/domains/TransactionRequest'
import { TransactionHeader } from '@zeal/domains/TransactionRequest/components/TransactionHeader'
import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'

import { Actions } from './Actions'
import { CancelProgressStatusBar } from './CancelProgressStatusBar'

type Props = {
    installationId: string
    transactionRequest: CancelSubmited
    state: State
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
    actionSource: ActionSource
}

export type Msg =
    | MsgOf<typeof Actions>
    | MsgOf<typeof ConnectedMinimized>
    | { type: 'on_minimize_click' }

export type State = { type: 'minimised' } | { type: 'maximised' }

export const Layout = ({
    transactionRequest,
    state,
    networkMap,
    networkRPCMap,
    actionSource,
    installationId,
    onMsg,
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
                <Screen
                    background="light"
                    padding="form"
                    onNavigateBack={() => onMsg({ type: 'on_minimize_click' })}
                >
                    <ActionBar
                        title={
                            <FormattedMessage
                                id="submitTransaction.cancel.title"
                                defaultMessage="Transaction preview"
                            />
                        }
                        account={account}
                        network={network}
                        actionSource={actionSource}
                        onMsg={onMsg}
                    />

                    <Column spacing={12} fill>
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
                                <CancelProgressStatusBar
                                    submitedTransaction={
                                        transactionRequest.cancelSubmitedTransaction
                                    }
                                    network={network}
                                    networkRPCMap={networkRPCMap}
                                />
                            }
                        >
                            <ContentLayout
                                submitedCancelTransaction={
                                    transactionRequest.cancelSubmitedTransaction
                                }
                            />
                        </Content>

                        <Actions
                            networkMap={networkMap}
                            transactionRequest={transactionRequest}
                            onMsg={onMsg}
                        />
                    </Column>
                </Screen>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

const ContentLayout = ({
    submitedCancelTransaction,
}: {
    submitedCancelTransaction: SubmitedTransaction
}) => {
    switch (submitedCancelTransaction.state) {
        case 'queued':
        case 'included_in_block':
        case 'replaced':
            return (
                <Content.Splash
                    onAnimationComplete={null}
                    variant="spinner"
                    title={
                        <FormattedMessage
                            id="submitTransaction.cancel.attemptingToStop"
                            defaultMessage="Attempting to stop"
                        />
                    }
                />
            )

        case 'completed':
            return (
                <Content.Splash
                    onAnimationComplete={null}
                    variant="success"
                    title={
                        <FormattedMessage
                            id="submitTransaction.cancel.stopped"
                            defaultMessage="Stopped"
                        />
                    }
                />
            )

        case 'failed':
            return (
                <Content.Splash
                    onAnimationComplete={null}
                    variant="error"
                    title={
                        <FormattedMessage
                            id="submitTransaction.cancel.failedToStop"
                            defaultMessage="Failed to stop"
                        />
                    }
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(submitedCancelTransaction)
    }
}
