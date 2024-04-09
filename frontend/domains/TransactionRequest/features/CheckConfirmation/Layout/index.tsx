import { FormattedMessage } from 'react-intl'

import { components } from '@zeal/api/portfolio'

import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { Submited } from '@zeal/domains/TransactionRequest'
import { TransactionHeader } from '@zeal/domains/TransactionRequest/components/TransactionHeader'
import {
    SubmitedTransaction,
    SubmitedTransactionCompleted,
} from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { ContentFooter } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/components/ContentFooter'
import { SuccessSplash } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/features/SuccessSplash'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { SimulatedTransactionInfo } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/SimulatedTransactionInfo'

import { Actions, Msg as ActionsMsg } from './Actions'

type Props = {
    transactionRequest: Submited
    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    installationId: string
    source: components['schemas']['TransactionEventSource']
    state: State
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

export type Msg =
    | ActionsMsg
    | MsgOf<typeof ConnectedMinimized>
    | {
          type: 'on_transaction_completed_splash_animation_screen_competed'
          transactionRequest: Submited
          transaction: SubmitedTransactionCompleted
      }
    | { type: 'on_minimize_click' }

export type State = { type: 'minimised' } | { type: 'maximised' }

export const Layout = ({
    transactionRequest,
    state,
    accounts,
    keystores,
    networkMap,
    networkRPCMap,
    actionSource,
    onMsg,
    source,
    installationId,
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
                                id="checkConfirmation.title"
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
                                <ContentFooter
                                    simulationResult={
                                        transactionRequest.simulation
                                    }
                                    submitedTransaction={
                                        transactionRequest.submitedTransaction
                                    }
                                    networkRPCMap={networkRPCMap}
                                    networkMap={networkMap}
                                    network={network}
                                    queuedInitialProgress={10}
                                />
                            }
                        >
                            <TransactionInfoSection
                                installationId={installationId}
                                networkMap={networkMap}
                                network={network}
                                accounts={accounts}
                                dApp={transactionRequest.dApp}
                                keystores={keystores}
                                transactionRequest={transactionRequest}
                                simulationResult={transactionRequest.simulation}
                                submitedTransaction={
                                    transactionRequest.submitedTransaction
                                }
                                onMsg={onMsg}
                            />
                        </Content>

                        <Actions
                            source={source}
                            keyStore={getKeyStore({
                                keyStoreMap: keystores,
                                address: transactionRequest.account.address,
                            })}
                            installationId={installationId}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
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

const TransactionInfoSection = ({
    submitedTransaction,
    simulationResult,
    transactionRequest,
    accounts,
    dApp,
    keystores,
    installationId,
    network,
    networkMap,
    onMsg,
}: {
    transactionRequest: Submited
    network: Network
    submitedTransaction: SubmitedTransaction
    installationId: string
    simulationResult: SimulationResult
    accounts: AccountsMap
    keystores: KeyStoreMap
    dApp: DAppSiteInfo | null
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}) => {
    switch (submitedTransaction.state) {
        case 'queued':
        case 'included_in_block':
        case 'replaced': {
            switch (simulationResult.type) {
                case 'simulated':
                    return (
                        <SimulatedTransactionInfo
                            installationId={installationId}
                            networkMap={networkMap}
                            accounts={accounts}
                            dApp={dApp}
                            keystores={keystores}
                            simulation={simulationResult.simulation}
                        />
                    )

                case 'failed':
                case 'not_supported':
                    return (
                        <Content.Splash
                            onAnimationComplete={null}
                            variant="spinner"
                            title={
                                <FormattedMessage
                                    id="CheckConfirmation.InProgress"
                                    defaultMessage="In progress..."
                                />
                            }
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(simulationResult)
            }
        }

        case 'completed':
            return (
                <SuccessSplash
                    installationId={installationId}
                    networkMap={networkMap}
                    accounts={accounts}
                    dApp={dApp}
                    keystores={keystores}
                    network={network}
                    submitedTransaction={submitedTransaction}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_completed_splash_animation_screen_competed':
                                onMsg({
                                    type: 'on_transaction_completed_splash_animation_screen_competed',
                                    transaction: submitedTransaction,
                                    transactionRequest,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                notReachable(msg.type)
                        }
                    }}
                />
            )

        case 'failed':
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
            return notReachable(submitedTransaction)
    }
}
