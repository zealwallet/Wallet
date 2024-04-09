import {
    array,
    combine,
    match,
    nullable,
    nullableOf,
    number,
    object,
    oneOf,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { fromString as parseAddressFromString } from '@zeal/domains/Address/helpers/fromString'
import {
    App,
    AppNft,
    AppProtocol,
    AppToken,
    CommonProtocol,
    Lending,
    LockedToken,
    UnknownProtocol,
    Vesting,
} from '@zeal/domains/App'
import { parse as parseMoney } from '@zeal/domains/Money/helpers/parse'
import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'

export const parse = (input: unknown): Result<unknown, App> =>
    object(input).andThen((obj) =>
        shape({
            name: string(obj.name),
            icon: string(obj.icon),
            networkHexId: oneOf(obj, [
                parseNetworkHexId(obj.network),
                parseNetworkHexId(obj.networkHexId),
            ]),
            priceInDefaultCurrency: parseMoney(obj.priceInDefaultCurrency),
            url: nullableOf(obj.url, string),
            protocols: array(obj.protocols).andThen((arr) =>
                combine(arr.map(parseAppProtocol))
            ),
        })
    )

const parseAppProtocol = (input: unknown): Result<unknown, AppProtocol> =>
    oneOf(input, [
        parseCommonProtocol(input),
        parseLockedToken(input),
        parseLending(input),
        parseVesting(input),
        parseUnknownProtocol(input),
    ])

const parseCommonProtocol = (input: unknown): Result<unknown, CommonProtocol> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'CommonAppProtocol' as const),
            priceInDefaultCurrency: parseMoney(obj.priceInDefaultCurrency),
            suppliedTokens: array(obj.suppliedTokens).andThen((arr) =>
                combine(arr.map(parseAppToken))
            ),
            borrowedTokens: array(obj.borrowedTokens).andThen((arr) =>
                combine(arr.map(parseAppToken))
            ),
            rewardTokens: array(obj.rewardTokens).andThen((arr) =>
                combine(arr.map(parseAppToken))
            ),
            category: string(obj.category),
            description: nullableOf(obj.description, string),
        })
    )

const parseLockedToken = (input: unknown): Result<unknown, LockedToken> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'LockedTokenAppProtocol' as const),
            priceInDefaultCurrency: parseMoney(obj.priceInDefaultCurrency),
            lockedTokens: array(obj.lockedTokens).andThen((arr) =>
                combine(arr.map(parseAppToken))
            ),
            rewardTokens: array(obj.rewardTokens).andThen((arr) =>
                combine(arr.map(parseAppToken))
            ),
            unlockAt: number(obj.unlockAt),
            category: string(obj.category),
            description: nullableOf(obj.description, string),
        })
    )

const parseLending = (input: unknown): Result<unknown, Lending> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'LendingAppProtocol' as const),
            priceInDefaultCurrency: parseMoney(obj.priceInDefaultCurrency),
            suppliedTokens: array(obj.suppliedTokens).andThen((arr) =>
                combine(arr.map(parseAppToken))
            ),
            borrowedTokens: array(obj.borrowedTokens).andThen((arr) =>
                combine(arr.map(parseAppToken))
            ),
            rewardTokens: array(obj.rewardTokens).andThen((arr) =>
                combine(arr.map(parseAppToken))
            ),
            category: string(obj.category),
            description: nullableOf(obj.description, string),
            healthFactor: number(obj.healthFactor),
        })
    )

const parseVesting = (input: unknown): Result<unknown, Vesting> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'VestingAppProtocol' as const),
            priceInDefaultCurrency: parseMoney(obj.priceInDefaultCurrency),
            vestedToken: parseAppToken(obj.vestedToken),
            claimableToken: parseAppToken(obj.claimableToken),
            category: string(obj.category),
        })
    )

const parseUnknownProtocol = (
    input: unknown
): Result<unknown, UnknownProtocol> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'UnknownAppProtocol' as const),
            priceInDefaultCurrency: parseMoney(obj.priceInDefaultCurrency),
            tokens: array(obj.tokens).andThen((arr) =>
                combine(arr.map(parseAppToken))
            ),
            nfts: array(obj.nfts).andThen((arr) =>
                combine(arr.map(parseAppNft))
            ),
            category: string(obj.category),
        })
    )

const parseAppToken = (input: unknown): Result<unknown, AppToken> =>
    object(input).andThen((obj) =>
        shape({
            networkHexId: oneOf(obj, [
                parseNetworkHexId(obj.network),
                parseNetworkHexId(obj.networkHexId),
            ]),
            name: string(obj.name),
            address: string(obj.address).andThen(parseAddressFromString),
            balance: parseMoney(obj.balance),
            priceInDefaultCurrency: oneOf(obj, [
                parseMoney(obj.priceInDefaultCurrency),
                nullable(obj.priceInDefaultCurrency),
            ]),
        })
    )

const parseAppNft = (input: unknown): Result<unknown, AppNft> =>
    object(input).andThen((obj) =>
        shape({
            tokenId: string(obj.tokenId),
            name: nullableOf(obj.name, string),
            amount: string(obj.amount),
            decimals: number(obj.decimals),
            priceInDefaultCurrency: nullableOf(
                obj.priceInDefaultCurrency,
                parseMoney
            ),
            uri: nullableOf(obj.uri, string),
        })
    )
