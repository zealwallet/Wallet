/**
 * TODO Add RPC errors captured in sentry
 *
 * for code -32000 there are several types of messages
 *      cannot query unfinalized data
 *      invalid transaction: exceeds block gas limit
 *
 *      max fee per gas less than block base fee: address %_address_%, maxFeePerGas: 100000000 baseFee: 137150000
 *
 *      insufficient funds for gas * price + value
 *      invalid transaction: insufficient funds for gas * price + value
 *
 *      transaction underpriced
 *
 *      intrinsic gas too low
 */

import { NetworkHexId } from '@zeal/domains/Network'

export type RPCError =
    | ReplacementTransactionUnderpriced
    | NounceIsTooLow
    | TxPoolDisabled
    | CannotQueryUnfinalizedData
    | GasRequiredExceedsAllowance
    | InsufficientBalanceForTransfer
    | InsufficientFundsForGasAndValue
    | GasPriceIsLessThanMinimum
    | MaxFeePerGasLessThanBlockBaseFee
    | TransactionUnderpriced
    | ExecutionReverted
    | InvalidArgument
    | UnknownRPCError

export type UnknownRPCError = {
    type: 'rpc_error_unknown'
    payload: unknown
}

export type InvalidArgument = {
    type: 'rpc_error_invalid_argument'
    payload: object
}

export type TxPoolDisabled = {
    type: 'rpc_error_tx_pool_disabled'
    payload: object
}

export type CannotQueryUnfinalizedData = {
    type: 'rpc_error_cannot_query_unfinalized_data'
    payload: object
}

export type GasRequiredExceedsAllowance = {
    type: 'rpc_error_gas_required_exceeds_allowance'
    payload: object
}

export type InsufficientBalanceForTransfer = {
    type: 'rpc_error_insufficient_balance_for_transfer'
    payload: object
}

export type InsufficientFundsForGasAndValue = {
    type: 'rpc_error_insufficient_funds_for_gas_and_value'
    payload: object
}

export type GasPriceIsLessThanMinimum = {
    type: 'rpc_error_gas_price_is_less_than_minimum'
    payload: object
}

export type MaxFeePerGasLessThanBlockBaseFee = {
    type: 'rpc_error_max_fee_per_gas_less_than_block_base_fee'
    payload: object
}

export type TransactionUnderpriced = {
    type: 'rpc_error_transaction_underpriced'
    payload: object
}

export type ExecutionReverted = {
    type: 'rpc_error_execution_reverted'
    payload: object
}

export type NounceIsTooLow = {
    type: 'rpc_error_nounce_is_too_low'
    payload: object
}

export type ReplacementTransactionUnderpriced = {
    type: 'rpc_error_replacement_transaction_underpriced'
    payload: object
}

export class RPCResponseError<T extends RPCError = RPCError> extends Error {
    isRPCResponseError = true
    name = 'RPCResponseError' as const
    networkHexId: NetworkHexId
    type: T['type']
    payload: T['payload']

    constructor(error: T, networkHexId: NetworkHexId) {
        super()
        this.payload = error.payload
        this.type = error.type
        this.networkHexId = networkHexId
    }
}
