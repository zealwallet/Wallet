import {
    nullableOf,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { parseCountryISOCode } from '@zeal/domains/Country/helpers/parseCountryISOCode'
import { BankTransferInfo } from '@zeal/domains/Storage'

export const parseBankTransferInfo = (
    input: unknown
): Result<unknown, BankTransferInfo> =>
    oneOf(input, [
        object(input).andThen((obj) =>
            shape({
                type: success('unblock_user_created' as const),
                unblockUserId: string(obj.unblockUserId),
                countryCode: oneOf(obj.countryCode, [
                    parseCountryISOCode(obj.countryCode),
                    success(null),
                ]),
                connectedWalletAddress: parseAddress(
                    obj.connectedWalletAddress
                ),
                unblockLoginSignature: object(
                    obj.unblockLoginSignature
                ).andThen((signatureObj) =>
                    shape({
                        signature: string(signatureObj.signature),
                        message: string(signatureObj.message),
                    })
                ),
                sumSubAccessToken: nullableOf(obj.sumSubAccessToken, string),
            })
        ),
        object(input).andThen((obj) =>
            shape({
                type: success(
                    'bank_transfer_unblock_user_created_for_safe_wallet' as const
                ),
                unblockUserId: string(obj.unblockUserId),
                countryCode: nullableOf(obj.countryCode, parseCountryISOCode),
                connectedWalletAddress: parseAddress(
                    obj.connectedWalletAddress
                ),

                sumSubAccessToken: nullableOf(obj.sumSubAccessToken, string),
            })
        ),
        success({ type: 'not_started' as const }),
    ])
