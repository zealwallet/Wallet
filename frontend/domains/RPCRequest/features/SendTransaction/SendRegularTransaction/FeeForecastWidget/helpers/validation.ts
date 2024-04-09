import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { failure, Result, shape, success } from '@zeal/toolkit/Result'

import { ImperativeError } from '@zeal/domains/Error'
import { KeyStore } from '@zeal/domains/KeyStore'
import { GAS_MULTIPLIER } from '@zeal/domains/RPCRequest/constants'
import { NotSigned, Simulated } from '@zeal/domains/TransactionRequest'
import {
    NotEnoughBalance,
    validateNotEnoughBalance,
} from '@zeal/domains/TransactionRequest/helpers/validateNotEnoughBalance'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { CANCEL_GAS_AMOUNT } from '@zeal/domains/Transactions/constants'
import { EstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { getSuggestedGasLimit } from '@zeal/domains/Transactions/helpers/getSuggestedGasLimit'

import { getNonce } from '../../helpers/getNonce'

type LoadedPollable = Extract<
    PollableData<FeeForecastResponse, FeeForecastRequest>,
    { type: 'loaded' | 'reloading' | 'subsequent_failed' }
>

export type TrxMayTakeLongToProceedBaseFeeLow<T extends KeyStore> = {
    type: 'trx_may_take_long_to_proceed_base_fee_low'
    suggestedMaxBaseFee: string
    simulated: Simulated
    keystore: T
    pollable: LoadedPollable
}

export const validateTrxMayTakeLongToProceedBaseFeeLow = <T extends KeyStore>({
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
    keystore: T
}): Result<TrxMayTakeLongToProceedBaseFeeLow<T>, unknown> => {
    // we validate fee only when user selects them

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
    const feeForecastRequest = pollable.params
    const feeForecastResponse = pollable.data

    switch (feeForecastRequest.selectedPreset.type) {
        case 'Slow':
        case 'Normal':
        case 'Fast':
            return success(undefined)
        case 'Custom':
            switch (feeForecastRequest.selectedPreset.fee.type) {
                case 'LegacyCustomPresetRequestFee':
                    return success(undefined) // we don't validate legacy fee here
                case 'Eip1559CustomPresetRequestFee':
                    switch (feeForecastResponse.type) {
                        case 'FeesForecastResponseLegacyFee':
                            throw new ImperativeError(
                                'we got Eip1559CustomPresetRequestFee specified by user but in response from BE we get FeesForecastResponseLegacyFee'
                            )
                        case 'FeesForecastResponseEip1559Fee':
                            if (
                                BigInt(
                                    feeForecastRequest.selectedPreset.fee
                                        .maxBaseFee
                                ) <
                                BigInt(feeForecastResponse.networkState.baseFee)
                            ) {
                                return failure({
                                    type: 'trx_may_take_long_to_proceed_base_fee_low',
                                    suggestedMaxBaseFee:
                                        feeForecastResponse.networkState
                                            .baseFee,
                                    keystore,
                                    pollable,
                                    simulated: simulatedTrx,
                                })
                            }
                            return success(undefined)
                        /* istanbul ignore next */
                        default:
                            return notReachable(feeForecastResponse)
                    }

                /* istanbul ignore next */
                default:
                    return notReachable(feeForecastRequest.selectedPreset.fee)
            }

        /* istanbul ignore next */
        default:
            return notReachable(feeForecastRequest.selectedPreset)
    }
}

export type TrxMayTakeLongToProceedPriorityFeeLow<T extends KeyStore> = {
    type: 'trx_may_take_long_to_proceed_priority_fee_low'
    suggestedPriorityFee: string
    simulated: Simulated
    keystore: T
    pollable: Extract<
        PollableData<FeeForecastResponse, FeeForecastRequest>,
        { type: 'loaded' | 'reloading' | 'subsequent_failed' }
    >
}

export const validateTrxMayTakeLongToProceedPriorityFeeLow = <
    T extends KeyStore
>({
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
    keystore: T
}): Result<TrxMayTakeLongToProceedPriorityFeeLow<T>, unknown> => {
    // we validate fee only when user selects them

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
    const feeForecastRequest = pollable.params
    const feeForecastResponse = pollable.data

    switch (feeForecastRequest.selectedPreset.type) {
        case 'Slow':
        case 'Normal':
        case 'Fast':
            return success(undefined)
        case 'Custom':
            switch (feeForecastRequest.selectedPreset.fee.type) {
                case 'LegacyCustomPresetRequestFee':
                    return success(undefined) // we don't validate legacy fee here
                case 'Eip1559CustomPresetRequestFee':
                    switch (feeForecastResponse.type) {
                        case 'FeesForecastResponseLegacyFee':
                            throw new ImperativeError(
                                'we got Eip1559CustomPresetRequestFee specified by user but in response from BE we get FeesForecastResponseLegacyFee'
                            )
                        case 'FeesForecastResponseEip1559Fee':
                            if (
                                BigInt(
                                    feeForecastRequest.selectedPreset.fee
                                        .maxPriorityFee
                                ) <
                                BigInt(
                                    feeForecastResponse.networkState
                                        .minPriorityFee
                                )
                            ) {
                                return failure({
                                    type: 'trx_may_take_long_to_proceed_priority_fee_low',
                                    suggestedPriorityFee:
                                        feeForecastResponse.fast
                                            .maxPriorityFeePerGas,
                                    keystore,
                                    pollable,
                                    simulated: simulatedTrx,
                                })
                            }
                            return success(undefined)
                        /* istanbul ignore next */
                        default:
                            return notReachable(feeForecastResponse)
                    }

                /* istanbul ignore next */
                default:
                    return notReachable(feeForecastRequest.selectedPreset.fee)
            }

        /* istanbul ignore next */
        default:
            return notReachable(feeForecastRequest.selectedPreset)
    }
}

export type TrxMayTakeLongToProceedGasPriceLow<T extends KeyStore> = {
    type: 'trx_may_take_long_to_proceed_gas_price_low'
    suggestedGasPrice: string
    simulated: Simulated
    keystore: T
    pollable: Extract<
        PollableData<FeeForecastResponse, FeeForecastRequest>,
        { type: 'loaded' | 'reloading' | 'subsequent_failed' }
    >
}

export const validateTrxMayTakeLongToProceedGasPriceLow = <T extends KeyStore>({
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
    keystore: T
}): Result<TrxMayTakeLongToProceedGasPriceLow<T>, unknown> => {
    // we validate fee only when user selects them

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
    const feeForecastRequest = pollable.params
    const feeForecastResponse = pollable.data

    switch (feeForecastRequest.selectedPreset.type) {
        case 'Slow':
        case 'Normal':
        case 'Fast':
            return success(undefined)
        case 'Custom':
            switch (feeForecastRequest.selectedPreset.fee.type) {
                case 'LegacyCustomPresetRequestFee':
                    switch (feeForecastResponse.type) {
                        case 'FeesForecastResponseLegacyFee':
                            if (
                                BigInt(
                                    feeForecastRequest.selectedPreset.fee
                                        .gasPrice
                                ) <
                                BigInt(
                                    feeForecastResponse.networkState.minGasPrice
                                )
                            ) {
                                return failure({
                                    type: 'trx_may_take_long_to_proceed_gas_price_low',
                                    suggestedGasPrice:
                                        feeForecastResponse.fast.gasPrice,
                                    keystore,
                                    pollable,
                                    simulated: simulatedTrx,
                                })
                            }
                            return success(undefined)

                        case 'FeesForecastResponseEip1559Fee':
                            throw new ImperativeError(
                                'we got FeesForecastResponseLegacyFee specified by user but in response from BE we get FeesForecastResponseEip1559Fee'
                            )
                        /* istanbul ignore next */
                        default:
                            return notReachable(feeForecastResponse)
                    }
                case 'Eip1559CustomPresetRequestFee':
                    return success(undefined) // we don't validate Eip1559CustomPresetRequestFee fee here

                /* istanbul ignore next */
                default:
                    return notReachable(feeForecastRequest.selectedPreset.fee)
            }

        /* istanbul ignore next */
        default:
            return notReachable(feeForecastRequest.selectedPreset)
    }
}

export type TrxLikelyToFail<T extends KeyStore> = {
    type: 'trx_likely_to_fail'
    reason: 'less_than_estimated_gas' | 'less_than_suggested_gas'
    suggestedGasLimit: string
    pollable: LoadedPollable
    keystore: T
    simulated: Simulated
}

export type TrxWillFailLessThenMinimumGas = {
    type: 'trx_will_fail_less_then_minimum_gas'
    suggestedGasLimit: string
    pollable: LoadedPollable
}

export const validateTrxWillFailLessThenMinimumGas = ({
    pollable,
    gasEstimate,
}: {
    pollable: LoadedPollable
    gasEstimate: string
}): Result<TrxWillFailLessThenMinimumGas, unknown> => {
    const currentGas = BigInt(pollable.params.gasLimit)
    return currentGas < BigInt(CANCEL_GAS_AMOUNT)
        ? failure({
              type: 'trx_will_fail_less_then_minimum_gas',
              pollable,
              suggestedGasLimit: getSuggestedGasLimit(gasEstimate),
          })
        : success({})
}

export const validateTrxLikelyToFail = <T extends KeyStore>({
    pollable,
    simulationResult,
    transactionRequest,
    nonce,
    gasEstimate,
    keystore,
}: {
    transactionRequest: NotSigned
    pollable: LoadedPollable
    simulationResult: SimulationResult
    nonce: number
    gasEstimate: string
    keystore: T
}): Result<TrxLikelyToFail<T>, unknown> => {
    switch (simulationResult.type) {
        case 'failed':
        case 'not_supported':
            return success({})

        case 'simulated': {
            switch (simulationResult.simulation.transaction.type) {
                case 'FailedTransaction':
                    return success({})
                case 'ApprovalTransaction':
                case 'UnknownTransaction':
                case 'SingleNftApprovalTransaction':
                case 'NftCollectionApprovalTransaction':
                case 'P2PTransaction':
                case 'P2PNftTransaction':
                case 'BridgeTrx':
                case 'WithdrawalTrx':
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
                    const simulated = parseInt(gasEstimate, 16)
                    const suggested = simulated * GAS_MULTIPLIER
                    const selected = parseInt(pollable.params.gasLimit, 16)
                    if (selected < simulated) {
                        return failure({
                            type: 'trx_likely_to_fail',
                            reason: 'less_than_estimated_gas',
                            suggestedGasLimit:
                                getSuggestedGasLimit(gasEstimate),
                            pollable,
                            keystore,
                            simulated: simulatedTrx,
                        })
                    }

                    if (selected < suggested) {
                        return failure({
                            type: 'trx_likely_to_fail',
                            reason: 'less_than_suggested_gas',
                            suggestedGasLimit:
                                getSuggestedGasLimit(gasEstimate),
                            pollable,
                            keystore,
                            simulated: simulatedTrx,
                        })
                    }

                    return success({})

                /* istanbul ignore next */
                default:
                    return notReachable(simulationResult.simulation.transaction)
            }
        }

        /* istanbul ignore next */
        default:
            return notReachable(simulationResult)
    }
}

export type NonceRangeErrorLessThanCurrent = {
    type: 'nonce_range_error_less_than_current'
    pollable: LoadedPollable
}

export type NonceRangeErrorBiggerThanCurrent<T extends KeyStore> = {
    type: 'nonce_range_error_bigger_than_current'
    keystore: T
    simulated: Simulated
    pollable: LoadedPollable
}

export const validateNonceRangeErrorBiggerThanCurrent = <T extends KeyStore>({
    pollableData,
    simulationResult,
    keystore,
    transactionRequest,
    nonce,
    gasEstimate,
}: {
    pollableData: LoadedPollable
    simulationResult: SimulationResult
    nonce: number
    gasEstimate: string
    keystore: T
    transactionRequest: NotSigned
}): Result<NonceRangeErrorBiggerThanCurrent<T>, unknown> => {
    switch (pollableData.params.selectedPreset.type) {
        case 'Slow':
        case 'Normal':
        case 'Fast':
            return success(undefined)
        case 'Custom':
            const simulatedTrx: Simulated = {
                state: 'simulated',
                networkHexId: transactionRequest.networkHexId,
                account: transactionRequest.account,
                dApp: transactionRequest.dApp,
                rpcRequest: transactionRequest.rpcRequest,
                simulation: simulationResult,
                gasEstimate,
                selectedFee: getCurrentFee({ pollable: pollableData }),
                selectedGas: pollableData.params.gasLimit,
                selectedNonce: getNonce(pollableData, nonce),
            }
            const currentNonce = pollableData.params.selectedPreset.fee.nonce

            if (currentNonce > nonce) {
                return failure({
                    type: 'nonce_range_error_bigger_than_current',
                    keystore,
                    pollable: pollableData,
                    reason: 'bigger_than_current',
                    simulated: simulatedTrx,
                })
            }

            return success(undefined)

        /* istanbul ignore next */
        default:
            return notReachable(pollableData.params.selectedPreset)
    }
}

export const validateNonceRangeErrorLessThanCurrent = ({
    pollableData,
    nonce,
}: {
    pollableData: LoadedPollable
    nonce: number
}): Result<NonceRangeErrorLessThanCurrent, unknown> => {
    switch (pollableData.params.selectedPreset.type) {
        case 'Slow':
        case 'Normal':
        case 'Fast':
            return success(undefined)
        case 'Custom':
            const currentNonce = pollableData.params.selectedPreset.fee.nonce

            if (currentNonce < nonce) {
                return failure({
                    type: 'nonce_range_error_less_than_current',
                    pollable: pollableData,
                })
            }

            return success(undefined)

        /* istanbul ignore next */
        default:
            return notReachable(pollableData.params.selectedPreset)
    }
}

export type PollableDataLoading = {
    type: 'pollable_data_loading'
}

export type PollableErroredAndUserDidNotSelectedCustomPreset = {
    type: 'pollable_errored_and_user_did_not_selected_custom_preset'
}

export type PollableErrored = {
    type: 'pollable_failed_to_fetch'
    error: unknown
}

export type WidgetValidationError =
    | NonceRangeErrorBiggerThanCurrent<KeyStore>
    | NonceRangeErrorLessThanCurrent
    | NotEnoughBalance
    | PollableDataLoading
    | PollableErrored
    | TrxWillFailLessThenMinimumGas
    | TrxLikelyToFail<KeyStore>
    | TrxMayTakeLongToProceedBaseFeeLow<KeyStore>
    | TrxMayTakeLongToProceedGasPriceLow<KeyStore>
    | TrxMayTakeLongToProceedPriorityFeeLow<KeyStore>

export const validateEditFeeWidget = ({
    pollableData,
    simulationResult,
    nonce,
    transactionRequest,
    gasEstimate,
    keystore,
}: {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    simulationResult: SimulationResult
    nonce: number
    gasEstimate: string
    transactionRequest: NotSigned
    keystore: KeyStore
}): Result<
    WidgetValidationError,
    {
        pollable: Extract<
            PollableData<FeeForecastResponse, FeeForecastRequest>,
            { type: 'loaded' | 'reloading' | 'subsequent_failed' }
        >
    }
> => {
    switch (pollableData.type) {
        case 'loading':
            return failure({
                type: 'pollable_data_loading',
            })
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return validateNonceRangeErrorBiggerThanCurrent({
                pollableData,
                keystore,
                simulationResult,
                nonce,
                transactionRequest,
                gasEstimate,
            })
                .andThen(() =>
                    validateNonceRangeErrorLessThanCurrent({
                        pollableData,
                        nonce,
                    })
                )
                .andThen(() =>
                    validateNotEnoughBalance({
                        pollable: pollableData,
                        transactionRequest: transactionRequest.rpcRequest,
                    })
                )
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
                    validateTrxMayTakeLongToProceedGasPriceLow({
                        pollable: pollableData,
                        transactionRequest,
                        simulationResult,
                        nonce,
                        gasEstimate: gasEstimate,
                        keystore,
                    })
                )
                .map(() => ({ pollable: pollableData }))

        case 'error':
            return failure({
                type: 'pollable_failed_to_fetch',
                error: pollableData.error,
            })
        /* istanbul ignore next */
        default:
            return notReachable(pollableData)
    }
}

export type EditFormHeaderValidationError =
    | NotEnoughBalance
    | PollableErrored
    | PollableDataLoading

export const validateEditFormHeaderValidationError = ({
    pollableData,
    transactionRequest,
}: {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    transactionRequest: NotSigned
}): Result<
    EditFormHeaderValidationError,
    {
        pollable: Extract<
            PollableData<FeeForecastResponse, FeeForecastRequest>,
            { type: 'loaded' | 'reloading' | 'subsequent_failed' }
        >
    }
> => {
    switch (pollableData.type) {
        case 'loading':
            return failure({ type: 'pollable_data_loading' })
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return validateNotEnoughBalance({
                pollable: pollableData,
                transactionRequest: transactionRequest.rpcRequest,
            }).map(() => {
                return {
                    pollable: pollableData,
                }
            })
        case 'error':
            return failure({
                type: 'pollable_failed_to_fetch',
                error: pollableData.error,
            })
        /* istanbul ignore next */
        default:
            return notReachable(pollableData)
    }
}

export type EditFormPresetValidationError =
    | PollableErrored
    | PollableDataLoading

export const validateEditFormPresetValidationError = ({
    pollableData,
}: {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    transactionRequest: NotSigned
}): Result<
    EditFormPresetValidationError,
    {
        pollable: LoadedPollable
    }
> => {
    switch (pollableData.type) {
        case 'loading':
            return failure({
                type: 'pollable_data_loading',
            })
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return success({ pollable: pollableData })
        case 'error':
            return failure({
                type: 'pollable_failed_to_fetch',
                error: pollableData.error,
            })
        /* istanbul ignore next */
        default:
            return notReachable(pollableData)
    }
}

export type EditFormCustomPresetValidationError = {
    maxBaseFee?: TrxMayTakeLongToProceedBaseFeeLow<KeyStore> | PollableErrored
    priorityFee?:
        | TrxMayTakeLongToProceedPriorityFeeLow<KeyStore>
        | PollableErrored
    gasPrice?: TrxMayTakeLongToProceedGasPriceLow<KeyStore> | PollableErrored
    gasLimit?: TrxLikelyToFail<KeyStore> | TrxWillFailLessThenMinimumGas
    nonce?:
        | NonceRangeErrorBiggerThanCurrent<KeyStore>
        | NonceRangeErrorLessThanCurrent
}

export const validateEditFormCustomPresetValidationError = ({
    pollableData,
    transactionRequest,
    simulationResult,
    nonce,
    gasEstimate,
    keystore,
}: {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    simulationResult: SimulationResult
    nonce: number
    gasEstimate: string
    transactionRequest: NotSigned
    keystore: KeyStore
}): Result<EditFormCustomPresetValidationError, null> => {
    // TODO :: we need to disjoint this type and use fair type
    switch (pollableData.type) {
        // we don't show any error on gas limit and nonce
        case 'loading':
            return success(null)
        case 'error':
            return failure({
                maxBaseFee: {
                    type: 'pollable_failed_to_fetch',
                    error: pollableData.error,
                },
                priorityFee: {
                    type: 'pollable_failed_to_fetch',
                    error: pollableData.error,
                },
                gasPrice: {
                    type: 'pollable_failed_to_fetch',
                    error: pollableData.error,
                },
            })

        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return shape({
                maxBaseFee: validateTrxMayTakeLongToProceedBaseFeeLow({
                    pollable: pollableData,
                    transactionRequest,
                    keystore,
                    simulationResult,
                    gasEstimate,
                    nonce,
                }),
                priorityFee: validateTrxMayTakeLongToProceedPriorityFeeLow({
                    pollable: pollableData,
                    transactionRequest,
                    keystore,
                    simulationResult,
                    nonce,
                    gasEstimate,
                }),
                gasPrice: validateTrxMayTakeLongToProceedGasPriceLow({
                    pollable: pollableData,
                    transactionRequest,
                    keystore,
                    simulationResult,
                    nonce,
                    gasEstimate,
                }),
                gasLimit: validateTrxWillFailLessThenMinimumGas({
                    pollable: pollableData,
                    gasEstimate,
                }).andThen(() =>
                    validateTrxLikelyToFail({
                        pollable: pollableData,
                        transactionRequest,
                        simulationResult,
                        nonce,
                        gasEstimate,
                        keystore,
                    })
                ),
                nonce: validateNonceRangeErrorBiggerThanCurrent({
                    pollableData,
                    keystore,
                    simulationResult,
                    nonce,
                    gasEstimate,
                    transactionRequest,
                }).andThen(() =>
                    validateNonceRangeErrorLessThanCurrent({
                        pollableData,
                        nonce,
                    })
                ),
            }).map(() => null)

        /* istanbul ignore next */
        default:
            return notReachable(pollableData)
    }
}

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
