import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { Code } from '@zeal/domains/Currency/components/Code'
import { FailedTransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ResultIcon } from '@zeal/domains/SafetyCheck/components/ResultIcon'
import { TransactionItem } from '@zeal/domains/SafetyCheck/components/TransactionItem'
import { calculateTransactionSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateTransactionSafetyChecksResult'
import { SimulatedUserOperationRequest } from '@zeal/domains/TransactionRequest'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { GasAbstractionTransactionFee } from '@zeal/domains/UserOperation'

type Props = {
    failedSafetyChecks: FailedTransactionSafetyCheck[]
    knownCurrencies: KnownCurrencies
    selectedFee: GasAbstractionTransactionFee
    feeForecast: GasAbstractionTransactionFee[]
    userOperationRequest: SimulatedUserOperationRequest
    simulation: SimulateTransactionResponse
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_user_confirmed_transaction_for_signing'
          selectedFee: GasAbstractionTransactionFee
          feeForecast: GasAbstractionTransactionFee[]
          userOperationRequest: SimulatedUserOperationRequest
          simulation: SimulateTransactionResponse
      }

const Title = ({
    safetyCheck,
    knownCurrencies,
}: {
    knownCurrencies: KnownCurrencies
    safetyCheck: FailedTransactionSafetyCheck
}) => {
    switch (safetyCheck.type) {
        case 'TransactionSimulationCheck':
            return (
                <FormattedMessage
                    id="TransactionSimulationCheck.Failed.title"
                    defaultMessage="Transaction is likely to fail"
                />
            )

        case 'TokenVerificationCheck':
            return (
                <FormattedMessage
                    id="TokenVerificationCheck.Passed.title"
                    defaultMessage="{tokenCode} is not verified by CoinGecko"
                    values={{
                        tokenCode: (
                            <Code
                                knownCurrencies={knownCurrencies}
                                currencyId={safetyCheck.currencyId}
                            />
                        ),
                    }}
                />
            )

        case 'SmartContractBlacklistCheck':
            return (
                <FormattedMessage
                    id="SmartContractBlacklistCheck.Failed.title"
                    defaultMessage="Contract is blacklisted"
                />
            )

        case 'NftCollectionCheck':
            return (
                <FormattedMessage
                    id="NftCollectionCheck.Failed.title"
                    defaultMessage="Collection is not verified"
                />
            )

        case 'P2pReceiverTypeCheck':
            return (
                <FormattedMessage
                    id="P2pReceiverTypeCheck.Failed.title"
                    defaultMessage="Receiver is smart contract, not wallet"
                />
            )

        case 'ApprovalSpenderTypeCheck':
            return (
                <FormattedMessage
                    id="ApprovalSpenderTypeCheck.Failed.title"
                    defaultMessage="Spender is a wallet, not a contract"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(safetyCheck)
    }
}

export const UserConfirmationPopup = ({
    onMsg,
    knownCurrencies,
    userOperationRequest,
    feeForecast,
    selectedFee,
    failedSafetyChecks,
    simulation,
}: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size }) => (
                    <ResultIcon
                        size={size}
                        safetyCheckResult={calculateTransactionSafetyChecksResult(
                            failedSafetyChecks
                        )}
                    />
                )}
                title={
                    <Title
                        knownCurrencies={knownCurrencies}
                        safetyCheck={failedSafetyChecks[0]}
                    />
                }
            />
            <Popup.Content>
                <Column spacing={12}>
                    {failedSafetyChecks.map((check) => (
                        <TransactionItem
                            knownCurrencies={knownCurrencies}
                            key={check.type}
                            safetyCheck={check}
                        />
                    ))}
                </Column>
            </Popup.Content>
            <Popup.Actions>
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="action.cancel"
                        defaultMessage="Cancel"
                    />
                </Button>
                <Button
                    size="regular"
                    variant="secondary"
                    onClick={() =>
                        onMsg({
                            type: 'on_user_confirmed_transaction_for_signing',
                            userOperationRequest,
                            feeForecast,
                            selectedFee,
                            simulation,
                        })
                    }
                >
                    <FormattedMessage
                        id="action.submit"
                        defaultMessage="Submit"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
