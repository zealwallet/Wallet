import React from 'react'
import { FormattedMessage } from 'react-intl'

import { notReachable } from '@zeal/toolkit'

import { AppError } from '@zeal/domains/Error'

export const Title = ({ error }: { error: AppError }) => {
    switch (error.type) {
        case 'unblock_account_number_and_sort_code_mismatch':
            return (
                <FormattedMessage
                    id="error.unblock_account_number_and_sort_code_mismatch"
                    defaultMessage="Account number and sort code mismatch"
                />
            )

        case 'unblock_invalid_iban':
            return (
                <FormattedMessage
                    id="error.unblock_invalid_iban"
                    defaultMessage="Invalid IBAN"
                />
            )

        case 'unblock_bvn_does_not_match':
        case 'unblock_unable_to_verify_bvn':
            return (
                <FormattedMessage
                    id="error.unblock_invalid_bvn"
                    defaultMessage="Invalid BVN"
                />
            )

        case 'unblock_hard_kyc_failure':
            return (
                <FormattedMessage
                    id="error.unblock_hard_kyc_failure"
                    defaultMessage="Unexpected KYC state"
                />
            )

        case 'unblock_session_expired':
            return (
                <FormattedMessage
                    id="error.unblock_session_expired.title"
                    defaultMessage="Unblock session expired"
                />
            )

        case 'unblock_user_with_such_email_already_exists':
            return (
                <FormattedMessage
                    id="error.unblock_user_with_such_email_already_exists.title"
                    defaultMessage="User with such email already exists"
                />
            )

        case 'unblock_user_with_address_already_exists':
            return (
                <FormattedMessage
                    id="error.unblock_user_with_address_already_exists.title"
                    defaultMessage="Account already setup for address"
                />
            )
        case 'decrypt_incorrect_password':
            return (
                <FormattedMessage
                    id="error.decrypt_incorrect_password.title"
                    defaultMessage="Incorrect password"
                />
            )
        case 'encrypted_object_invalid_format':
        case 'invalid_encrypted_file_format':
            return (
                <FormattedMessage
                    id="error.encrypted_object_invalid_format.title"
                    defaultMessage="Corrupted data"
                />
            )

        case 'rpc_error_replacement_transaction_underpriced':
        case 'rpc_error_nounce_is_too_low':
        case 'rpc_error_gas_required_exceeds_allowance':
        case 'rpc_error_insufficient_balance_for_transfer':
        case 'rpc_error_insufficient_funds_for_gas_and_value':
        case 'rpc_error_gas_price_is_less_than_minimum':
        case 'rpc_error_max_fee_per_gas_less_than_block_base_fee':
        case 'rpc_error_transaction_underpriced':
        case 'rpc_error_execution_reverted':
            return (
                <FormattedMessage
                    id="error.trezor_action_cancelled.title"
                    defaultMessage="Transaction rejected"
                />
            )

        case 'trezor_device_used_elsewhere':
            return (
                <FormattedMessage
                    id="error.trezor_device_used_elsewhere.title"
                    defaultMessage="Device is being used in another session"
                />
            )

        case 'trezor_method_cancelled':
            return (
                <FormattedMessage
                    id="error.trezor_method_cancelled.title"
                    defaultMessage="Couldn’t sync Trezor"
                />
            )

        case 'trezor_permissions_not_granted':
            return (
                <FormattedMessage
                    id="error.trezor_permissions_not_granted.title"
                    defaultMessage="Couldn’t sync Trezor"
                />
            )

        case 'trezor_pin_cancelled':
            return (
                <FormattedMessage
                    id="error.trezor_pin_cancelled.title"
                    defaultMessage="Couldn’t sync Trezor"
                />
            )

        case 'trezor_popup_closed':
            return (
                <FormattedMessage
                    id="error.trezor_popup_closed.title"
                    defaultMessage="Couldn’t sync Trezor"
                />
            )

        case 'failed_to_fetch_google_auth_token':
            return (
                <FormattedMessage
                    id="error.failed_to_fetch_google_auth_token.title"
                    defaultMessage="We couldn’t get access"
                />
            )

        case 'unblock_login_user_did_not_exists':
        case 'unblock_user_associated_with_other_merchant':
        case 'unblock_nonce_already_in_use':
        case 'unknown_unblock_error':
        case 'rpc_error_tx_pool_disabled':
        case 'rpc_error_cannot_query_unfinalized_data':
        case 'rpc_error_invalid_argument':
        case 'google_api_error':
        case 'trezor_connection_already_initialized':
        case 'http_error':
        case 'rpc_request_parse_error':
        case 'trezor_action_cancelled':
        case 'hardware_wallet_failed_to_open_device':
        case 'imperative_error':
        case 'ledger_blind_sign_not_enabled_or_running_non_eth_app':
        case 'ledger_is_locked':
        case 'ledger_not_running_any_app':
        case 'ledger_running_non_eth_app':
        case 'unexpected_failure':
        case 'unknown_error':
        case 'user_trx_denied_by_user':
        case 'passkey_operation_cancelled':
        case 'passkey_signer_not_found_error':
        case 'rpc_error_unknown':
        case 'biometric_prompt_cancelled':
            return (
                <FormattedMessage
                    id="error.unknown_error.title"
                    defaultMessage="We’re having issues"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}
