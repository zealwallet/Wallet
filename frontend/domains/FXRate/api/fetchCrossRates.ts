import { post } from '@zeal/api/request'
import { Address } from 'web3'

import { notReachable } from '@zeal/toolkit'
import {
    array,
    bigint,
    combine,
    object,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import {
    parseCryptoCurrency,
    parseKnownCurrencies,
} from '@zeal/domains/Currency/helpers/parse'
import { ImperativeError } from '@zeal/domains/Error'
import { FXRate2 } from '@zeal/domains/FXRate'
import { Network } from '@zeal/domains/Network'

const parseCrossRate = (
    input: unknown,
    currencies: KnownCurrencies
): Result<unknown, FXRate2<CryptoCurrency, CryptoCurrency>> =>
    object(input).andThen((rateObj) =>
        shape({
            base: string(rateObj.base),
            quote: string(rateObj.quote),
            rate: bigint(rateObj.rate),
        }).andThen((dto) =>
            shape({
                base: object(currencies[dto.base]).andThen(parseCryptoCurrency),
                quote: object(currencies[dto.quote]).andThen(
                    parseCryptoCurrency
                ),
                rate: bigint(dto.rate),
            })
        )
    )

export const parse = (
    input: unknown
): Result<unknown, FXRate2<CryptoCurrency, CryptoCurrency>[]> =>
    object(input).andThen((obj) =>
        shape({
            currencies: parseKnownCurrencies(obj.currencies),
            rates: array(obj.rate),
        }).andThen((dto) =>
            combine(
                dto.rates.map((rateObj) =>
                    parseCrossRate(rateObj, dto.currencies)
                )
            )
        )
    )

export type CrossRateRequestPair = {
    fromAddress: Address
    toAddress: Address
}

export const fetchCrossRates = async ({
    signal,
    pairs,
    network,
}: {
    network: Network
    pairs: CrossRateRequestPair[]
    signal?: AbortSignal
}): Promise<FXRate2<CryptoCurrency, CryptoCurrency>[]> => {
    switch (network.type) {
        case 'predefined':
        case 'testnet':
            return post(
                `/wallet/rate/crypto`,
                {
                    query: {
                        network: network.name,
                    },
                    body: pairs,
                },
                signal
            ).then((res) =>
                parse(res).getSuccessResultOrThrow('cannot parse cross rate')
            )

        case 'custom':
            throw new ImperativeError(
                'Cannot fetch crypto cross rate for custom networks'
            )

        default:
            return notReachable(network)
    }
}
