import { get } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import { nullable, number, object, oneOf, Result } from '@zeal/toolkit/Result'

import { CryptoCurrency, FiatCurrency } from '@zeal/domains/Currency'
import { UnblockTransferFee } from '@zeal/domains/Currency/domains/BankTransfer'
import { fetchUnblockFXRate } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUnblockFXRate'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { ImperativeError } from '@zeal/domains/Error'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { mulByNumber } from '@zeal/domains/Money/helpers/mul'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

export type FetchTransactionFeeParams = OnRampFeeParams | OffRampFeeParams

export type OnRampFeeParams = {
    type: 'fiatToCrypto'
    inputCurrency: FiatCurrency
    outputCurrency: CryptoCurrency
    amount: string | null
}

export type OffRampFeeParams = {
    type: 'cryptoToFiat'
    inputCurrency: CryptoCurrency
    outputCurrency: FiatCurrency
    amount: string | null
}

const parseTransactionFee = (
    input: unknown,
    feeParams: FetchTransactionFeeParams
): Result<unknown, UnblockTransferFee> =>
    object(input).andThen((obj) =>
        oneOf(obj, [
            number(obj.total_fee_percentage),
            nullable(obj.total_fee_percentage).map(() => 0),
        ]).map((percentageFee) => ({
            amount: mulByNumber(
                {
                    amount: amountToBigint(
                        feeParams.amount,
                        feeParams.inputCurrency.rateFraction
                    ),
                    currencyId: feeParams.inputCurrency.id,
                },
                percentageFee
            ),
            percentageFee,
        }))
    )

export const fetchTransactionFee = ({
    feeParams,
    bankTransferInfo,
    signal,
}: {
    feeParams: FetchTransactionFeeParams
    bankTransferInfo: BankTransferUnblockUserCreated
    signal?: AbortSignal
}): Promise<UnblockTransferFee> => {
    const searchParams = new URLSearchParams(
        searchParamsFromFeeParams(feeParams)
    )

    return get(
        '/wallet/smart-wallet/unblock/',
        {
            query: {
                // TODO maxtern
                // @ts-ignore
                path: `/fees?${searchParams.toString()}`,
            },
        },
        signal
    )
        .then((data) =>
            object(data)
                .andThen(() => parseTransactionFee(data, feeParams))
                .getSuccessResultOrThrow('Failed to parse onramp account')
        )
        .then((fee) =>
            // Unblock returns non-zero fee for 0 amount, which is not fully correct, so we fix this on our side
            fee.amount.amount === 0n
                ? {
                      amount: fee.amount,
                      percentageFee: 0,
                  }
                : fee
        )
        .then(async (fee) => {
            switch (feeParams.type) {
                case 'fiatToCrypto':
                    return fee

                case 'cryptoToFiat': {
                    const knownCurrencies = {
                        [feeParams.inputCurrency.id]: feeParams.inputCurrency,
                        [feeParams.outputCurrency.id]: feeParams.outputCurrency,
                    }

                    const feeCurrency =
                        knownCurrencies[fee.amount.currencyId] || null

                    if (!feeCurrency) {
                        throw new ImperativeError(`Unknown currency`, {
                            currencyId: fee.amount.currencyId,
                        })
                    }

                    // TODO @resetko-zeal We probably should the quote instead, which will tell us exact FX rate,
                    //                    total estimated receiving amount and the fee which going to be deducted
                    const rate = await fetchUnblockFXRate({
                        feeParams,
                        bankTransferInfo,
                        signal,
                    })

                    return {
                        amount: applyRate(fee.amount, rate, knownCurrencies),
                        percentageFee: fee.percentageFee,
                    }
                }

                default:
                    return notReachable(feeParams)
            }
        })
}

const searchParamsFromFeeParams = (
    feeParams: FetchTransactionFeeParams
): Record<string, string> => {
    switch (feeParams.type) {
        case 'cryptoToFiat':
            return {
                payment_method: 'bank_transfer',
                direction: 'cryptoToFiat',
                input_currency: cryptoCodeFromCryptoCurrency(
                    feeParams.inputCurrency
                ),
                output_currency: feeParams.outputCurrency.code,
                amount: feeParams.amount || '0',
            }

        case 'fiatToCrypto':
            return {
                payment_method: 'bank_transfer',
                direction: 'fiatToCrypto',
                input_currency: feeParams.inputCurrency.code,
                output_currency: cryptoCodeFromCryptoCurrency(
                    feeParams.outputCurrency
                ),
                amount: feeParams.amount || '0',
            }

        default:
            return notReachable(feeParams)
    }
}

const cryptoCodeFromCryptoCurrency = (
    cryptoCurrency: CryptoCurrency
): string => {
    switch (cryptoCurrency.code) {
        case 'USDC.e':
            return 'USDCE'

        default:
            throw new ImperativeError(
                'Using non-supported crypto in fxrate request'
            )
    }
}
