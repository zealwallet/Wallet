import {
    match,
    nullableOf,
    number,
    object,
    recordStrict,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { fromString as parseAddress } from '@zeal/domains/Address/helpers/fromString'
import {
    BridgeRoute,
    BridgeSubmitted,
} from '@zeal/domains/Currency/domains/Bridge'
import { parse as parseCurrency } from '@zeal/domains/Currency/helpers/parse'
import { parse as parseMoney } from '@zeal/domains/Money/helpers/parse'
import { parseEthSendTransaction } from '@zeal/domains/RPCRequest/parsers/parseRPCRequest'

export const parseBridgeSubmitted = (
    input: unknown
): Result<unknown, BridgeSubmitted> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'bridge_submitted' as const),
            route: parseBridgeRoute(obj.route),
            knownCurrencies: object(obj.knownCurrencies).andThen(
                (curriencies) =>
                    recordStrict(curriencies, {
                        keyParser: string,
                        valueParser: parseCurrency,
                    })
            ),
            fromAddress: string(obj.fromAddress).andThen(parseAddress),
            submittedAtMS: number(obj.submittedAtMS),
            sourceTransactionHash: string(obj.sourceTransactionHash),
        })
    )

export const parseBridgeRoute = (
    input: unknown
): Result<unknown, BridgeRoute> =>
    object(input).andThen((obj) =>
        shape({
            displayName: string(obj.displayName),
            icon: string(obj.icon),

            name: string(obj.name),
            approvalTransaction: nullableOf(
                obj.approvalTransaction,
                (approvalInput: unknown) =>
                    object(approvalInput).andThen(parseEthSendTransaction)
            ),
            sourceTransaction: object(obj.sourceTransaction).andThen(
                parseEthSendTransaction
            ),

            serviceTimeMs: number(obj.serviceTimeMs),

            feeInDefaultCurrency: parseMoney(obj.feeInDefaultCurrency),

            from: parseMoney(obj.from),
            fromPriceInDefaultCurrency: parseMoney(
                obj.fromPriceInDefaultCurrency
            ),

            to: parseMoney(obj.to),
            toPriceInDefaultCurrency: parseMoney(obj.toPriceInDefaultCurrency),

            refuel: nullableOf(obj.refuel, (refuelInput: unknown) =>
                object(refuelInput).andThen((refuelObject) =>
                    shape({
                        from: parseMoney(refuelObject.from),
                        to: parseMoney(refuelObject.to),
                    })
                )
            ),
        })
    )
