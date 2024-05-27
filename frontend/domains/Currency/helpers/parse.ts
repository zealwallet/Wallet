import {
    failure,
    match,
    number,
    object,
    oneOf,
    recordStrict,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import {
    CryptoCurrency,
    Currency,
    FiatCurrency,
    FiatCurrencyCode,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'

export const parse = (input: unknown): Result<unknown, Currency> =>
    object(input).andThen((obj) =>
        oneOf(obj, [parseFiatCurrency(obj), parseCryptoCurrency(obj)])
    )

export const parseKnownCurrencies = (
    input: unknown
): Result<unknown, KnownCurrencies> =>
    object(input).andThen((curriencies) =>
        recordStrict(curriencies, {
            keyParser: string,
            valueParser: parse,
        })
    )

export const parseFiatCurrencyCode = (
    code: string
): Result<unknown, FiatCurrencyCode> => {
    const map: Record<FiatCurrencyCode, true> = {
        EUR: true,
        GBP: true,
        NGN: true,
        PLN: true,
    }

    return map[code as FiatCurrencyCode]
        ? success(code as FiatCurrencyCode)
        : failure({ type: 'unknown_fiat_currency_code', code })
}

export const parseFiatCurrency = (
    obj: Record<string, unknown>
): Result<unknown, FiatCurrency> =>
    shape({
        type: match(obj.type, 'FiatCurrency' as const),
        id: string(obj.id),
        symbol: string(obj.symbol),
        code: string(obj.code),
        fraction: number(obj.fraction),
        rateFraction: number(obj.rateFraction),
        icon: string(obj.icon),
        name: string(obj.name),
    })

export const parseCryptoCurrency = (
    obj: Record<string, unknown>
): Result<unknown, CryptoCurrency> =>
    shape({
        type: match(obj.type, 'CryptoCurrency' as const),
        id: string(obj.id),
        networkHexChainId: oneOf(obj, [
            parseNetworkHexId(obj.network),
            parseNetworkHexId(obj.networkHexChainId),
        ]),
        address: parseAddress(obj.address),
        symbol: string(obj.symbol),
        code: string(obj.code),
        fraction: number(obj.fraction),
        rateFraction: number(obj.rateFraction),
        icon: string(obj.icon),
        name: string(obj.name),
    })
