import { get } from '@zeal/api/socketApi'

import { notReachable } from '@zeal/toolkit'
import {
    match,
    nullableOf,
    object,
    oneOf,
    Result,
    shape,
} from '@zeal/toolkit/Result'

import {
    CryptoCurrency,
    CurrencyId,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import {
    BridgeSubmitted,
    BridgeSubmittedStatus,
    RequestState,
} from '@zeal/domains/Currency/domains/Bridge'
import { ImperativeError } from '@zeal/domains/Error'

type Params = {
    request: BridgeSubmitted
    signal?: AbortSignal
}

export const fetchBridgeRequestStatus = async ({
    request,
    signal,
}: Params): Promise<BridgeSubmittedStatus> => {
    const fromCryptoCurrency = getCryptoCurrency({
        cryptoCurrencyId: request.route.from.currencyId,
        knownCurrencies: request.knownCurrencies,
    })

    const toCryptoCurrency = getCryptoCurrency({
        cryptoCurrencyId: request.route.to.currencyId,
        knownCurrencies: request.knownCurrencies,
    })

    const fromChainId = parseInt(fromCryptoCurrency.networkHexChainId, 16)
    const toChainId = parseInt(toCryptoCurrency.networkHexChainId, 16)

    const data = await get(
        '/bridge-status',
        {
            transactionHash: request.sourceTransactionHash,
            fromChainId,
            toChainId,
            bridgeName: request.route.name,
        },
        signal
    )
    return parseBridgeSubmittedStatus(data).getSuccessResultOrThrow(
        'cannot parse BridgeSubmittedStatus'
    )
}

const parseBridgeSubmittedStatus = (
    input: unknown
): Result<unknown, BridgeSubmittedStatus> =>
    object(input).andThen((obj) =>
        shape({
            targetTransaction: parseStatus(obj.destinationTxStatus),
            refuel: nullableOf(obj.refuel, parserRefuel),
        })
    )

const parserRefuel = (input: unknown): Result<unknown, RequestState> =>
    object(input).andThen((obj) => parseStatus(obj.status))

const parseStatus = (input: unknown): Result<unknown, RequestState> =>
    shape({
        type: oneOf(input, [
            match(input, 'COMPLETED' as const).map(() => 'completed' as const),
            match(input, 'PENDING' as const).map(() => 'pending' as const),
        ]),
    })

const getCryptoCurrency = ({
    cryptoCurrencyId,
    knownCurrencies,
}: {
    cryptoCurrencyId: CurrencyId
    knownCurrencies: KnownCurrencies
}): CryptoCurrency => {
    const currency = knownCurrencies[cryptoCurrencyId]
    if (!currency) {
        throw new ImperativeError('currency is missing in `knownCurrencies`')
    }

    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError('Fiat currency can not be here')

        case 'CryptoCurrency':
            return currency
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
