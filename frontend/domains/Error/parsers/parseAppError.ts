import { notReachable } from '@zeal/toolkit'
import {
    parseDecryptIncorrectPassword,
    parseEncryptedObjectInvalidFormat,
    parseInvalidEncryptedFileFormat,
} from '@zeal/toolkit/Crypto'
import { failure, oneOf, Result } from '@zeal/toolkit/Result'

import { parseNonceAlreadyInUse } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseNounceAlreadyInUse'
import { parseUnblockAccountNumberAndSortCodeMismatch } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockAccountNumberAndSortCodeMismatch'
import { parseUnblockBvnDoesNotMatch } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockBvnDoesNotMatch'
import { parseUnblockHardKycFailure } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockHardKycFailure'
import { parseUnblockInvalidIBAN } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockInvalidIBAN'
import { parseUnblockLoginError } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockLoginError'
import { parseUnblockSessionExpired } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockSessionExpired'
import { parseUnblockUnableToVerifyBVN } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockUnableToVerifyBVN'
import { parseUnknownUnblockError } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockUnknownError'
import { parseUnblockUserAlreadyExists } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockUserAlreadyExists'
import { parseUnblockUserAssociatedWithOtherMerchant } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockWrongMerchant'
import { parseUserWithSuchEmailAlreadyExists } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUserWithSuchEmailAlreadyExists'
import { AppError, GoogleApiError } from '@zeal/domains/Error'
import { parseLedgerError } from '@zeal/domains/Error/domains/Ledger/parsers/parsers'
import { parseRPCError } from '@zeal/domains/Error/domains/RPCError/parsers/parseRPCError'
import { parseTrezorError } from '@zeal/domains/Error/domains/Trezor/parsers/parseTrezorError'
import { parseHttpError } from '@zeal/domains/Error/parsers/parseHttpError'
import { parseRPCRequestParseError } from '@zeal/domains/Error/parsers/parseRPCRequestParseError'
import { parseFailedToFetchGoogleAuthToken } from '@zeal/domains/GoogleDriveFile'
import { parsePasskeyOperationCancelled } from '@zeal/domains/KeyStore/parsers/parsePasskeyOperationCancelled'
import { parsePasskeySignerNotFoundError } from '@zeal/domains/KeyStore/parsers/parsePasskeySignerNotFoundError'
import { parseBiometricPromptCancelledError } from '@zeal/domains/Password/parsers/parseBiometricPromptCancelledError'

import { parseImperativeError } from './parseImperativeError'
import { parseUnexpectedFailureError } from './parseUnexpectedFailureError'

const parseGoogleAPIError = (
    error: unknown
): Result<unknown, GoogleApiError> => {
    return failure(error) // parser when needed
}

export const parseAppError = (error: unknown): AppError => {
    const parseResult = oneOf(error, [
        oneOf(error, [
            parseGoogleAPIError(error),
            parseFailedToFetchGoogleAuthToken(error),
            parseUnblockLoginError(error),
            parseNonceAlreadyInUse(error),
            parseUserWithSuchEmailAlreadyExists(error),
            parseUnblockSessionExpired(error),
            parseUnblockInvalidIBAN(error),
        ]),
        oneOf(error, [
            parseUnblockUnableToVerifyBVN(error),
            parseUnblockBvnDoesNotMatch(error),
            parseUnblockAccountNumberAndSortCodeMismatch(error),
            parseUnblockHardKycFailure(error),
            parseUnblockUserAlreadyExists(error),
            parseUnblockUserAssociatedWithOtherMerchant(error),
            parseUnknownUnblockError(error), // make sure all known unblock error is above this
            parsePasskeySignerNotFoundError(error),
            parseRPCError(error),
        ]),
        oneOf(error, [
            parseUnexpectedFailureError(error),
            parseImperativeError(error),
            parseRPCRequestParseError(error),
            parseLedgerError(error),
            parseTrezorError(error),
            parseDecryptIncorrectPassword(error),
            parseEncryptedObjectInvalidFormat(error),
            parseInvalidEncryptedFileFormat(error),
            parsePasskeyOperationCancelled(error),
            parseBiometricPromptCancelledError(error),
        ]),
        parseHttpError(error), // This is more generic error, we would like to keep it at the end
    ])

    switch (parseResult.type) {
        case 'Failure':
            return { type: 'unknown_error', error }

        case 'Success':
            return parseResult.data

        /* istanbul ignore next */
        default:
            return notReachable(parseResult)
    }
}
