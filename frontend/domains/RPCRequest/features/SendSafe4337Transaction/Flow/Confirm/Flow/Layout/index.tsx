import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Group } from '@zeal/uikit/Group'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Result } from '@zeal/toolkit/Result'

import { AccountsMap } from '@zeal/domains/Account'
import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { Portfolio } from '@zeal/domains/Portfolio'
import { FailedTransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { TransactionStatusButton } from '@zeal/domains/SafetyCheck/components/TransactionStatusButton'
import { calculateTransactionSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateTransactionSafetyChecksResult'
import { ListItem } from '@zeal/domains/SmartContract/components/ListItem'
import { SimulatedUserOperationRequest } from '@zeal/domains/TransactionRequest'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { SimulatedTransactionContentHeader } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/SimulatedTransactionContentHeader'
import { GasAbstractionTransactionFee } from '@zeal/domains/UserOperation'

import { FeeForecastWidget } from './FeeForecastWidget'

import { SafeTransactionInfo } from '../../../SafeTransactionInfo'
import { FeeForecastError, validateSubmit } from '../validation'

type Props = {
    userOperationRequest: SimulatedUserOperationRequest
    installationId: string
    simulation: SimulateTransactionResponse
    feeForecast: GasAbstractionTransactionFee[]
    selectedGasCurrency: CryptoCurrency
    dAppInfo: DAppSiteInfo | null
    portfolio: Portfolio | null
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    pollingInterval: number
    pollingStartedAt: number
    feeForecastValidation: Result<
        FeeForecastError,
        GasAbstractionTransactionFee
    >
    visualState: VisualState
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

export type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg =
    | { type: 'on_minimize_click' }
    | { type: 'on_cancel_confirm_transaction_clicked' }
    | {
          type: 'on_submit_click'
          selectedFee: GasAbstractionTransactionFee
          feeForecast: GasAbstractionTransactionFee[]
          userOperationRequest: SimulatedUserOperationRequest
          simulation: SimulateTransactionResponse
      }
    | {
          type: 'on_user_confirmation_requested'
          selectedFee: GasAbstractionTransactionFee
          failedSafetyChecks: FailedTransactionSafetyCheck[]
          knownCurrencies: KnownCurrencies
      }
    | MsgOf<typeof SafeTransactionFooter>
    | MsgOf<typeof FeeForecastWidget>
    | MsgOf<typeof ConnectedMinimized>

export const Layout = ({
    userOperationRequest,
    dAppInfo,
    accountsMap,
    feeForecast,
    portfolio,
    keyStoreMap,
    networkMap,
    onMsg,
    pollingStartedAt,
    pollingInterval,
    selectedGasCurrency,
    feeForecastValidation,
    simulation,
    visualState,
    actionSource,
    installationId,
}: Props) => {
    const { network, account, dApp } = userOperationRequest

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
                <Screen padding="form" background="light">
                    <ActionBar
                        title={
                            <FormattedMessage
                                id="action_bar_title.transaction_request"
                                defaultMessage="Transaction request"
                            />
                        }
                        account={account}
                        actionSource={actionSource}
                        network={findNetworkByHexChainId(
                            network.hexChainId,
                            networkMap
                        )}
                        onMsg={onMsg}
                    />

                    <Column spacing={12} alignY="stretch">
                        <Content
                            header={
                                <SimulatedTransactionContentHeader
                                    dAppInfo={dAppInfo}
                                    simulatedTransaction={
                                        simulation.transaction
                                    }
                                />
                            }
                            footer={
                                <SafeTransactionFooter
                                    onMsg={onMsg}
                                    networkMap={networkMap}
                                    simulation={simulation}
                                />
                            }
                        >
                            <SafeTransactionInfo
                                installationId={installationId}
                                simulation={simulation}
                                dApp={dApp}
                                accounts={accountsMap}
                                keyStores={keyStoreMap}
                                networkMap={networkMap}
                            />
                        </Content>
                        <Column spacing={12}>
                            <FeeForecastWidget
                                pollingStartedAt={pollingStartedAt}
                                pollingInterval={pollingInterval}
                                feeForecast={feeForecast}
                                feeForecastValidation={feeForecastValidation}
                                onMsg={onMsg}
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
                                <MainCTA
                                    simulation={simulation}
                                    userOperationRequest={userOperationRequest}
                                    portfolio={portfolio}
                                    selectedGasCurrency={selectedGasCurrency}
                                    feeForecast={feeForecast}
                                    onMsg={onMsg}
                                />
                            </Actions>
                        </Column>
                    </Column>
                </Screen>
            )

        default:
            return notReachable(visualState)
    }
}

const SafeTransactionFooter = ({
    simulation,
    networkMap,
    onMsg,
}: {
    simulation: SimulateTransactionResponse
    networkMap: NetworkMap
    onMsg: (msg: {
        type: 'on_safety_checks_clicked'
        simulation: SimulateTransactionResponse
    }) => void
}) => {
    const { transaction, currencies, checks } = simulation

    const safetyCheckResult = calculateTransactionSafetyChecksResult(checks)

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
                        onClick={() =>
                            onMsg({
                                type: 'on_safety_checks_clicked',
                                simulation,
                            })
                        }
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
                    onClick={() =>
                        onMsg({
                            type: 'on_safety_checks_clicked',
                            simulation,
                        })
                    }
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}

const MainCTA = ({
    selectedGasCurrency,
    portfolio,
    onMsg,
    feeForecast,
    userOperationRequest,
    simulation,
}: {
    userOperationRequest: SimulatedUserOperationRequest
    feeForecast: GasAbstractionTransactionFee[]
    portfolio: Portfolio | null
    selectedGasCurrency: CryptoCurrency
    simulation: SimulateTransactionResponse
    onMsg: (msg: Msg) => void
}) => {
    const validationResult = validateSubmit({
        selectedGasCurrency,
        portfolio,
        userOperationRequest,
        feeForecast,
        simulatedTransaction: simulation.transaction,
    })

    switch (validationResult.type) {
        case 'Failure':
            const { reason } = validationResult
            switch (reason.type) {
                case 'insufficient_gas_token_balance':
                    return (
                        <Button size="regular" variant="primary" disabled>
                            <FormattedMessage
                                id="action.submit"
                                defaultMessage="Submit"
                            />
                        </Button>
                    )
                case 'danger_safety_checks_failed':
                    return (
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() =>
                                onMsg({
                                    type: 'on_user_confirmation_requested',
                                    selectedFee: reason.selectedFee,
                                    failedSafetyChecks: reason.failedChecks,
                                    knownCurrencies: reason.knownCurrencies,
                                })
                            }
                        >
                            <FormattedMessage
                                id="action.submit"
                                defaultMessage="Submit"
                            />
                        </Button>
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(reason)
            }
        case 'Success':
            return (
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() =>
                        onMsg({
                            type: 'on_submit_click',
                            selectedFee: validationResult.data.selectedFee,
                            userOperationRequest:
                                validationResult.data.userOperationRequest,
                            feeForecast: validationResult.data.feeForecast,
                            simulation,
                        })
                    }
                >
                    <FormattedMessage
                        id="action.submit"
                        defaultMessage="Submit"
                    />
                </Button>
            )
        /* istanbul ignore next */
        default:
            return notReachable(validationResult)
    }
}
