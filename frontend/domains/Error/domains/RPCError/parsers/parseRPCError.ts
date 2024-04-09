import { notReachable } from '@zeal/toolkit'
import {
    failure,
    match,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { parseUnexpectedFailureError } from '@zeal/domains/Error/parsers/parseUnexpectedFailureError'

import {
    CannotQueryUnfinalizedData,
    ExecutionReverted,
    GasPriceIsLessThanMinimum,
    GasRequiredExceedsAllowance,
    InsufficientBalanceForTransfer,
    InsufficientFundsForGasAndValue,
    InvalidArgument,
    MaxFeePerGasLessThanBlockBaseFee,
    NounceIsTooLow,
    ReplacementTransactionUnderpriced,
    RPCError,
    RPCResponseError,
    TransactionUnderpriced,
    TxPoolDisabled,
    UnknownRPCError,
} from '../RPCError'

const startsWith = (
    input: string,
    shouldStartWith: string
): Result<
    {
        type: 'does_not_start_with_correct_string'
        required: string
        actual: string
    },
    string
> =>
    input.toLowerCase().startsWith(shouldStartWith.toLowerCase())
        ? success(input)
        : failure({
              type: 'does_not_start_with_correct_string',
              actual: input,
              required: shouldStartWith,
          })

const stringStartsWith = (
    input: unknown,
    shouldStartWith: string
): Result<unknown, string> =>
    string(input).andThen((str) => startsWith(str, shouldStartWith))

const parseReplacementTransactionUnderpriced = (
    input: unknown
): Result<unknown, ReplacementTransactionUnderpriced> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(
                    obj.message,
                    'replacement transaction underpriced'
                ),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_replacement_transaction_underpriced',
            payload,
        }))

const parseNounceIsTooLow = (input: unknown): Result<unknown, NounceIsTooLow> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(obj.message, 'nonce too low'),
            })
        )
        .map((payload) => ({ type: 'rpc_error_nounce_is_too_low', payload }))

const parseCannotQueryUnfinalizedData = (
    input: unknown
): Result<unknown, CannotQueryUnfinalizedData> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(
                    obj.message,
                    'cannot query unfinalized data'
                ),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_cannot_query_unfinalized_data',
            payload,
        }))

const parseExecutionReverted = (
    input: unknown
): Result<unknown, ExecutionReverted> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: oneOf(obj.code, [
                    match(obj.code, -32000),
                    match(obj.code, 3),
                ]),
                message: stringStartsWith(obj.message, 'execution reverted'),
            })
        )
        .map((payload) => ({ type: 'rpc_error_execution_reverted', payload }))

const parseGasPriceIsLessThanMinimum = (
    input: unknown
): Result<unknown, GasPriceIsLessThanMinimum> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(
                    obj.message,
                    'gasprice is less than gas price minimum floor'
                ),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_gas_price_is_less_than_minimum',
            payload,
        }))

const praseGasRequiredExceedsAllowance = (
    input: unknown
): Result<unknown, GasRequiredExceedsAllowance> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(
                    obj.message,
                    'gas required exceeds allowance'
                ),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_gas_required_exceeds_allowance',
            payload,
        }))

const praseInsufficientBalanceForTransfer = (
    input: unknown
): Result<unknown, InsufficientBalanceForTransfer> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: oneOf(obj.message, [
                    stringStartsWith(
                        obj.message,
                        'insufficient balance for transfer'
                    ),
                    stringStartsWith(
                        obj.message,
                        'insufficient funds for transfer'
                    ),
                ]),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_insufficient_balance_for_transfer',
            payload,
        }))

const parseInsufficientFundsForGasAndValue = (
    input: unknown
): Result<unknown, InsufficientFundsForGasAndValue> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: oneOf(obj.message, [
                    stringStartsWith(
                        obj.message,
                        'insufficient funds for gas * price + value'
                    ),
                    stringStartsWith(
                        obj.message,
                        'insufficient funds for gas + value'
                    ),
                ]),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_insufficient_funds_for_gas_and_value',
            payload,
        }))

const parseMaxFeePerGasLessThanBlockBaseFee = (
    input: unknown
): Result<unknown, MaxFeePerGasLessThanBlockBaseFee> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(
                    obj.message,
                    'max fee per gas less than block base fee'
                ),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_max_fee_per_gas_less_than_block_base_fee',
            payload,
        }))

const parseTransactionUnderpriced = (
    input: unknown
): Result<unknown, TransactionUnderpriced> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(
                    obj.message,
                    'transaction underpriced'
                ),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_transaction_underpriced',
            payload,
        }))

const parseTxPoolDisabled = (input: unknown): Result<unknown, TxPoolDisabled> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32000),
                message: stringStartsWith(obj.message, 'TxPool Disabled'),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_tx_pool_disabled',
            payload,
        }))

const parseInvalidArgument = (
    input: unknown
): Result<unknown, InvalidArgument> =>
    object(input)
        .andThen((obj) =>
            shape({
                code: match(obj.code, -32602),
                message: stringStartsWith(obj.message, 'invalid argument'),
            })
        )
        .map((payload) => ({
            type: 'rpc_error_invalid_argument',
            payload,
        }))

const parseUnknown = (input: unknown): Result<unknown, UnknownRPCError> =>
    success({
        type: 'rpc_error_unknown' as const,
        payload: input,
    })

const parserForError: RPCError['type'] =
    'rpc_error_replacement_transaction_underpriced' as any as RPCError['type']

switch (parserForError) {
    case 'rpc_error_replacement_transaction_underpriced':
    case 'rpc_error_nounce_is_too_low':
    case 'rpc_error_tx_pool_disabled':
    case 'rpc_error_cannot_query_unfinalized_data':
    case 'rpc_error_gas_required_exceeds_allowance':
    case 'rpc_error_insufficient_balance_for_transfer':
    case 'rpc_error_insufficient_funds_for_gas_and_value':
    case 'rpc_error_gas_price_is_less_than_minimum':
    case 'rpc_error_max_fee_per_gas_less_than_block_base_fee':
    case 'rpc_error_transaction_underpriced':
    case 'rpc_error_execution_reverted':
    case 'rpc_error_invalid_argument':
    case 'rpc_error_unknown':
        // update parseRPCErrorPayload below 👇
        break
    /* istanbul ignore next */
    default:
        notReachable(parserForError)
}

export const parseRPCErrorPayload = (
    input: unknown
): Result<unknown, RPCError> =>
    oneOf(input, [
        oneOf(input, [
            parseReplacementTransactionUnderpriced(input),
            parseNounceIsTooLow(input),
            parseCannotQueryUnfinalizedData(input),
            parseExecutionReverted(input),
            parseGasPriceIsLessThanMinimum(input),
            praseGasRequiredExceedsAllowance(input),
            parseTxPoolDisabled(input),
            parseInvalidArgument(input),
            parseTransactionUnderpriced(input),
            parseMaxFeePerGasLessThanBlockBaseFee(input),
        ]),
        oneOf(input, [
            parseInsufficientFundsForGasAndValue(input),
            praseInsufficientBalanceForTransfer(input),
        ]),
        parseUnknown(input),
    ])

export const parseRPCError = (input: unknown) =>
    parseUnexpectedFailureError(input)
        .map((error) => error.error.reason)
        .andThen((reason) =>
            reason instanceof RPCResponseError && reason.isRPCResponseError
                ? success(reason)
                : failure({
                      type: 'not_rpc_response_error',
                      payload: reason,
                  })
        )
