import { notReachable } from '@zeal/toolkit'
import {
    match,
    object,
    oneOf,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'

import { ChromeRuntimeMessageRequest } from '..'

const providerToZwidget: ChromeRuntimeMessageRequest = {
    type: 'extension_to_zwidget_expand_zwidget',
} as ChromeRuntimeMessageRequest

switch (providerToZwidget.type) {
    case 'extension_to_zwidget_expand_zwidget':
    case 'extension_to_zwidget_extension_address_change':
    case 'extension_to_zwidget_query_zwidget_connection_state_and_network':
    case 'to_service_worker_trezor_connect_get_public_key':
    case 'to_service_worker_trezor_connect_sign_transaction':
    case 'to_service_worker_trezor_connect_sign_message':
    case 'to_service_worker_trezor_connect_sign_typed_data':
        // dont forget to update parsers
        break
    /* istanbul ignore next */
    default:
        notReachable(providerToZwidget)
}

export const parseChromeRuntimeMessageRequestMsgs = (
    input: unknown
): Result<unknown, ChromeRuntimeMessageRequest> =>
    object(input).andThen((obj) =>
        oneOf(obj, [
            shape({
                type: match(
                    obj.type,
                    'extension_to_zwidget_extension_address_change' as const
                ),
                address: parseAddress(obj.address),
            }),
            shape({
                type: match(
                    obj.type,
                    'extension_to_zwidget_query_zwidget_connection_state_and_network' as const
                ),
            }),
            shape({
                type: match(
                    obj.type,
                    'extension_to_zwidget_expand_zwidget' as const
                ),
            }),
            shape({
                type: match(
                    obj.type,
                    'to_service_worker_trezor_connect_get_public_key' as const
                ),
                path: string(obj.path),
                coin: string(obj.coin),
            }),
            shape({
                type: match(
                    obj.type,
                    'to_service_worker_trezor_connect_sign_transaction' as const
                ),
                path: string(obj.path),
                transaction: object(obj.transaction),
            }),
            shape({
                type: match(
                    obj.type,
                    'to_service_worker_trezor_connect_sign_message' as const
                ),
                path: string(obj.path),
                message: string(obj.message),
            }),
            shape({
                type: match(
                    obj.type,
                    'to_service_worker_trezor_connect_sign_typed_data' as const
                ),
                path: string(obj.path),
                typedData: object(obj.typedData),
            }),
        ])
    )
