import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap, GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { Story } from '@zeal/domains/Currency/domains/BankTransfer/components/Story'
import { ChooseWallet } from '@zeal/domains/Currency/domains/BankTransfer/features/ChooseWallet'
import {
    EOA,
    KeyStoreMap,
    Safe4337,
    SigningKeyStore,
} from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import {
    BankTransferUnblockUserCreated,
    CustomCurrencyMap,
} from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { SetupEoa } from './SetupEOA'
import { SetupSafe } from './SetupSafe'
import { SetUserPreferences } from './SetUserPreferences'

type Props = {
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
    | {
          type: 'close'
      }
    | {
          type: 'on_bank_transfer_setup_success'
          bankTransfer: BankTransferUnblockUserCreated
          unblockLoginInfo: UnblockLoginInfo
      }
    | Extract<
          MsgOf<typeof ChooseWallet>,
          {
              type:
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'safe_wallet_clicked'
          }
      >
    | Extract<
          MsgOf<typeof SetupEoa>,
          {
              type:
                  | 'on_gas_currency_selected'
                  | 'on_4337_gas_currency_selected'
                  | 'on_predefined_fee_preset_selected'
                  | 'cancel_submitted'
                  | 'transaction_submited'
                  | 'transaction_request_replaced'
          }
      >

type State =
    | {
          type: 'show_story'
      }
    | {
          type: 'choose_wallet_to_connect'
      }
    | {
          type: 'setup_eoa'
          account: Account
          keystore: EOA
      }
    | {
          type: 'setup_safe'
          account: Account
          keystore: Safe4337
      }
    | {
          type: 'set_user_preferences'
          bankTransfer: BankTransferUnblockUserCreated
          unblockLoginInfo: UnblockLoginInfo
          keystore: SigningKeyStore
          account: Account
      }

export const SetupBankTransfer = ({
    customCurrencies,
    sessionPassword,
    currencyHiddenMap,
    networkMap,
    networkRPCMap,
    accountsMap,
    keystoreMap,
    portfolioMap,
    network,
    installationId,
    gasCurrencyPresetMap,
    feePresetMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'show_story' })
    switch (state.type) {
        case 'show_story':
            return (
                <Story
                    installationId={installationId}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_stories_completed':
                                setState({ type: 'choose_wallet_to_connect' })
                                break
                            case 'on_next_slide_shown':
                                break
                            case 'on_stories_dismissed':
                                onMsg({ type: 'close' })
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'choose_wallet_to_connect':
            return (
                <ChooseWallet
                    installationId={installationId}
                    currencyHiddenMap={currencyHiddenMap}
                    portfolioMap={portfolioMap}
                    accountsMap={accountsMap}
                    keystoreMap={keystoreMap}
                    sessionPassword={sessionPassword}
                    customCurrencies={customCurrencies}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_back_button_clicked':
                                setState({ type: 'show_story' })
                                break
                            case 'on_continue_click':
                                switch (msg.keystore.type) {
                                    case 'private_key_store':
                                    case 'ledger':
                                    case 'secret_phrase_key':
                                    case 'trezor':
                                        setState({
                                            type: 'setup_eoa',
                                            account: msg.account,
                                            keystore: msg.keystore,
                                        })
                                        break

                                    case 'safe_4337':
                                        setState({
                                            type: 'setup_safe',
                                            account: msg.account,
                                            keystore: msg.keystore,
                                        })
                                        break
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(msg.keystore)
                                }
                                break
                            case 'on_account_create_request':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'setup_eoa':
            return (
                <SetupEoa
                    keyStoreMap={keystoreMap}
                    sessionPassword={sessionPassword}
                    accountsMap={accountsMap}
                    portfolioMap={portfolioMap}
                    networkRPCMap={networkRPCMap}
                    account={state.account}
                    networkMap={networkMap}
                    keystore={state.keystore}
                    network={network}
                    feePresetMap={feePresetMap}
                    installationId={installationId}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_unblock_login_success':
                                setState({
                                    type: 'set_user_preferences',
                                    unblockLoginInfo: msg.unblockLoginInfo,
                                    bankTransfer: {
                                        type: 'unblock_user_created',
                                        countryCode: null,
                                        sumSubAccessToken: null,
                                        connectedWalletAddress:
                                            state.account.address,
                                        unblockLoginSignature:
                                            msg.unblockLoginSignature,
                                        unblockUserId:
                                            msg.unblockLoginInfo.unblockUserId,
                                    },
                                    keystore: state.keystore,
                                    account: state.account,
                                })
                                break
                            case 'unblock_user_created':
                                setState({
                                    type: 'set_user_preferences',
                                    unblockLoginInfo: msg.loginInfo,
                                    bankTransfer: {
                                        type: 'unblock_user_created',
                                        countryCode: msg.user.countryCode,
                                        sumSubAccessToken: null,
                                        connectedWalletAddress:
                                            state.account.address,
                                        unblockLoginSignature:
                                            msg.unblockLoginSignature,
                                        unblockUserId:
                                            msg.loginInfo.unblockUserId,
                                    },
                                    keystore: state.keystore,
                                    account: state.account,
                                })
                                break
                            case 'on_4337_gas_currency_selected':
                                onMsg(msg)
                                break
                            case 'on_try_with_different_wallet_clicked':
                            case 'close':
                                setState({ type: 'choose_wallet_to_connect' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'setup_safe':
            return (
                <SetupSafe
                    account={state.account}
                    network={network}
                    keystore={state.keystore}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_unblock_login_success_after_restore':
                                setState({
                                    type: 'set_user_preferences',
                                    unblockLoginInfo: msg.unblockLoginInfo,
                                    bankTransfer: {
                                        type: 'bank_transfer_unblock_user_created_for_safe_wallet',
                                        countryCode: null,
                                        sumSubAccessToken: null,
                                        connectedWalletAddress:
                                            state.account.address,
                                        unblockUserId:
                                            msg.unblockLoginInfo.unblockUserId,
                                    },
                                    keystore: state.keystore,
                                    account: state.account,
                                })
                                break
                            case 'on_unblock_login_success_after_create':
                                setState({
                                    type: 'set_user_preferences',
                                    unblockLoginInfo: msg.unblockLoginInfo,
                                    bankTransfer: {
                                        type: 'bank_transfer_unblock_user_created_for_safe_wallet',
                                        countryCode: msg.user.countryCode,
                                        sumSubAccessToken: null,
                                        connectedWalletAddress:
                                            state.account.address,
                                        unblockUserId:
                                            msg.unblockLoginInfo.unblockUserId,
                                    },
                                    keystore: state.keystore,
                                    account: state.account,
                                })
                                break
                            case 'on_try_with_different_wallet_clicked':
                            case 'close':
                                setState({ type: 'choose_wallet_to_connect' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'set_user_preferences':
            return (
                <SetUserPreferences
                    loginInfo={state.unblockLoginInfo}
                    keystore={state.keystore}
                    account={state.account}
                    network={network}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_user_preferences_set_successfully':
                                onMsg({
                                    type: 'on_bank_transfer_setup_success',
                                    bankTransfer: state.bankTransfer,
                                    unblockLoginInfo: state.unblockLoginInfo,
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
            return notReachable(state)
    }
}
