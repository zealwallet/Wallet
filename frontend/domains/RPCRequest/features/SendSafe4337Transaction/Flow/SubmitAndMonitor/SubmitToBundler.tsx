import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { components } from '@zeal/api/portfolio'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Group } from '@zeal/uikit/Group'
import { Progress } from '@zeal/uikit/Progress'
import { Screen } from '@zeal/uikit/Screen'
import { Spinner } from '@zeal/uikit/Spinner'
import { Text } from '@zeal/uikit/Text'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap, Safe4337 } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap } from '@zeal/domains/Network'
import { ListItem } from '@zeal/domains/SmartContract/components/ListItem'
import {
    SignedUserOperationRequest,
    SubmittedToBundlerUserOperationRequest,
} from '@zeal/domains/TransactionRequest'
import { submitUserOperationRequest } from '@zeal/domains/TransactionRequest/api/submitUserOperationRequest'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { SimulatedTransactionContentHeader } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/SimulatedTransactionContentHeader'
import { keystoreToUserEventType } from '@zeal/domains/UserEvents'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { SafeTransactionInfo } from '../SafeTransactionInfo'

type Props = {
    userOperationRequest: SignedUserOperationRequest
    simulation: SimulateTransactionResponse
    keyStore: Safe4337
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    installationId: string
    source: components['schemas']['TransactionEventSource']
    visualState: VisualState
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

export type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg =
    | MsgOf<typeof ConnectedMinimized>
    | { type: 'on_minimize_click' }
    | { type: 'on_close_bundler_submission_error_popup' }
    | {
          type: 'on_user_operation_submitted_to_bundler'
          userOperationRequest: SubmittedToBundlerUserOperationRequest
      }

export const SubmitToBundler = ({
    userOperationRequest,
    simulation,
    accountsMap,
    keyStore,
    keyStoreMap,
    networkMap,
    installationId,
    source,
    visualState,
    actionSource,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(
        submitUserOperationRequest,
        {
            type: 'loading',
            params: { userOperationRequest },
        }
    )

    const onMsgLive = useLiveRef(onMsg)
    const keystoreLive = useLiveRef(keyStore)
    const userOperationRequestLive = useLiveRef(userOperationRequest)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'error':
                break
            case 'loaded':
                postUserEvent({
                    type: 'TransactionSubmittedEvent',
                    keystoreType: keystoreToUserEventType(keystoreLive.current),
                    installationId,
                    network:
                        userOperationRequestLive.current.network.hexChainId,
                    source,
                    keystoreId: keystoreLive.current.id,
                })

                onMsgLive.current({
                    type: 'on_user_operation_submitted_to_bundler',
                    userOperationRequest: loadable.data,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [
        installationId,
        keystoreLive,
        loadable,
        onMsgLive,
        source,
        userOperationRequestLive,
    ])

    switch (loadable.type) {
        case 'loading':
        case 'loaded':
            return (
                <Layout
                    installationId={installationId}
                    simulation={simulation}
                    accountsMap={accountsMap}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    userOperationRequest={userOperationRequest}
                    visualState={visualState}
                    actionSource={actionSource}
                    onMsg={onMsg}
                />
            )

        case 'error':
            return (
                <>
                    <Layout
                        installationId={installationId}
                        simulation={simulation}
                        accountsMap={accountsMap}
                        keyStoreMap={keyStoreMap}
                        networkMap={networkMap}
                        userOperationRequest={userOperationRequest}
                        visualState={visualState}
                        actionSource={actionSource}
                        onMsg={onMsg}
                    />

                    <AppErrorPopup
                        error={parseAppError(loadable.error)}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg({
                                        type: 'on_close_bundler_submission_error_popup',
                                    })
                                    break
                                case 'try_again_clicked':
                                    setLoadable({
                                        type: 'loading',
                                        params: loadable.params,
                                    })
                                    break

                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </>
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}

type LayoutProps = {
    userOperationRequest: SignedUserOperationRequest
    installationId: string
    simulation: SimulateTransactionResponse
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    visualState: VisualState
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

const Layout = ({
    userOperationRequest,
    simulation,
    onMsg,
    accountsMap,
    keyStoreMap,
    networkMap,
    visualState,
    actionSource,
    installationId,
}: LayoutProps) => {
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
                                id="submitSafeTransaction.submittingToRelayer.title"
                                defaultMessage="Transaction preview"
                            />
                        }
                        account={userOperationRequest.account}
                        network={userOperationRequest.network}
                        actionSource={actionSource}
                        onMsg={onMsg}
                    />
                    <Column spacing={12} alignY="stretch">
                        <Content
                            header={
                                <SimulatedTransactionContentHeader
                                    simulatedTransaction={
                                        simulation.transaction
                                    }
                                    dAppInfo={userOperationRequest.dApp}
                                />
                            }
                            footer={
                                <Footer
                                    userOperationRequest={userOperationRequest}
                                    networkMap={networkMap}
                                />
                            }
                        >
                            <SafeTransactionInfo
                                installationId={installationId}
                                simulation={simulation}
                                dApp={userOperationRequest.dApp}
                                accounts={accountsMap}
                                keyStores={keyStoreMap}
                                networkMap={networkMap}
                            />
                        </Content>

                        <Actions>
                            <Button size="regular" variant="secondary" disabled>
                                <FormattedMessage
                                    id="submitTransaction.cancel"
                                    defaultMessage="Cancel"
                                />
                            </Button>

                            <Button size="regular" variant="secondary" disabled>
                                <FormattedMessage
                                    id="submitTransaction.submit"
                                    defaultMessage="Submit"
                                />
                            </Button>
                        </Actions>
                    </Column>
                </Screen>
            )
        default:
            return notReachable(visualState)
    }
}

const Footer = ({
    userOperationRequest,
    networkMap,
}: {
    userOperationRequest: Props['userOperationRequest']
    networkMap: Props['networkMap']
}) => {
    const { simulationResult } = userOperationRequest
    switch (simulationResult.type) {
        case 'failed':
        case 'not_supported':
            return (
                <Progress
                    title={
                        <FormattedMessage
                            id="submitSafeTransaction.state.sign"
                            defaultMessage="Sending"
                        />
                    }
                    variant="neutral"
                    initialProgress={20}
                    progress={40}
                    right={<Spinner size={16} />}
                />
            )
        case 'simulated': {
            const { transaction, checks } = simulationResult.simulation

            switch (transaction.type) {
                case 'BridgeTrx':
                case 'UnknownTransaction':
                case 'FailedTransaction':
                case 'P2PTransaction':
                case 'P2PNftTransaction':
                case 'WithdrawalTrx':
                    return (
                        <Progress
                            title={
                                <FormattedMessage
                                    id="submit-userop.progress.text"
                                    defaultMessage="Sending"
                                />
                            }
                            variant="neutral"
                            initialProgress={20}
                            progress={40}
                            right={<Spinner size={16} />}
                        />
                    )
                case 'ApprovalTransaction':
                case 'SingleNftApprovalTransaction':
                case 'NftCollectionApprovalTransaction':
                    return (
                        <Column spacing={0}>
                            <Group variant="default">
                                <Column spacing={0}>
                                    <Text
                                        variant="paragraph"
                                        weight="regular"
                                        color="textSecondary"
                                    >
                                        <FormattedMessage
                                            id="check-confirmation.approve.footer.for"
                                            defaultMessage="For"
                                        />
                                    </Text>
                                    <ListItem
                                        safetyChecks={checks}
                                        smartContract={transaction.approveTo}
                                        networkMap={networkMap}
                                    />
                                </Column>
                            </Group>

                            <Progress
                                title={
                                    <FormattedMessage
                                        id="submit-userop.progress.text"
                                        defaultMessage="Sending"
                                    />
                                }
                                variant="neutral"
                                initialProgress={20}
                                progress={40}
                                right={<Spinner size={16} />}
                            />
                        </Column>
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(transaction)
            }
        }
        /* istanbul ignore next */
        default:
            return notReachable(simulationResult)
    }
}
