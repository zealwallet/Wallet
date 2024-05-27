import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Group } from '@zeal/uikit/Group'
import { Progress } from '@zeal/uikit/Progress'
import { Screen } from '@zeal/uikit/Screen'
import { Spinner } from '@zeal/uikit/Spinner'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { RangeInt } from '@zeal/toolkit/Range'

import { AccountsMap } from '@zeal/domains/Account'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap } from '@zeal/domains/Network'
import { SafeTransactionInfo } from '@zeal/domains/RPCRequest/features/SendSafe4337Transaction/Flow/SafeTransactionInfo'
import { ListItem } from '@zeal/domains/SmartContract/components/ListItem'
import { SimulatedUserOperationRequest } from '@zeal/domains/TransactionRequest'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { SimulatedTransactionContentHeader } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/SimulatedTransactionContentHeader'

type Props = {
    userOperationRequest: SimulatedUserOperationRequest
    simulation: SimulateTransactionResponse
    visualState: VisualState
    actionSource: ActionSource
    initialProgress: RangeInt<0, 100>
    installationId: string
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof ConnectedMinimized> | { type: 'on_minimize_click' }

type VisualState = { type: 'minimised' } | { type: 'maximised' }

export const LoadingLayout = ({
    userOperationRequest,
    simulation,
    visualState,
    initialProgress,
    actionSource,
    installationId,
    networkMap,
    keyStoreMap,
    accountsMap,
    onMsg,
}: Props) => {
    const { dApp, network, account } = userOperationRequest
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
                                id="submitSafeTransaction.sign.title"
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
                                <SimulatedTransactionContentHeader
                                    simulatedTransaction={
                                        simulation.transaction
                                    }
                                    dAppInfo={dApp}
                                />
                            }
                            footer={
                                <Footer
                                    userOperationRequest={userOperationRequest}
                                    networkMap={networkMap}
                                    initialProgress={initialProgress}
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
    initialProgress,
}: {
    userOperationRequest: Props['userOperationRequest']
    networkMap: Props['networkMap']
    initialProgress: Props['initialProgress']
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
                            defaultMessage="Creating"
                        />
                    }
                    variant="neutral"
                    initialProgress={initialProgress}
                    progress={20}
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
                                    id="create-userop.progress.text"
                                    defaultMessage="Creating"
                                />
                            }
                            variant="neutral"
                            initialProgress={initialProgress}
                            progress={20}
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
                                        id="create-userop.progress.text"
                                        defaultMessage="Creating"
                                    />
                                }
                                variant="neutral"
                                initialProgress={initialProgress}
                                progress={20}
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
