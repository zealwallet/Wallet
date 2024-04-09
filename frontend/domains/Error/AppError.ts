import {
    DecryptIncorrectPassword,
    EncryptedObjectInvalidFormat,
    InvalidEncryptedFileFormat,
} from '@zeal/toolkit/Crypto'
import { UnexpectedResultFailureError } from '@zeal/toolkit/Result'

import { LedgerError } from '@zeal/domains/Error/domains/Ledger'
import { RPCResponseError } from '@zeal/domains/Error/domains/RPCError'
import { TrezorError } from '@zeal/domains/Error/domains/Trezor'
import { FailedToFetchGoogleAuthToken } from '@zeal/domains/GoogleDriveFile'

import { RPCRequestParseError } from './RPCRequestParseError'

export class HttpError extends Error {
    isHttpError = true
    type: 'http_error' = 'http_error' as const
    name = 'HttpError' as const

    url: string
    queryParams: unknown
    method: string
    data: unknown
    status: number | null
    trace: string | null

    constructor(
        url: string,
        method: string,
        status: number | null,
        trace: string | null,
        data: unknown,
        queryParams: unknown
    ) {
        super('HttpError')
        this.trace = trace
        this.url = url
        this.method = method
        this.status = status
        this.data = data
        this.queryParams = queryParams
    }
}
// @deprecated Use one from toolkit
export class ImperativeError extends Error {
    isImperativeError = true
    type: 'imperative_error'
    name = 'ImperativeError'
    extra: Record<string, unknown>

    constructor(message: string, extra?: Record<string, unknown>) {
        super(message)
        this.type = 'imperative_error'
        this.extra = extra || {}
    }
}

export class PasskeySignerNotFoundError extends Error {
    isPasskeySignerNotFoundError = true
    type: 'passkey_signer_not_found_error'
    name = 'PasskeySignerNotFoundError'
    recoveryId: string

    constructor(recoveryId: string) {
        super()
        this.type = 'passkey_signer_not_found_error'
        this.recoveryId = recoveryId
    }
}

export type UnknownError = {
    type: 'unknown_error'
    error: unknown
}

export type UnexpectedFailureError = {
    type: 'unexpected_failure'
    error: UnexpectedResultFailureError<unknown>
}

export type GoogleApiError = {
    type: 'google_api_error'
    code: number // TODO :: add more union codes here
    message: string
    error: unknown
}

export type UnblockLoginUserDidNotExists = {
    type: 'unblock_login_user_did_not_exists'
}

export type UnblockUserWithAddressAlreadyExists = {
    type: 'unblock_user_with_address_already_exists'
}

export type UnblockUserAssociatedWithOtherMerchant = {
    type: 'unblock_user_associated_with_other_merchant'
}
export type UnblockNonceAlreadyInUse = {
    type: 'unblock_nonce_already_in_use'
}
export class UnknownUnblockError extends Error {
    isUnknownUnblockError = true
    type: 'unknown_unblock_error' = 'unknown_unblock_error' as const
    name: string = 'UnknownUnblockError' as const

    url: string
    method: string
    data: unknown
    status: number | null
    trace: string | null
    errorId: string

    constructor(
        url: string,
        method: string,
        status: number | null,
        trace: string | null,
        errorId: string,
        data: unknown,
        message: string
    ) {
        super(message)
        this.trace = trace
        this.url = url
        this.method = method
        this.status = status
        this.errorId = errorId
        this.data = data
    }
}

export type UnblockUserWithSuchEmailAlreadyExists = {
    type: 'unblock_user_with_such_email_already_exists'
}

export type UnblockAccountNumberAndSortCodeMismatch = {
    type: 'unblock_account_number_and_sort_code_mismatch'
}

export type UnblockUnableToVerifyBVN = { type: 'unblock_unable_to_verify_bvn' }

export type UnblockBvnDoesNotMatch = { type: 'unblock_bvn_does_not_match' }

export type UnblockInvalidIBAN = {
    type: 'unblock_invalid_iban'
}

export type UnblockHardKycFailure = {
    type: 'unblock_hard_kyc_failure'
}

export type UnblockSessionExpired = {
    type: 'unblock_session_expired'
}

export type PasskeyOperationCancelled = { type: 'passkey_operation_cancelled' }
export type BiometricPromptCancelled = { type: 'biometric_prompt_cancelled' }

export type AppError =
    | UnexpectedFailureError
    | ImperativeError
    | UnknownError
    | RPCRequestParseError
    | RPCResponseError
    | HttpError
    | LedgerError
    | TrezorError
    | GoogleApiError
    | DecryptIncorrectPassword
    | EncryptedObjectInvalidFormat
    | InvalidEncryptedFileFormat
    | FailedToFetchGoogleAuthToken
    | UnblockAccountNumberAndSortCodeMismatch
    | UnblockInvalidIBAN
    | UnblockUnableToVerifyBVN
    | UnblockBvnDoesNotMatch
    | UnblockHardKycFailure
    | UnblockLoginUserDidNotExists
    | UnblockNonceAlreadyInUse
    | UnblockUserWithAddressAlreadyExists
    | UnblockUserAssociatedWithOtherMerchant
    | UnblockUserWithSuchEmailAlreadyExists
    | UnblockSessionExpired
    | UnknownUnblockError
    | PasskeyOperationCancelled
    | PasskeySignerNotFoundError
    | BiometricPromptCancelled
