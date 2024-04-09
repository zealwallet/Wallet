import React from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap, GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { ImperativeError } from '@zeal/domains/Error'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import {
    BankTransferInfo,
    BankTransferUnblockUserCreated,
    BankTransferUnblockUserCreatedForSafeWallet,
    CustomCurrencyMap,
} from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { LoginEOA } from './LoginEOA'
import { LoginSafe } from './LoginSafe'
import { SetupBankTransfer } from './SetupBankTransfer'

type Props = {
    bankTransferInfo: BankTransferInfo
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    feePresetMap: FeePresetMap
    network: Network
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_user_login_to_unblock_success'
          unblockLoginInfo: UnblockLoginInfo
          bankTransferInfo:
              | BankTransferUnblockUserCreated
              | BankTransferUnblockUserCreatedForSafeWallet
      }
    | Extract<
          MsgOf<typeof SetupBankTransfer>,
          {
              type:
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_gas_currency_selected'
                  | 'on_4337_gas_currency_selected'
                  | 'on_predefined_fee_preset_selected'
                  | 'cancel_submitted'
                  | 'transaction_submited'
                  | 'transaction_request_replaced'
                  | 'safe_wallet_clicked'
          }
      >

export const CreateUnblockUserAndLogin = ({
    bankTransferInfo,
    network,
    networkMap,
    networkRPCMap,
    accountsMap,
    keystoreMap,
    portfolioMap,
    currencyHiddenMap,
    gasCurrencyPresetMap,
    feePresetMap,
    customCurrencies,
    sessionPassword,
    installationId,
    onMsg,
}: Props) => {
    switch (bankTransferInfo.type) {
        case 'not_started':
            return (
                <SetupBankTransfer
                    accountsMap={accountsMap}
                    keystoreMap={keystoreMap}
                    sessionPassword={sessionPassword}
                    customCurrencies={customCurrencies}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    portfolioMap={portfolioMap}
                    currencyHiddenMap={currencyHiddenMap}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    installationId={installationId}
                    feePresetMap={feePresetMap}
                    network={network}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_bank_transfer_setup_success':
                                onMsg({
                                    type: 'on_user_login_to_unblock_success',
                                    bankTransferInfo: msg.bankTransfer,
                                    unblockLoginInfo: msg.unblockLoginInfo,
                                })
                                break
                            case 'close':
                            case 'on_account_create_request':
                            case 'on_4337_gas_currency_selected':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'unblock_user_created': {
            const account: Account | null =
                accountsMap[bankTransferInfo.connectedWalletAddress]
            if (!account) {
                throw new ImperativeError(
                    'CreateUserAndLoginToUnblock dont have account for bankTransferInfo'
                )
            }
            const keystore = getKeyStore({
                address: account.address,
                keyStoreMap: keystoreMap,
            })

            switch (keystore.type) {
                case 'track_only':
                case 'safe_4337':
                    throw new ImperativeError(
                        `CreateUserAndLoginToUnblock got in EOA login flow`,
                        { keyStoreType: keystore.type }
                    )
                case 'private_key_store':
                case 'ledger':
                case 'secret_phrase_key':
                case 'trezor':
                    return (
                        <LoginEOA
                            account={account}
                            network={network}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                            keystore={keystore}
                            sessionPassword={sessionPassword}
                            accountsMap={accountsMap}
                            feePresetMap={feePresetMap}
                            gasCurrencyPresetMap={gasCurrencyPresetMap}
                            installationId={installationId}
                            keyStoreMap={keystoreMap}
                            portfolioMap={portfolioMap}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'on_unblock_login_success':
                                        onMsg({
                                            type: 'on_user_login_to_unblock_success',
                                            bankTransferInfo: bankTransferInfo,
                                            unblockLoginInfo:
                                                msg.unblockLoginInfo,
                                        })
                                        break
                                    case 'close':
                                    case 'on_4337_gas_currency_selected':
                                        onMsg(msg)
                                        break
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(msg)
                                }
                            }}
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(keystore)
            }
        }
        case 'bank_transfer_unblock_user_created_for_safe_wallet':
            const account: Account | null =
                accountsMap[bankTransferInfo.connectedWalletAddress]
            if (!account) {
                throw new ImperativeError(
                    'CreateUserAndLoginToUnblock dont have account for bankTransferInfo (safe branch)'
                )
            }
            const keystore = getKeyStore({
                address: account.address,
                keyStoreMap: keystoreMap,
            })

            switch (keystore.type) {
                case 'track_only':
                case 'private_key_store':
                case 'ledger':
                case 'secret_phrase_key':
                case 'trezor':
                    throw new ImperativeError(
                        `CreateUserAndLoginToUnblock got wrong keystore in Safe login flow`,
                        { keyStoreType: keystore.type }
                    )
                case 'safe_4337':
                    return (
                        <LoginSafe
                            network={network}
                            keystore={keystore}
                            account={account}
                            unblockUserId={bankTransferInfo.unblockUserId}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        onMsg(msg)
                                        break
                                    case 'on_unblock_login_success':
                                        onMsg({
                                            type: 'on_user_login_to_unblock_success',
                                            bankTransferInfo: bankTransferInfo,
                                            unblockLoginInfo:
                                                msg.unblockLoginInfo,
                                        })
                                        break
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(msg)
                                }
                            }}
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(keystore)
            }

        /* istanbul ignore next */
        default:
            return notReachable(bankTransferInfo)
    }
}
