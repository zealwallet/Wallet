import { get } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import {
    bigint,
    object,
    record,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import {
    CryptoCurrency,
    FiatCurrency,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import {
    parse as parseCurrency,
    parseCryptoCurrency,
    parseFiatCurrency,
} from '@zeal/domains/Currency/helpers/parse'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { FXRate, FXRate2 } from '@zeal/domains/FXRate'
import { Network, PredefinedNetwork } from '@zeal/domains/Network'

import { parse as parseRate } from '../helpers/parse'

type Response = { rate: FXRate; currencies: KnownCurrencies }

// FIXME @resetko-zeal kill
export const parse = (input: unknown): Result<unknown, Response> =>
    object(input).andThen((dto) =>
        shape({
            rate: parseRate(dto.rate),
            currencies: object(dto.currencies).andThen((curriencies) =>
                record(curriencies, parseCurrency)
            ),
        })
    )

// FIXME @resetko-zeal kill
export const fetchRate = async ({
    tokenAddress,
    network,
    signal,
}: {
    tokenAddress: string
    network: PredefinedNetwork
    signal?: AbortSignal
}): Promise<{ rate: FXRate; currencies: KnownCurrencies }> => {
    switch (network.type) {
        case 'predefined':
            return get(
                `/wallet/rate/default/${network.name}/${tokenAddress}/`,
                {},
                signal
            ).then((res) =>
                parse(res).getSuccessResultOrThrow('cannot parse rate')
            )

        /* istanbul ignore next */
        default:
            return notReachable(network.type)
    }
}

export const parse2 = (
    input: unknown
): Result<unknown, FXRate2<CryptoCurrency, FiatCurrency>> =>
    object(input)
        .andThen((dto) =>
            shape({
                rate: object(dto.rate).andThen((obj) =>
                    shape({
                        base: string(obj.base),
                        quote: string(obj.quote),
                        rate: bigint(obj.rate),
                    })
                ),
                currencies: object(dto.currencies),
            })
        )
        .andThen((dto) =>
            shape({
                base: object(dto.currencies[dto.rate.base]).andThen(
                    parseCryptoCurrency
                ),
                quote: object(dto.currencies[dto.rate.quote]).andThen(
                    parseFiatCurrency
                ),
                rate: bigint(dto.rate.rate),
            })
        )

export const fetchRate2 = async ({
    network,
    tokenAddress,
    signal,
}: {
    network: Network
    tokenAddress: Address
    signal?: AbortSignal
}): Promise<FXRate2<CryptoCurrency, FiatCurrency> | null> => {
    switch (network.type) {
        case 'predefined':
            return get(
                `/wallet/rate/default/${network.name}/${tokenAddress}/`,
                {},
                signal
            )
                .then((res) =>
                    parse2(res).getSuccessResultOrThrow('cannot parse rate')
                )
                .catch((error) => {
                    captureError(error)
                    // TODO @resetko-zeal remove once BE handles rate absence
                    return null
                })

        case 'custom':
        case 'testnet':
            return null

        default:
            return notReachable(network)
    }
}
