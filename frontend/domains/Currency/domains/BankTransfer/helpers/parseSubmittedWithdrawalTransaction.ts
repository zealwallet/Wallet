import {
    match,
    nullableOf,
    number,
    object,
    oneOf,
    recordStrict,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'
import { parse as parseCurrency } from '@zeal/domains/Currency/helpers/parse'
import { parse as parseMoney } from '@zeal/domains/Money/helpers/parse'

const parseUnblockTransferFee = (input: unknown) =>
    object(input).andThen((obj) =>
        shape({
            amount: parseMoney(obj.amount),
            percentageFee: number(obj.percentageFee),
        })
    )

const parseCompleteWithdrawalRequest = (input: unknown) =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'full_withdrawal_request' as const),
            knownCurrencies: object(obj.knownCurrencies).andThen((currencies) =>
                recordStrict(currencies, {
                    keyParser: string,
                    valueParser: parseCurrency,
                })
            ),
            fromAmount: parseMoney(obj.fromAmount),
            toAmount: parseMoney(obj.toAmount),
            fee: nullableOf(obj.fee, parseUnblockTransferFee),
        })
    )

const parseIncompleteWithdrawalRequest = (input: unknown) =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'incomplete_withdrawal_request' as const),
            knownCurrencies: object(obj.knownCurrencies).andThen((currencies) =>
                recordStrict(currencies, {
                    keyParser: string,
                    valueParser: parseCurrency,
                })
            ),
            fromAmount: parseMoney(obj.fromAmount),
            currencyId: string(obj.currencyId),
        })
    )

export const parseSubmittedOfframpTransaction = (
    input: unknown
): Result<unknown, SubmittedOfframpTransaction> =>
    object(input).andThen((obj) =>
        shape({
            transactionHash: string(obj.transactionHash),
            withdrawalRequest: oneOf(obj.withdrawalRequest, [
                parseCompleteWithdrawalRequest(obj.withdrawalRequest),
                parseIncompleteWithdrawalRequest(obj.withdrawalRequest),
            ]),
        })
    )
