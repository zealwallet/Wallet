import {
    failure,
    match,
    object,
    oneOf,
    Result,
    shape,
    success,
} from '@zeal/toolkit/Result'

import {
    TrezorActionCancelled,
    TrezorConnectionAlreadyInitialized,
    TrezorDeviceUsedElsewhere,
    TrezorError,
    TrezorMethodCancelled,
    TrezorPermissionsNotGranted,
    TrezorPINCancelled,
    TrezorPopupClosed,
} from '../TrezorError'

export const parseTrezorConnectionAlreadyInitialized = (
    input: unknown
): Result<unknown, TrezorConnectionAlreadyInitialized> =>
    object(input).andThen((obj) =>
        shape({
            type: success('trezor_connection_already_initialized' as const),
            error:
                obj instanceof Error
                    ? success(obj)
                    : failure({ type: 'not_instance_of_error' }),
            code: match(obj.code, 'Init_AlreadyInitialized' as const),
        })
    )

export const parseTrezorPopupClosed = (
    input: unknown
): Result<unknown, TrezorPopupClosed> =>
    object(input).andThen((obj) =>
        shape({
            type: success('trezor_popup_closed' as const),
            code: match(obj.code, 'Method_Interrupted' as const),
        })
    )

export const parseTrezorPermissionsNotGranted = (
    input: unknown
): Result<unknown, TrezorPermissionsNotGranted> =>
    object(input).andThen((obj) =>
        shape({
            type: success('trezor_permissions_not_granted' as const),
            code: match(obj.code, 'Method_PermissionsNotGranted' as const),
        })
    )

export const parseTrezorMethodCancelled = (
    input: unknown
): Result<unknown, TrezorMethodCancelled> =>
    object(input).andThen((obj) =>
        shape({
            type: success('trezor_method_cancelled' as const),
            code: match(obj.code, 'Method_Cancel' as const),
        })
    )

export const parseTrezorActionCancelled = (
    input: unknown
): Result<unknown, TrezorActionCancelled> =>
    object(input).andThen((obj) =>
        shape({
            type: success('trezor_action_cancelled' as const),
            code: match(obj.code, 'Failure_ActionCancelled' as const),
        })
    )

export const parseTrezorPINCancelled = (
    input: unknown
): Result<unknown, TrezorPINCancelled> =>
    object(input).andThen((obj) =>
        shape({
            type: success('trezor_pin_cancelled' as const),
            code: match(obj.code, 'Failure_PinCancelled' as const),
        })
    )

export const parseTrezorDeviceUsedElsewhere = (
    input: unknown
): Result<unknown, TrezorDeviceUsedElsewhere> =>
    object(input).andThen((obj) =>
        shape({
            type: success('trezor_device_used_elsewhere' as const),
            code: match(obj.code, 'Device_UsedElsewhere' as const),
        })
    )

export const parseTrezorError = (
    input: unknown
): Result<unknown, TrezorError> =>
    oneOf(input, [
        parseTrezorConnectionAlreadyInitialized(input),
        parseTrezorPopupClosed(input),
        parseTrezorPermissionsNotGranted(input),
        parseTrezorMethodCancelled(input),
        parseTrezorActionCancelled(input),
        parseTrezorPINCancelled(input),
        parseTrezorDeviceUsedElsewhere(input),
    ])
