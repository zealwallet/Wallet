import * as SentryWeb from '@sentry/react'
import * as SentryRN from '@sentry/react-native'

import { notReachable } from '@zeal/toolkit'
import { getEnvironment } from '@zeal/toolkit/Environment/getEnvironment'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'
import { replaceUUID } from '@zeal/toolkit/replaceUUID'
import { string } from '@zeal/toolkit/Result'

import { AppError } from '../AppError'

type Params = {
    source:
        | 'manually_captured'
        | 'app_error_popup'
        | 'error_boundary'
        | 'app_error_list_item'
    extra?: Record<string, unknown>
}

/**
 * We need to strip UUIDs and non-UUID specific params from URL to improve tagging in sentry and reduce duplication
 */
const cleanupUrl = (url: string) => {
    const noQueryString = url.split('?')[0]
    const noUUID = replaceUUID(noQueryString, 'uuid')
    const noSpecificParams = noUUID
        .replace(
            /\/wallet\/rate\/default\/[a-zA-Z]+\/0x[0-9a-fA-F]+\//gim,
            '/wallet/rate/default/:network/:address/'
        )
        .replace(
            /\/wallet\/transaction\/history\/0x[0-9a-fA-F]+\//gim,
            '/wallet/transaction/history/:address/'
        )
        .replace(
            /\/wallet\/transaction\/0x[0-9a-fA-F]+\/result/gim,
            '/wallet/transaction/:trx_hash/result'
        )

    return noSpecificParams
}

/**
 * @deprecated This helper is for domain internal use. Do not export and use it outside of Error domain
 */
export const captureAppError = (error: AppError, params: Params) => {
    const { extra, source } = params

    switch (error.type) {
        case 'unknown_unblock_error':
            report({
                error,
                tags: {
                    url: cleanupUrl(error.url),
                    method: error.method,
                    status: error.status,
                    source,
                },
                extra: {
                    message: error.message,
                    errorId: error.errorId,
                    url: error.url,
                    method: error.method,
                    ...extra,
                },
            })
            break

        case 'unblock_account_number_and_sort_code_mismatch':
        case 'unblock_bvn_does_not_match':
        case 'unblock_hard_kyc_failure':
        case 'unblock_invalid_iban':
        case 'unblock_login_user_did_not_exists':
        case 'unblock_nonce_already_in_use':
        case 'unblock_session_expired':
        case 'unblock_unable_to_verify_bvn':
        case 'unblock_user_associated_with_other_merchant':
        case 'unblock_user_with_address_already_exists':
        case 'unblock_user_with_such_email_already_exists':
            report({
                error,
                tags: {
                    errorType: error.type,
                    source,
                },
                extra,
            })
            break

        case 'unexpected_failure':
            report({
                error: error.error,
                tags: {
                    errorType: error.type,
                    source,
                },
                extra: {
                    reason: JSON.stringify(error.error.reason, null, 2),
                    ...extra,
                },
            })
            break

        case 'unknown_error':
            report({
                error: error.error,
                tags: {
                    errorType: error.type,
                    source,
                },
                extra: {
                    extra: {
                        ...extra,
                        stringifyError: JSON.stringify(error.error, null, 4),
                    },
                },
            })
            break

        case 'rpc_request_parse_error':
            report({
                error,
                tags: {
                    errorType: error.type,
                    rpcMethod:
                        string(error.rpcMethod).getSuccessResult() || null,
                    source,
                },
                extra: {
                    reason: JSON.stringify(error.reason, null, 2),
                    ...extra,
                },
            })
            break

        case 'http_error':
            report({
                error,
                tags: {
                    url: cleanupUrl(error.url),
                    method: error.method,
                    status: error.status,
                    source,
                },
                extra: {
                    ...extra,
                    trace: error.trace,
                },
            })
            break

        case 'imperative_error':
            report({
                error,
                tags: {
                    errorType: error.type,
                    source,
                },
                extra: {
                    ...error.extra,
                    ...extra,
                },
            })
            break

        case 'passkey_signer_not_found_error':
            report({
                error,
                tags: {
                    errorType: error.type,
                    source,
                },
                extra: {
                    recoveryId: error.recoveryId,
                    ...extra,
                },
            })
            break

        case 'rpc_error_cannot_query_unfinalized_data':
        case 'rpc_error_execution_reverted':
        case 'rpc_error_gas_price_is_less_than_minimum':
        case 'rpc_error_gas_required_exceeds_allowance':
        case 'rpc_error_insufficient_balance_for_transfer':
        case 'rpc_error_insufficient_funds_for_gas_and_value':
        case 'rpc_error_invalid_argument':
        case 'rpc_error_max_fee_per_gas_less_than_block_base_fee':
        case 'rpc_error_nounce_is_too_low':
        case 'rpc_error_replacement_transaction_underpriced':
        case 'rpc_error_transaction_underpriced':
        case 'rpc_error_tx_pool_disabled':
            report({
                error,
                tags: {
                    type: error.type,
                    networkHexId: error.networkHexId,
                    source,
                },
                extra,
            })
            break

        case 'rpc_error_unknown':
            report({
                error,
                tags: {
                    type: error.type,
                    networkHexId: error.networkHexId,
                    source,
                },
                extra: {
                    ...extra,
                    error: error.payload,
                },
            })
            break

        case 'decrypt_incorrect_password':
        case 'encrypted_object_invalid_format':
        case 'failed_to_fetch_google_auth_token':
        case 'google_api_error':
        case 'hardware_wallet_failed_to_open_device':
        case 'invalid_encrypted_file_format':
        case 'ledger_blind_sign_not_enabled_or_running_non_eth_app':
        case 'ledger_is_locked':
        case 'ledger_not_running_any_app':
        case 'ledger_running_non_eth_app':
        case 'passkey_operation_cancelled':
        case 'trezor_action_cancelled':
        case 'trezor_connection_already_initialized':
        case 'trezor_device_used_elsewhere':
        case 'trezor_method_cancelled':
        case 'trezor_permissions_not_granted':
        case 'trezor_pin_cancelled':
        case 'trezor_popup_closed':
        case 'user_trx_denied_by_user':
        case 'biometric_prompt_cancelled':
        case 'app_not_associated_with_domain':
            report({
                error,
                tags: {
                    errorType: error.type,
                    source,
                },
                extra,
            })
            break

        case 'unknown_merchant_code':
            report({
                error,
                tags: {
                    errorType: error.type,
                    code: error.code,
                    source,
                },
                extra: {
                    ...extra,
                    code: error.code,
                },
            })
            break

        default:
            notReachable(error)
    }
}

/**
 * TODO @resetko-zeal this is probably not the greatest implementation, and also it adds a mess with dependencies.
 * Probably it would be good idea to move all sentry related stuff to toolkit, and abstract it from domains and apps fully, even init and wrap method should be provided by toolkit,
 * and then we can keep sentry dependencies in toolkit, while apps will be able to init and report though it
 */
const captureException = (
    error: unknown,
    {
        tags,
        extra,
    }: {
        tags: Record<string, string | number | null>
        extra?: Record<string, unknown>
    }
) => {
    switch (ZealPlatform.OS) {
        case 'web':
            SentryWeb.captureException(error, { tags, extra })
            break
        case 'ios':
        case 'android':
            SentryRN.captureException(error, { tags, extra })
            break
        default:
            notReachable(ZealPlatform.OS)
    }
}

const report = ({
    error,
    tags,
    extra,
}: {
    error: unknown
    tags: Record<string, string | number | null>
    extra?: Record<string, unknown>
}): void => {
    const env = getEnvironment()

    const alertError = (input: unknown) => {
        const string = [
            typeof input === 'object' && input instanceof Error
                ? input.stack
                : null,
            JSON.stringify(input, undefined, 4),
        ]
            .filter(Boolean)
            .join('\n\n')

        alert(string)
    }

    switch (env) {
        case 'local':
            console.error('💥💥💥 LOCAL mode error', error, { tags, extra }) // eslint-disable-line no-console
            alertError(error)
            break

        case 'development':
            console.error('💥💥💥 DEV mode error', error, { tags, extra }) // eslint-disable-line no-console
            alertError(error)
            captureException(error, { tags, extra })
            break

        case 'production':
            captureException(error, { tags, extra })
            break

        default:
            notReachable(env)
    }
}
