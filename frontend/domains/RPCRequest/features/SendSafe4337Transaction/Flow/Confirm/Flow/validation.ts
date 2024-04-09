import { notReachable } from '@zeal/toolkit'
import { failure, Result, success } from '@zeal/toolkit/Result'

import {
    CryptoCurrency,
    CurrencyId,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { CryptoMoney } from '@zeal/domains/Money'
import { Portfolio } from '@zeal/domains/Portfolio'
import { FailedTransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { calculateTransactionSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateTransactionSafetyChecksResult'
import { SimulatedUserOperationRequest } from '@zeal/domains/TransactionRequest'
import { SimulatedTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { GasAbstractionTransactionFee } from '@zeal/domains/UserOperation'

type InsufficientGasTokenBalanceError = {
    type: 'insufficient_gas_token_balance'
    selectedFee: GasAbstractionTransactionFee
    requiredGasCurrencyAmount: CryptoMoney
}

type DangerSafetyChecksFailedError = {
    type: 'danger_safety_checks_failed'
    failedChecks: FailedTransactionSafetyCheck[]
    knownCurrencies: KnownCurrencies
    selectedFee: GasAbstractionTransactionFee
    userOperationRequest: SimulatedUserOperationRequest
}

type SubmitError =
    | InsufficientGasTokenBalanceError
    | DangerSafetyChecksFailedError

export type FeeForecastError = InsufficientGasTokenBalanceError

const getOutgoingGasTokenAmount = ({
    gasCurrencyId,
    simulatedTransaction,
}: {
    gasCurrencyId: CurrencyId
    simulatedTransaction: SimulatedTransaction
}): bigint => {
    switch (simulatedTransaction.type) {
        case 'BridgeTrx':
        case 'ApprovalTransaction':
        case 'FailedTransaction':
        case 'SingleNftApprovalTransaction':
        case 'NftCollectionApprovalTransaction':
        case 'P2PNftTransaction':
        case 'WithdrawalTrx':
            return 0n
        case 'P2PTransaction': {
            switch (simulatedTransaction.token.direction) {
                case 'Receive':
                    return 0n
                case 'Send':
                    return simulatedTransaction.token.amount.currencyId ===
                        gasCurrencyId
                        ? simulatedTransaction.token.amount.amount
                        : 0n

                /* istanbul ignore next */
                default:
                    return notReachable(simulatedTransaction.token.direction)
            }
        }
        case 'UnknownTransaction': {
            const outgoingTokens = simulatedTransaction.tokens.filter(
                (token) => {
                    switch (token.direction) {
                        case 'Receive':
                            return false
                        case 'Send':
                            return true

                        /* istanbul ignore next */
                        default:
                            return notReachable(token.direction)
                    }
                }
            )

            return outgoingTokens.reduce((sum, token) => {
                return token.amount.currencyId === gasCurrencyId
                    ? sum + token.amount.amount
                    : sum
            }, 0n)
        }
        /* istanbul ignore next */
        default:
            return notReachable(simulatedTransaction)
    }
}

const validateGasCurrencyBalance = ({
    portfolio,
    feeForecast,
    selectedGasCurrency,
    simulatedTransaction,
}: {
    portfolio: Portfolio | null
    selectedGasCurrency: CryptoCurrency
    feeForecast: GasAbstractionTransactionFee[]
    simulatedTransaction: SimulatedTransaction
}): Result<InsufficientGasTokenBalanceError, GasAbstractionTransactionFee> => {
    const portfolioTokens = portfolio?.tokens || []

    const token = portfolioTokens.find(
        (t) => t.balance.currencyId === selectedGasCurrency.id
    )

    const selectedFee = feeForecast.find(
        (fee) => fee.feeInTokenCurrency.currency.id === selectedGasCurrency.id
    )

    if (!selectedFee) {
        throw new ImperativeError(
            `Selected fee not found in validateGasCurrencyBalance for gas currency`,
            { selectedGasCurrencyId: selectedGasCurrency }
        )
    }

    const outgoingGasTokenAmount = getOutgoingGasTokenAmount({
        gasCurrencyId: selectedGasCurrency.id,
        simulatedTransaction,
    })

    const requiredGasCurrencyAmount =
        selectedFee.feeInTokenCurrency.amount + outgoingGasTokenAmount

    if (!token || token.balance.amount < requiredGasCurrencyAmount) {
        return failure({
            type: 'insufficient_gas_token_balance',
            selectedFee,
            requiredGasCurrencyAmount: {
                currency: selectedGasCurrency,
                amount: requiredGasCurrencyAmount,
            },
        })
    }

    return success(selectedFee)
}

const validateDangerSafetyChecks = ({
    selectedFee,
    userOperationRequest,
}: {
    selectedFee: GasAbstractionTransactionFee
    userOperationRequest: SimulatedUserOperationRequest
}): Result<DangerSafetyChecksFailedError, GasAbstractionTransactionFee> => {
    switch (userOperationRequest.simulationResult.type) {
        case 'failed':
        case 'not_supported':
            return success(selectedFee)
        case 'simulated':
            const { checks } = userOperationRequest.simulationResult.simulation
            const safetyCheckResult =
                calculateTransactionSafetyChecksResult(checks)

            switch (safetyCheckResult.type) {
                case 'Failure':
                    const dangerFailedChecks =
                        safetyCheckResult.reason.failedChecks.filter(
                            (check) => {
                                switch (check.severity) {
                                    case 'Caution':
                                        return false
                                    case 'Danger':
                                        return true
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(check.severity)
                                }
                            }
                        )
                    return dangerFailedChecks.length
                        ? failure({
                              type: 'danger_safety_checks_failed',
                              failedChecks: dangerFailedChecks,
                              selectedFee,
                              userOperationRequest: userOperationRequest,
                              knownCurrencies:
                                  userOperationRequest.simulationResult
                                      .simulation.currencies,
                          })
                        : success(selectedFee)
                case 'Success':
                    return success(selectedFee)
                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheckResult)
            }
        /* istanbul ignore next */
        default:
            return notReachable(userOperationRequest.simulationResult)
    }
}

export const validate = ({
    portfolio,
    selectedGasCurrency,
    feeForecast,
    simulatedTransaction,
}: {
    portfolio: Portfolio | null
    selectedGasCurrency: CryptoCurrency
    feeForecast: GasAbstractionTransactionFee[]
    simulatedTransaction: SimulatedTransaction
}): Result<FeeForecastError, GasAbstractionTransactionFee> =>
    validateGasCurrencyBalance({
        portfolio,
        selectedGasCurrency,
        feeForecast,
        simulatedTransaction,
    })

export const validateSubmit = ({
    portfolio,
    selectedGasCurrency,
    userOperationRequest,
    feeForecast,
    simulatedTransaction,
}: {
    portfolio: Portfolio | null
    selectedGasCurrency: CryptoCurrency
    userOperationRequest: SimulatedUserOperationRequest
    feeForecast: GasAbstractionTransactionFee[]
    simulatedTransaction: SimulatedTransaction
}): Result<
    SubmitError,
    {
        selectedFee: GasAbstractionTransactionFee
        feeForecast: GasAbstractionTransactionFee[]
        userOperationRequest: SimulatedUserOperationRequest
    }
> =>
    validateGasCurrencyBalance({
        portfolio,
        selectedGasCurrency,
        feeForecast,
        simulatedTransaction,
    })
        .andThen((selectedFee) =>
            validateDangerSafetyChecks({
                selectedFee,
                userOperationRequest,
            })
        )
        .map((selectedFee) => ({
            selectedFee,
            feeForecast,
            userOperationRequest,
        }))
