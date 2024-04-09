import {
    match,
    object,
    oneOf,
    Result,
    shape,
    success,
    ValidObject,
} from '@zeal/toolkit/Result'

import {
    HardwareWalletFailedToOpenDevice,
    LedgerBlindSignNotEnabled,
    LedgerError,
    LedgerIsLocked,
    LedgerNotRunningAnyApp,
    LedgerRunningNonEthApp,
    UserTrxDeniedByUser,
} from '@zeal/domains/Error/domains/Ledger'

export const parseLedgerError = (
    input: unknown
): Result<unknown, LedgerError> =>
    object(input).andThen((obj) =>
        oneOf(obj, [
            parseLedgerNotRunningAnyApp(obj),
            parseHardwareWalletFailedToOpenDevice(obj),
            parseLedgerBlindSignNotEnabled(obj),
            parseLedgerRunningNonEthApp(obj),
            parseLedgerIsLocked(obj),
            parseUserTrxDeniedByUser(obj),
        ])
    )

const parseLedgerNotRunningAnyApp = (
    input: ValidObject
): Result<unknown, LedgerNotRunningAnyApp> =>
    shape({
        type: success('ledger_not_running_any_app' as const),
        ledgerCode: match(input.statusCode, 25873 as const),
        name: match(input.name, 'TransportStatusError'),
    })

const parseHardwareWalletFailedToOpenDevice = (
    input: ValidObject
): Result<unknown, HardwareWalletFailedToOpenDevice> =>
    shape({
        type: success('hardware_wallet_failed_to_open_device' as const),
        message: oneOf(input, [
            // can also happen when ledger live is connected
            match(input.message, 'Failed to open the device'),
            // when device not connected
            match(input.message, 'Access denied to use Ledger device'),
            match(input.name, 'DisconnectedDevice'),
        ]),
    })

const parseLedgerBlindSignNotEnabled = (
    input: ValidObject
): Result<unknown, LedgerBlindSignNotEnabled> =>
    shape({
        type: success(
            'ledger_blind_sign_not_enabled_or_running_non_eth_app' as const
        ),
        message: match(
            input.message,
            'Please enable Blind signing or Contract data in the Ethereum app Settings'
        ),
    })

const parseLedgerRunningNonEthApp = (
    input: ValidObject
): Result<unknown, LedgerRunningNonEthApp> =>
    shape({
        type: success('ledger_running_non_eth_app' as const),
        ledgerCode: match(input.statusCode, 27904 as const),
    })

const parseLedgerIsLocked = (
    input: ValidObject
): Result<unknown, LedgerIsLocked> =>
    shape({
        type: success('ledger_is_locked' as const),
        ledgerCode: oneOf(input.statusCode, [
            match(input.statusCode, 21781 as const),
            match(input.statusCode, 27010 as const),
            match(input.statusCode, 27404 as const),
        ]),
    })

const parseUserTrxDeniedByUser = (
    input: ValidObject
): Result<unknown, UserTrxDeniedByUser> =>
    shape({
        type: success('user_trx_denied_by_user' as const),
        ledgerCode: match(input.statusCode, 27013 as const),
    })
