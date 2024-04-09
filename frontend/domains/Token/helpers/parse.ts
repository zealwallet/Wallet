import {
    boolean,
    match,
    nullableOf,
    number,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { fromString as parseAddressFromString } from '@zeal/domains/Address/helpers/fromString'
import { parse as parseFXRate } from '@zeal/domains/FXRate/helpers/parse'
import { parse as parseMoney } from '@zeal/domains/Money/helpers/parse'
import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import { Token } from '@zeal/domains/Token'

export const parse = (input: unknown): Result<unknown, Token> =>
    object(input).andThen((obj) =>
        shape({
            networkHexId: oneOf(obj, [
                parseNetworkHexId(obj.network),
                parseNetworkHexId(obj.networkHexId),
            ]),
            scam: oneOf(obj.scam, [boolean(obj.scam), success(false)]),
            rate: nullableOf(obj.rate, parseFXRate),
            address: string(obj.address).andThen(parseAddressFromString),
            balance: parseMoney(obj.balance),
            priceInDefaultCurrency: nullableOf(
                obj.priceInDefaultCurrency,
                parseMoney
            ),
            marketData: nullableOf(obj.marketData, (marketData) =>
                object(marketData).andThen((marketDataObj) =>
                    shape({
                        priceChange24h: object(
                            marketDataObj.priceChange24h
                        ).andThen((priceChange24hObj) =>
                            oneOf(priceChange24hObj, [
                                shape({
                                    direction: match(
                                        priceChange24hObj.direction,
                                        'Unchanged' as const
                                    ),
                                }),
                                shape({
                                    direction: match(
                                        priceChange24hObj.direction,
                                        'Up' as const
                                    ),
                                    percentage: number(
                                        priceChange24hObj.percentage
                                    ),
                                }),
                                shape({
                                    direction: match(
                                        priceChange24hObj.direction,
                                        'Down' as const
                                    ),
                                    percentage: number(
                                        priceChange24hObj.percentage
                                    ),
                                }),
                            ])
                        ),
                    })
                )
            ),
        })
    )
