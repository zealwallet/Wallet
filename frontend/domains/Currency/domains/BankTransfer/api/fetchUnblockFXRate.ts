import { get } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import { number, object } from '@zeal/toolkit/Result'

import { CryptoCurrency } from '@zeal/domains/Currency'
import { FetchTransactionFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { ImperativeError } from '@zeal/domains/Error'
import { FXRate } from '@zeal/domains/FXRate'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

export const fetchUnblockFXRate = ({
    feeParams,
    bankTransferInfo,
    signal,
}: {
    feeParams: FetchTransactionFeeParams
    bankTransferInfo: BankTransferUnblockUserCreated
    signal?: AbortSignal
}): Promise<FXRate> =>
    get(
        '/wallet/smart-wallet/unblock/',
        {
            query: {
                // TODO :: maxtern :: remove ts ignore
                // @ts-ignore
                path: `/exchange-rates/?${getQueryParams(feeParams)}`,
            },
        },
        signal
    ).then((data): FXRate => {
        const rate = object(data)
            .andThen((obj) => number(obj.exchange_rate))
            .getSuccessResultOrThrow('Failed to parse exchange rate')

        return {
            rate: amountToBigint(
                rate.toString(),
                feeParams.outputCurrency.rateFraction
            ),
            base: feeParams.inputCurrency.id,
            quote: feeParams.outputCurrency.id,
        }
    })

export const getQueryParams = (params: FetchTransactionFeeParams): string => {
    switch (params.type) {
        case 'fiatToCrypto':
            return new URLSearchParams({
                base_currency: params.inputCurrency.code,
                target_currency: fiatCodeFromCryptoCurrency(
                    params.outputCurrency
                ),
            }).toString()

        case 'cryptoToFiat':
            return new URLSearchParams({
                base_currency: fiatCodeFromCryptoCurrency(params.inputCurrency),
                target_currency: params.outputCurrency.code,
            }).toString()

        default:
            return notReachable(params)
    }
}
const fiatCodeFromCryptoCurrency = (cryptoCurrency: CryptoCurrency): string => {
    switch (cryptoCurrency.code) {
        case 'USDC.e':
            return 'USD'

        default:
            throw new ImperativeError(
                'Using non-supported crypto in fxrate request'
            )
    }
}
