export type LedgerError =
    | LedgerNotRunningAnyApp
    | HardwareWalletFailedToOpenDevice
    | LedgerBlindSignNotEnabled
    | LedgerRunningNonEthApp
    | LedgerIsLocked
    | UserTrxDeniedByUser

export type LedgerNotRunningAnyApp = {
    type: 'ledger_not_running_any_app'
    ledgerCode: 25873
}

export type HardwareWalletFailedToOpenDevice = {
    type: 'hardware_wallet_failed_to_open_device'
}

export type LedgerBlindSignNotEnabled = {
    type: 'ledger_blind_sign_not_enabled_or_running_non_eth_app'
}

export type LedgerRunningNonEthApp = {
    type: 'ledger_running_non_eth_app'
    ledgerCode: 27904
}

export type LedgerIsLocked = {
    type: 'ledger_is_locked'
    ledgerCode: 21781 | 27010 | 27404
}

export type UserTrxDeniedByUser = {
    type: 'user_trx_denied_by_user'
    ledgerCode: 27013
}
