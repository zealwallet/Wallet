import { get } from '@zeal/api/request'

import {
    array,
    boolean,
    combine,
    object,
    recordStrict,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { CurrencyId, KnownCurrencies } from '@zeal/domains/Currency'
import { parseKnownCurrencies } from '@zeal/domains/Currency/helpers/parse'
import { NetworkHexId } from '@zeal/domains/Network'
import { parse as parseNetwork } from '@zeal/domains/Network/helpers/parse'

export type CurrenciesMatrix = {
    knownCurrencies: KnownCurrencies
    currencies: Record<
        NetworkHexId,
        Record<
            NetworkHexId,
            {
                from: CurrencyId[]
                to: CurrencyId[]
                canRefuel: boolean
            }
        >
    >
}

const parseCurrenciesMatrixItem = (
    input: unknown
): Result<
    unknown,
    CurrenciesMatrix['currencies'][NetworkHexId][NetworkHexId]
> =>
    object(input).andThen((obj) =>
        shape({
            from: array(obj.from).andThen((fromArr) =>
                combine(fromArr.map(string))
            ),
            to: array(obj.to).andThen((toArr) => combine(toArr.map(string))),
            canRefuel: boolean(obj.canRefuel),
        })
    )

const parseCurrenciesMatrix = (
    input: unknown
): Result<unknown, CurrenciesMatrix> =>
    object(input).andThen((obj) =>
        shape({
            knownCurrencies: parseKnownCurrencies(obj.currencies),
            currencies: object(obj.supportedCurrencies).andThen((currObj) =>
                recordStrict(currObj, {
                    keyParser: parseNetwork,
                    valueParser: (value: unknown) =>
                        object(value).andThen((valueObj) =>
                            recordStrict(valueObj, {
                                keyParser: parseNetwork,
                                valueParser: parseCurrenciesMatrixItem,
                            })
                        ),
                })
            ),
        })
    )

export const fetchCurrenciesMatrix = async ({
    signal,
}: {
    signal?: AbortSignal
}): Promise<CurrenciesMatrix> =>
    parseCurrenciesMatrix(
        await get('/wallet/currencies/bridge', {}, signal)
    ).getSuccessResultOrThrow('Failed to parse swap/bridge currencies matrix')
