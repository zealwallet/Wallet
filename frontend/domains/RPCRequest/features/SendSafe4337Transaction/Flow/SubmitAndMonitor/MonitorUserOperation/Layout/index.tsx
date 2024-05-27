import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { SubmittedToBundlerUserOperationRequest } from '@zeal/domains/TransactionRequest'
import {
    SubmittedUserOperation,
    SubmittedUserOperationCompleted,
} from '@zeal/domains/TransactionRequest/domains/SubmittedUserOperation'
import { ContentFooter } from '@zeal/domains/TransactionRequest/domains/SubmittedUserOperation/components/ContentFooter'
import { SuccessSplash } from '@zeal/domains/TransactionRequest/domains/SubmittedUserOperation/features/SuccessSplash'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { SimulatedTransactionContentHeader } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/SimulatedTransactionContentHeader'
import { SimulatedTransactionInfo } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/SimulatedTransactionInfo'

import { Actions } from './Actions'

type Props = {
    userOperationRequest: SubmittedToBundlerUserOperationRequest
    simulation: SimulateTransactionResponse
    submittedUserOperation: SubmittedUserOperation
    accounts: AccountsMap
    installationId: string
    keystores: KeyStoreMap
    networkMap: NetworkMap
    visualState: VisualState
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

export type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg =
    | MsgOf<typeof Actions>
    | MsgOf<typeof ConnectedMinimized>
    | {
          type: 'on_safe_4337_transaction_completed_splash_animation_screen_competed'
          userOperation: SubmittedUserOperationCompleted
      }
    | { type: 'on_minimize_click' }

export const Layout = ({
    userOperationRequest,
    submittedUserOperation,
    simulation,
    accounts,
    installationId,
    keystores,
    networkMap,
    visualState,
    actionSource,
    onMsg,
}: Props) => {
    const { account, network } = userOperationRequest

    switch (visualState.type) {
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
                                id="submitSafeTransaction.monitor.title"
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
                                <SimulatedTransactionContentHeader
                                    dAppInfo={userOperationRequest.dApp}
                                    simulatedTransaction={
                                        simulation.transaction
                                    }
                                />
                            }
                            footer={
                                <ContentFooter
                                    submittedUserOperation={
                                        submittedUserOperation
                                    }
                                    network={network}
                                    networkMap={networkMap}
                                    simulationResult={
                                        userOperationRequest.simulationResult
                                    }
                                    queuedInitialProgress={40}
                                />
                            }
                        >
                            <TransactionInfoSection
                                installationId={installationId}
                                networkMap={networkMap}
                                network={network}
                                accounts={accounts}
                                dApp={userOperationRequest.dApp}
                                keystores={keystores}
                                simulation={simulation}
                                submittedUserOperation={submittedUserOperation}
                                onMsg={onMsg}
                            />
                        </Content>

                        <Actions
                            userOperationRequest={userOperationRequest}
                            submittedUserOperation={submittedUserOperation}
                            onMsg={onMsg}
                        />
                    </Column>
                </Screen>
            )
        default:
            return notReachable(visualState)
    }
}

const TransactionInfoSection = ({
    submittedUserOperation,
    simulation,
    accounts,
    dApp,
    installationId,
    network,
    onMsg,
    keystores,
    networkMap,
}: {
    network: Network
    submittedUserOperation: SubmittedUserOperation
    simulation: SimulateTransactionResponse
    installationId: string
    accounts: AccountsMap
    keystores: KeyStoreMap
    dApp: DAppSiteInfo | null
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}) => {
    switch (submittedUserOperation.state) {
        case 'pending':
        case 'bundled': {
            return (
                <SimulatedTransactionInfo
                    installationId={installationId}
                    networkMap={networkMap}
                    accounts={accounts}
                    dApp={dApp}
                    keystores={keystores}
                    simulation={simulation}
                />
            )
        }

        case 'completed':
            return (
                <SuccessSplash
                    installationId={installationId}
                    network={network}
                    accounts={accounts}
                    keystores={keystores}
                    dApp={dApp}
                    networkMap={networkMap}
                    submittedUserOperation={submittedUserOperation}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_completed_splash_animation_screen_competed':
                                onMsg({
                                    type: 'on_safe_4337_transaction_completed_splash_animation_screen_competed',
                                    userOperation: submittedUserOperation,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                />
            )

        case 'failed':
        case 'rejected':
            return (
                <Content.Splash
                    onAnimationComplete={null}
                    variant="error"
                    title={
                        <FormattedMessage
                            id="submittedTransaction.failed.title"
                            defaultMessage="Transaction failed"
                        />
                    }
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(submittedUserOperation)
    }
}
