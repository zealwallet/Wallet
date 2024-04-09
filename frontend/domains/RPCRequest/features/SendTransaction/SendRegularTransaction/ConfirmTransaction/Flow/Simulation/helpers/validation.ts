import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { failure, Result, success } from '@zeal/toolkit/Result'

import { KeyStore, SigningKeyStore } from '@zeal/domains/KeyStore'
import {
    FailedTransactionSafetyCheck,
    TransactionSafetyCheck,
} from '@zeal/domains/SafetyCheck'
import { NotSigned, Simulated } from '@zeal/domains/TransactionRequest'
import {
    NotEnoughBalance,
    validateNotEnoughBalance,
} from '@zeal/domains/TransactionRequest/helpers/validateNotEnoughBalance'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import {
    EstimatedFee,
    SimulateTransactionResponse,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import {
    NonceRangeErrorBiggerThanCurrent,
    NonceRangeErrorLessThanCurrent,
    PollableDataLoading,
    PollableErroredAndUserDidNotSelectedCustomPreset,
    TrxLikelyToFail,
    TrxMayTakeLongToProceedBaseFeeLow,
    TrxMayTakeLongToProceedGasPriceLow,
    TrxMayTakeLongToProceedPriorityFeeLow,
    TrxWillFailLessThenMinimumGas,
    validateNonceRangeErrorBiggerThanCurrent,
    validateNonceRangeErrorLessThanCurrent,
    validateTrxLikelyToFail,
    validateTrxMayTakeLongToProceedBaseFeeLow,
    validateTrxMayTakeLongToProceedGasPriceLow,
    validateTrxMayTakeLongToProceedPriorityFeeLow,
    validateTrxWillFailLessThenMinimumGas,
} from '../../../../FeeForecastWidget/helpers/validation'
import { getNonce } from '../../../../helpers/getNonce'

type LoadedPollable = Extract<
    PollableData<FeeForecastResponse, FeeForecastRequest>,
    { type: 'loaded' | 'reloading' | 'subsequent_failed' }
>

export type SafetyCheckFailed = {
    type: 'safety_check_failed'
    keystore: SigningKeyStore
    simulated: Omit<Simulated, 'simulation'> & {
        simulation: Extract<SimulationResult, { type: 'simulated' }>
    }
    failedChecks: FailedTransactionSafetyCheck[]
}

export type SimulationFailedSafetyChecks<T extends KeyStore> = {
    type: 'simulation_failed_safety_checks'
    simulated: Simulated
    keystore: T
}

export type SafetyCheckFailedWithFailedChecksOnly = {
    type: 'safety_check_failed'
    failedChecks: FailedTransactionSafetyCheck[]
    simulation: SimulateTransactionResponse
}

export const validateSafetyCheckFailedWithFailedChecksOnly = ({
    simulationResult,
}: {
    simulationResult: SimulationResult
}): Result<SafetyCheckFailedWithFailedChecksOnly, unknown> => {
    switch (simulationResult.type) {
        case 'failed':
        case 'not_supported':
            return success(undefined)
        case 'simulated': {
            const failedSafetyCheck = simulationResult.simulation.checks.filter(
                (
                    check
                ): check is Extract<
                    TransactionSafetyCheck,
                    { state: 'Failed' }
                > => {
                    switch (check.state) {
                        case 'Passed':
                            return false
                        case 'Failed':
                            return true
                        /* istanbul ignore next */
                        default:
                            return notReachable(check)
                    }
                }
            )
            return failedSafetyCheck.length
                ? failure({
                      type: 'safety_check_failed',
                      failedChecks: failedSafetyCheck,
                      simulation: simulationResult.simulation,
                  })
                : success(undefined)
        }

        /* istanbul ignore next */
        default:
            return notReachable(simulationResult)
    }
}

export const validateSafetyChecks = ({
    pollable,
    transactionRequest,
    simulationResult,
    nonce,
    gasEstimate,
    keystore,
}: {
    pollable: LoadedPollable
    transactionRequest: NotSigned
    simulationResult: SimulationResult
    nonce: number
    gasEstimate: string
    keystore: SigningKeyStore
}): Result<SafetyCheckFailed, unknown> => {
    const simulatedTrx: Simulated = {
        state: 'simulated',
        networkHexId: transactionRequest.networkHexId,
        account: transactionRequest.account,
        dApp: transactionRequest.dApp,
        rpcRequest: transactionRequest.rpcRequest,
        simulation: simulationResult,
        gasEstimate,
        selectedFee: getCurrentFee({ pollable }),
        selectedGas: pollable.params.gasLimit,
        selectedNonce: getNonce(pollable, nonce),
    }

    const failedSafetyChecks = validateSafetyCheckFailedWithFailedChecksOnly({
        simulationResult,
    })

    switch (failedSafetyChecks.type) {
        case 'Failure':
            const danger = failedSafetyChecks.reason.failedChecks.filter(
                (safetyCheck) => safetyCheck.severity === 'Danger'
            )
            return !!danger.length
                ? failure({
                      type: 'safety_check_failed' as const,
                      failedChecks: danger,
                      keystore,
                      simulated: {
                          ...simulatedTrx,
                          simulation: {
                              type: 'simulated',
                              simulation: failedSafetyChecks.reason.simulation,
                          },
                      },
                  })
                : success(undefined)
        case 'Success':
            return success(undefined)
        /* istanbul ignore next */
        default:
            return notReachable(failedSafetyChecks)
    }
}

export const validateSimulationFailedSafetyChecks = <T extends KeyStore>({
    simulationResult,
    gasEstimate,
    keystore,
    nonce,
    pollable,
    transactionRequest,
}: {
    simulationResult: SimulationResult
    pollable: LoadedPollable
    transactionRequest: NotSigned
    nonce: number
    gasEstimate: string
    keystore: T
}): Result<SimulationFailedSafetyChecks<T>, unknown> => {
    const simulatedTrx: Simulated = {
        state: 'simulated',
        networkHexId: transactionRequest.networkHexId,
        account: transactionRequest.account,
        dApp: transactionRequest.dApp,
        rpcRequest: transactionRequest.rpcRequest,
        simulation: simulationResult,
        gasEstimate,
        selectedFee: getCurrentFee({ pollable }),
        selectedGas: pollable.params.gasLimit,
        selectedNonce: getNonce(pollable, nonce),
    }

    const safetyChecks = validateSafetyCheckFailedWithFailedChecksOnly({
        simulationResult,
    })

    switch (safetyChecks.type) {
        case 'Failure':
            return !!safetyChecks.reason.failedChecks.find(
                (check) => check.type === 'TransactionSimulationCheck'
            )
                ? failure({
                      type: 'simulation_failed_safety_checks',
                      keystore,
                      simulated: simulatedTrx,
                  })
                : success(undefined)
        case 'Success':
            return success(undefined)
        /* istanbul ignore next */
        default:
            return notReachable(safetyChecks)
    }
}

export type SafetyCheckAndFeeValidationError = {
    type: 'safety_check_and_fee_validation_error'
    safetyCheck: SafetyCheckFailed
    forecastFeeError:
        | TrxMayTakeLongToProceedBaseFeeLow<SigningKeyStore>
        | TrxMayTakeLongToProceedGasPriceLow<SigningKeyStore>
        | TrxMayTakeLongToProceedPriorityFeeLow<SigningKeyStore>
}

const validateSafetyCheckAndFeeValidationError = (input: {
    pollable: LoadedPollable
    transactionRequest: NotSigned
    simulationResult: SimulationResult
    nonce: number
    gasEstimate: string
    keystore: SigningKeyStore
}): Result<SafetyCheckAndFeeValidationError, unknown> => {
    const safetyCheck = validateSafetyChecks(input)

    const feeValidations = validateTrxMayTakeLongToProceedBaseFeeLow(input)
        .andThen(() => validateTrxMayTakeLongToProceedPriorityFeeLow(input))
        .andThen(() => validateTrxMayTakeLongToProceedGasPriceLow(input))

    switch (safetyCheck.type) {
        case 'Failure':
            switch (feeValidations.type) {
                case 'Failure':
                    return failure({
                        type: 'safety_check_and_fee_validation_error',
                        forecastFeeError: feeValidations.reason,
                        safetyCheck: safetyCheck.reason,
                    })
                case 'Success':
                    return success(undefined)
                /* istanbul ignore next */
                default:
                    return notReachable(feeValidations)
            }
        case 'Success':
            return success(undefined)
        /* istanbul ignore next */
        default:
            return notReachable(safetyCheck)
    }
}

export type SubmitValidationError =
    | { type: 'import_private_keys_required' }
    | SimulationFailedSafetyChecks<SigningKeyStore>
    | SafetyCheckFailed
    | SafetyCheckAndFeeValidationError
    | NotEnoughBalance
    | TrxMayTakeLongToProceedBaseFeeLow<SigningKeyStore>
    | TrxMayTakeLongToProceedGasPriceLow<SigningKeyStore>
    | TrxMayTakeLongToProceedPriorityFeeLow<SigningKeyStore>
    | NonceRangeErrorLessThanCurrent
    | NonceRangeErrorBiggerThanCurrent<SigningKeyStore>
    | TrxLikelyToFail<SigningKeyStore>
    | TrxWillFailLessThenMinimumGas
    | PollableErroredAndUserDidNotSelectedCustomPreset
    | PollableDataLoading

export const validateSubmit = ({
    pollableData,
    keystore,
    transactionRequest,
    simulationResult,
    nonce,
    gasEstimate,
}: {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    simulationResult: SimulationResult
    nonce: number
    gasEstimate: string
    transactionRequest: NotSigned
    keystore: KeyStore
}): Result<
    SubmitValidationError,
    {
        simulated: Simulated
        keystore: SigningKeyStore
    }
> => {
    switch (keystore.type) {
        case 'private_key_store':
        case 'ledger':
        case 'secret_phrase_key':
        case 'safe_4337':
        case 'trezor': {
            switch (pollableData.type) {
                case 'loading':
                    return failure({ type: 'pollable_data_loading' })
                case 'loaded':
                case 'reloading':
                case 'subsequent_failed':
                    return validateNotEnoughBalance({
                        pollable: pollableData,
                        transactionRequest: transactionRequest.rpcRequest,
                    })
                        .andThen(() =>
                            validateTrxWillFailLessThenMinimumGas({
                                pollable: pollableData,
                                gasEstimate,
                            })
                        )
                        .andThen(() =>
                            validateTrxLikelyToFail({
                                pollable: pollableData,
                                transactionRequest,
                                simulationResult,
                                keystore,
                                gasEstimate,
                                nonce,
                            })
                        )
                        .andThen(() =>
                            validateNonceRangeErrorLessThanCurrent({
                                nonce,
                                pollableData,
                            })
                        )
                        .andThen(() =>
                            validateNonceRangeErrorBiggerThanCurrent({
                                simulationResult,
                                nonce,
                                gasEstimate,
                                keystore,
                                transactionRequest,
                                pollableData,
                            })
                        )
                        .andThen(() =>
                            validateSimulationFailedSafetyChecks({
                                simulationResult,
                                gasEstimate,
                                keystore,
                                nonce,
                                pollable: pollableData,
                                transactionRequest,
                            })
                        )
                        .andThen(() =>
                            validateSafetyCheckAndFeeValidationError({
                                pollable: pollableData,
                                transactionRequest,
                                simulationResult,
                                nonce,
                                gasEstimate,
                                keystore,
                            })
                        )
                        .andThen(() =>
                            validateTrxMayTakeLongToProceedBaseFeeLow({
                                pollable: pollableData,
                                transactionRequest,
                                simulationResult,
                                nonce,
                                gasEstimate,
                                keystore,
                            })
                        )
                        .andThen(() =>
                            validateTrxMayTakeLongToProceedGasPriceLow({
                                pollable: pollableData,
                                transactionRequest,
                                simulationResult,
                                nonce,
                                gasEstimate,
                                keystore,
                            })
                        )
                        .andThen(() =>
                            validateTrxMayTakeLongToProceedPriorityFeeLow({
                                pollable: pollableData,
                                transactionRequest,
                                simulationResult,
                                nonce,
                                gasEstimate,
                                keystore,
                            })
                        )
                        .andThen(() =>
                            validateSafetyChecks({
                                pollable: pollableData,
                                transactionRequest,
                                simulationResult,
                                nonce,
                                gasEstimate,
                                keystore,
                            })
                        )
                        .map(() => {
                            return {
                                simulated: {
                                    state: 'simulated',
                                    networkHexId:
                                        transactionRequest.networkHexId,
                                    account: transactionRequest.account,
                                    dApp: transactionRequest.dApp,
                                    rpcRequest: transactionRequest.rpcRequest,
                                    simulation: simulationResult,
                                    gasEstimate,
                                    selectedFee: getCurrentFee({
                                        pollable: pollableData,
                                    }),
                                    selectedGas: pollableData.params.gasLimit,
                                    selectedNonce: getNonce(
                                        pollableData,
                                        nonce
                                    ),
                                },
                                keystore,
                            }
                        })

                case 'error':
                    switch (pollableData.params.selectedPreset.type) {
                        case 'Slow':
                        case 'Normal':
                        case 'Fast':
                            return failure({
                                type: 'pollable_errored_and_user_did_not_selected_custom_preset',
                            })
                        case 'Custom':
                            return success({
                                simulated: {
                                    state: 'simulated',
                                    networkHexId:
                                        transactionRequest.networkHexId,
                                    account: transactionRequest.account,
                                    dApp: transactionRequest.dApp,
                                    rpcRequest: transactionRequest.rpcRequest,
                                    simulation: simulationResult,
                                    gasEstimate,
                                    selectedFee:
                                        pollableData.params.selectedPreset.fee,
                                    selectedGas: pollableData.params.gasLimit,
                                    selectedNonce:
                                        pollableData.params.selectedPreset.fee
                                            .nonce,
                                },
                                keystore,
                            })
                        /* istanbul ignore next */
                        default:
                            return notReachable(
                                pollableData.params.selectedPreset
                            )
                    }
                /* istanbul ignore next */
                default:
                    return notReachable(pollableData)
            }
        }

        case 'track_only':
            return failure({ type: 'import_private_keys_required' })

        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}

export type UserConfirmationRequired =
    | SafetyCheckFailed
    | SafetyCheckAndFeeValidationError
    | TrxMayTakeLongToProceedBaseFeeLow<SigningKeyStore>
    | TrxMayTakeLongToProceedGasPriceLow<SigningKeyStore>
    | TrxMayTakeLongToProceedPriorityFeeLow<SigningKeyStore>
    | TrxLikelyToFail<SigningKeyStore>
    | NonceRangeErrorBiggerThanCurrent<SigningKeyStore>
    | SimulationFailedSafetyChecks<SigningKeyStore>

// helpers

const getCurrentFee = ({
    pollable,
}: {
    pollable: LoadedPollable
}): EstimatedFee | components['schemas']['CustomPresetRequestFee'] => {
    switch (pollable.params.selectedPreset.type) {
        case 'Slow':
            return pollable.data.slow
        case 'Normal':
            return pollable.data.normal
        case 'Fast':
            return pollable.data.fast
        case 'Custom':
            return pollable.data.custom || pollable.params.selectedPreset.fee
        /* istanbul ignore next */
        default:
            return notReachable(pollable.params.selectedPreset)
    }
}
