import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Group } from '@zeal/uikit/Group'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { OffRampTransactionView } from '@zeal/domains/Currency/domains/BankTransfer/components/OffRampTransactionView'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NftCollectionListItem } from '@zeal/domains/NFTCollection/components/NftCollectionListItem'
import { NftListItem } from '@zeal/domains/NFTCollection/components/NftListItem'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { TransactionSafetyCheckResult } from '@zeal/domains/SafetyCheck'
import { TransactionStatusButton } from '@zeal/domains/SafetyCheck/components/TransactionStatusButton'
import { ListItem } from '@zeal/domains/SmartContract/components/ListItem'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { BridgeTrxView } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/BridgeTrx'
import { EditableApprove } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/EditableApprove'
import { Failed } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/Failed'
import { P2PTransactionView } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/P2PTransactionView'
import { SimulatedTransactionContentHeader } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/SimulatedTransactionContentHeader'
import { Unknown } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/Unknown'

import { FeeForecastWidget } from '../../../../FeeForecastWidget'
import { ActionButton, Msg as ActionButtonMsg } from '../../ActionButton'
import { validateSafetyCheckFailedWithFailedChecksOnly } from '../helpers/validation'

type Props = {
    installationId: string
    transactionRequest: NotSigned
    simulation: SimulateTransactionResponse
    nonce: number
    gasEstimate: string

    networkRPCMap: NetworkRPCMap
    networkMap: NetworkMap

    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    pollingInterval: number
    pollingStartedAt: number

    accounts: AccountsMap
    keystores: KeyStoreMap

    actionSource: ActionSource

    onMsg: (msg: Msg) => void
}

export type Msg =
    | {
          type: 'on_cancel_confirm_transaction_clicked'
      }
    | {
          type: 'safety_checks_clicked'
      }
    | {
          type: 'on_minimize_click'
      }
    | ActionButtonMsg
    | MsgOf<typeof FeeForecastWidget>
    | MsgOf<typeof EditableApprove>
    | MsgOf<typeof SimulatedTransactionContentHeader>

export const Layout = ({
    onMsg,
    simulation,
    nonce,
    gasEstimate,
    transactionRequest,
    pollingInterval,
    pollingStartedAt,
    pollableData,
    accounts,
    keystores,
    networkRPCMap,
    networkMap,
    actionSource,
    installationId,
}: Props) => {
    const { account } = transactionRequest

    const keystore = getKeyStore({
        keyStoreMap: keystores,
        address: account.address,
    })

    const simulationResult: SimulationResult = { type: 'simulated', simulation }

    const safetyCheckResult = validateSafetyCheckFailedWithFailedChecksOnly({
        simulationResult,
    })

    return (
        <Screen
            background="light"
            padding="form"
            onNavigateBack={() => onMsg({ type: 'on_minimize_click' })}
        >
            <ActionBar
                title={
                    <FormattedMessage
                        id="action_bar_title.transaction_request"
                        defaultMessage="Transaction request"
                    />
                }
                account={transactionRequest.account}
                actionSource={actionSource}
                network={findNetworkByHexChainId(
                    transactionRequest.networkHexId,
                    networkMap
                )}
                onMsg={onMsg}
            />

            <Column spacing={12} alignY="stretch">
                <Content
                    header={
                        <SimulatedTransactionContentHeader
                            dAppInfo={transactionRequest.dApp}
                            simulatedTransaction={
                                simulationResult.simulation.transaction
                            }
                        />
                    }
                    footer={
                        <Footer
                            safetyCheckResult={safetyCheckResult}
                            simulation={simulation}
                            networkMap={networkMap}
                            onMsg={onMsg}
                        />
                    }
                >
                    <TransactionInfo
                        installationId={installationId}
                        network={findNetworkByHexChainId(
                            transactionRequest.networkHexId,
                            networkMap
                        )}
                        networkRPCMap={networkRPCMap}
                        networkMap={networkMap}
                        keystores={keystores}
                        originalEthSendTransaction={
                            transactionRequest.rpcRequest
                        }
                        accounts={accounts}
                        dApp={transactionRequest.dApp}
                        simulation={simulation}
                        onMsg={onMsg}
                    />
                </Content>

                <Column spacing={12}>
                    <FeeForecastWidget
                        keystore={keystore}
                        nonce={nonce}
                        gasEstimate={gasEstimate}
                        pollingStartedAt={pollingStartedAt}
                        simulateTransactionResponse={{
                            type: 'simulated',
                            simulation,
                        }}
                        transactionRequest={transactionRequest}
                        onMsg={onMsg}
                        pollingInterval={pollingInterval}
                        pollableData={pollableData}
                    />

                    <Actions>
                        <Button
                            size="regular"
                            variant="secondary"
                            onClick={() =>
                                onMsg({
                                    type: 'on_cancel_confirm_transaction_clicked',
                                })
                            }
                        >
                            <FormattedMessage
                                id="action.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>

                        <ActionButton
                            nonce={nonce}
                            gasEstimate={gasEstimate}
                            pollableData={pollableData}
                            transactionRequest={transactionRequest}
                            simulationResult={{ type: 'simulated', simulation }}
                            onMsg={onMsg}
                            keystore={getKeyStore({
                                keyStoreMap: keystores,
                                address: transactionRequest.account.address,
                            })}
                        />
                    </Actions>
                </Column>
            </Column>
        </Screen>
    )
}

const Footer = ({
    safetyCheckResult,
    simulation,
    networkMap,
    onMsg,
}: {
    safetyCheckResult: TransactionSafetyCheckResult
    simulation: SimulateTransactionResponse
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}) => {
    const { transaction, currencies, checks } = simulation

    switch (transaction.type) {
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
                                    id="simulation.approve.footer.for"
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

                    <TransactionStatusButton
                        safetyCheckResult={safetyCheckResult}
                        knownCurrencies={currencies}
                        onClick={() => onMsg({ type: 'safety_checks_clicked' })}
                    />
                </Column>
            )
        case 'UnknownTransaction':
        case 'FailedTransaction':
        case 'P2PTransaction':
        case 'P2PNftTransaction':
        case 'BridgeTrx':
        case 'WithdrawalTrx':
            return (
                <TransactionStatusButton
                    safetyCheckResult={safetyCheckResult}
                    knownCurrencies={currencies}
                    onClick={() => onMsg({ type: 'safety_checks_clicked' })}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}

const TransactionInfo = ({
    simulation,
    accounts,
    keystores,
    originalEthSendTransaction,
    onMsg,
    network,
    networkRPCMap,
    installationId,
    networkMap,
    dApp,
}: {
    simulation: SimulateTransactionResponse
    dApp: DAppSiteInfo | null
    accounts: AccountsMap
    originalEthSendTransaction: EthSendTransaction
    keystores: KeyStoreMap
    onMsg: (msg: Msg) => void
    network: Network
    networkRPCMap: NetworkRPCMap
    installationId: string
    networkMap: NetworkMap
}) => {
    const { transaction, checks, currencies: knownCurrencies } = simulation

    switch (transaction.type) {
        case 'WithdrawalTrx':
            return (
                <OffRampTransactionView
                    variant={{ type: 'no_status' }}
                    networkMap={networkMap}
                    withdrawalRequest={transaction.withdrawalRequest}
                />
            )

        case 'BridgeTrx':
            return (
                <BridgeTrxView
                    networkMap={networkMap}
                    transaction={transaction}
                    knownCurrencies={knownCurrencies}
                />
            )
        case 'P2PTransaction':
        case 'P2PNftTransaction':
            return (
                <P2PTransactionView
                    installationId={installationId}
                    networkMap={networkMap}
                    transaction={transaction}
                    dApp={dApp}
                    knownCurrencies={knownCurrencies}
                    checks={checks}
                    accounts={accounts}
                    keystores={keystores}
                />
            )

        case 'ApprovalTransaction':
            return (
                <EditableApprove
                    originalEthSendTransaction={originalEthSendTransaction}
                    checks={checks}
                    knownCurrencies={knownCurrencies}
                    transaction={transaction}
                    network={network}
                    networkRPCMap={networkRPCMap}
                    onMsg={onMsg}
                />
            )

        case 'UnknownTransaction':
            return (
                <Unknown
                    networkMap={networkMap}
                    checks={checks}
                    knownCurrencies={knownCurrencies}
                    transaction={transaction}
                />
            )

        case 'FailedTransaction':
            return <Failed dApp={dApp} transaction={transaction} />

        case 'SingleNftApprovalTransaction':
            return (
                <NftListItem
                    networkMap={networkMap}
                    nft={transaction.nft}
                    checks={checks}
                    rightNode={null}
                />
            )

        case 'NftCollectionApprovalTransaction':
            return (
                <NftCollectionListItem
                    networkMap={networkMap}
                    checks={checks}
                    nftCollection={transaction.nftCollectionInfo}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}
