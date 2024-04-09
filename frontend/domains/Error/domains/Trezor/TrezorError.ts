export type TrezorError =
    | TrezorConnectionAlreadyInitialized
    | TrezorPopupClosed
    | TrezorPermissionsNotGranted
    | TrezorMethodCancelled
    | TrezorActionCancelled
    | TrezorPINCancelled
    | TrezorDeviceUsedElsewhere

export type TrezorConnectionAlreadyInitialized = {
    type: 'trezor_connection_already_initialized'
    code: 'Init_AlreadyInitialized'
    error: Error
}

export type TrezorPopupClosed = {
    type: 'trezor_popup_closed'
    code: 'Method_Interrupted'
}

export type TrezorPermissionsNotGranted = {
    type: 'trezor_permissions_not_granted'
    code: 'Method_PermissionsNotGranted'
}

export type TrezorMethodCancelled = {
    type: 'trezor_method_cancelled'
    code: 'Method_Cancel'
}

export type TrezorActionCancelled = {
    type: 'trezor_action_cancelled'
    code: 'Failure_ActionCancelled'
}

export type TrezorPINCancelled = {
    type: 'trezor_pin_cancelled'
    code: 'Failure_PinCancelled'
}

export type TrezorDeviceUsedElsewhere = {
    type: 'trezor_device_used_elsewhere'
    code: 'Device_UsedElsewhere'
}
