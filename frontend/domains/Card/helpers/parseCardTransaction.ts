import {
    bigint,
    failure,
    match,
    number,
    numberString,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import {
    CardPayment,
    CardTransaction,
    MerchantInfo,
    Refund,
    Reversal,
} from '@zeal/domains/Card'
import { FIAT_CURRENCIES } from '@zeal/domains/Currency/constants'
import { parseFiatCurrencyCode } from '@zeal/domains/Currency/helpers/parse'
import { FiatMoney } from '@zeal/domains/Money'

const parseMerchantInfo = (trx: unknown): Result<unknown, MerchantInfo> =>
    object(trx).andThen((obj) =>
        shape({
            name: object(obj.merchant)
                .andThen((matchObj) => string(matchObj.name))
                .map((str) => str.trim()),
            mcc: numberString(obj.mcc),
        })
    )

const parseBillingAmount = (trx: unknown): Result<unknown, FiatMoney> =>
    object(trx).andThen((obj) =>
        shape({
            billingAmount: bigint(obj.billingAmount),
            billingCurrency: object(obj.billingCurrency).andThen((curObj) =>
                shape({
                    symbol: string(curObj.symbol).andThen(
                        parseFiatCurrencyCode
                    ),
                    decimals: number(curObj.decimals),
                })
            ),
        }).andThen(
            ({
                billingAmount,
                billingCurrency,
            }): Result<unknown, FiatMoney> => {
                const matchingFiatCurrency =
                    FIAT_CURRENCIES[billingCurrency.symbol] || null

                if (!matchingFiatCurrency) {
                    return failure({
                        type: 'unknown_fiat_currency',
                        symbol: billingCurrency.symbol,
                    })
                }

                const fractionCorrection =
                    matchingFiatCurrency.fraction - billingCurrency.decimals

                return success({
                    amount: billingAmount * 10n ** BigInt(fractionCorrection),
                    currency: matchingFiatCurrency,
                })
            }
        )
    )

const parseTransactionAmount = (
    trx: unknown
): Result<unknown, FiatMoney | null> =>
    object(trx).andThen((obj) =>
        oneOf(obj.transactionAmount, [
            shape({
                transactionAmount: bigint(obj.transactionAmount),
                transactionCurrency: object(obj.transactionCurrency).andThen(
                    (curObj) =>
                        shape({
                            symbol: string(curObj.symbol).andThen(
                                parseFiatCurrencyCode
                            ),
                            decimals: number(curObj.decimals),
                        })
                ),
            }).andThen(
                ({
                    transactionAmount,
                    transactionCurrency,
                }): Result<unknown, FiatMoney> => {
                    const matchingFiatCurrency =
                        FIAT_CURRENCIES[transactionCurrency.symbol] || null

                    if (!matchingFiatCurrency) {
                        return failure({
                            type: 'unknown_fiat_currency',
                            symbol: transactionCurrency.symbol,
                        })
                    }

                    const fractionCorrection =
                        matchingFiatCurrency.fraction -
                        transactionCurrency.decimals

                    return success({
                        amount:
                            transactionAmount *
                            10n ** BigInt(fractionCorrection),
                        currency: matchingFiatCurrency,
                    })
                }
            ),
            success(null),
        ])
    )

const parseReversal = (input: unknown): Result<unknown, Reversal> =>
    object(input).andThen((obj) =>
        shape({
            kind: match(obj.kind, 'Reversal' as const),
            merchant: parseMerchantInfo(input),
            billingAmount: parseBillingAmount(input),
            transactionAmount: parseTransactionAmount(input),
            createdAt: string(obj.createdAt).map((str) =>
                new Date(str).getTime()
            ),
        })
    )

const parseRefund = (input: unknown): Result<unknown, Refund> =>
    object(input).andThen((obj) =>
        shape({
            kind: match(obj.kind, 'Refund' as const),
            merchant: parseMerchantInfo(input),
            billingAmount: parseBillingAmount(input),
            transactionAmount: parseTransactionAmount(input),
            createdAt: string(obj.createdAt).map((str) =>
                new Date(str).getTime()
            ),
        })
    )

const parsePayment = (input: unknown): Result<unknown, CardPayment> =>
    object(input).andThen((obj) =>
        shape({
            kind: match(obj.kind, 'Payment' as const),
            status: oneOf(obj.status, [
                match(obj.status, 'Approved' as const),
                match(obj.status, 'InsufficientFunds' as const),
                match(obj.status, 'Reversal' as const),
                oneOf(obj.status, [
                    match(obj.status, 'IncorrectPin' as const),
                    match(obj.status, 'InsufficientFunds' as const),
                    match(obj.status, 'InvalidAmount' as const),
                    match(obj.status, 'PinEntryTriesExceeded' as const),
                    match(obj.status, 'IncorrectSecurityCode' as const),
                    match(obj.status, 'Other' as const),
                ]).map(() => 'Declined' as const),
            ]),
            merchant: parseMerchantInfo(input),
            billingAmount: parseBillingAmount(input),
            transactionAmount: parseTransactionAmount(input),
            createdAt: string(obj.createdAt).map((str) =>
                new Date(str).getTime()
            ),
        })
    )
// Don't forget to add parser to the oneOf in parseCardTransaction
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cardTransactionParserMap: {
    [T in CardTransaction['kind']]: (
        input: unknown
    ) => Result<unknown, Extract<CardTransaction, { kind: T }>>
} = {
    Payment: parsePayment,
    Reversal: parseReversal,
    Refund: parseRefund,
}

export const parseCardTransaction = (
    input: unknown
): Result<unknown, CardTransaction> =>
    oneOf(
        object(input)
            .map((obj) => {
                // We know merchant and country to be sensitive, so we report other stuff which may help us to fix parser
                const { merchant, country, ...rest } = obj
                return rest
            })
            .getSuccessResult() || {},
        [parsePayment(input), parseReversal(input), parseRefund(input)]
    )
