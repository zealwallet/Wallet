import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap, GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { OffRampAccount } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { CreateUnblockUserAndLogin } from '@zeal/domains/Currency/domains/BankTransfer/features/CreateUnblockUserAndLogin'
import { SignUnblockLoginMsg } from '@zeal/domains/Currency/domains/BankTransfer/features/SignUnblockLoginMsg'
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

import { DepositWithdrawForm } from './DepositWithdrawForm'
import { SetupOfframpBankAccount } from './SetupOfframpBankAccount'

type Props = {
    bankTransferCurrencies: BankTransferCurrencies
    bankTransfer: BankTransferInfo
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    currencyHiddenMap: CurrencyHiddenMap
    installationId: string
    network: Network
    gasCurrencyPresetMap: GasCurrencyPresetMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'close'
      }
    | Extract<
          MsgOf<typeof CreateUnblockUserAndLogin>,
          {
              type:
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
                  | 'on_user_login_to_unblock_success'
                  | 'safe_wallet_clicked'
          }
      >
    | Extract<
          MsgOf<typeof DepositWithdrawForm>,
          {
              type:
                  | 'import_keys_button_clicked'
                  | 'kyc_applicant_created'
                  | 'on_predefined_fee_preset_selected'
                  | 'on_on_ramp_transfer_success_close_click'
                  | 'on_withdrawal_monitor_fiat_transaction_success'
                  | 'on_withdrawal_monitor_fiat_transaction_start'
                  | 'on_gas_currency_selected'
                  | 'on_4337_gas_currency_selected'
                  | 'on_contact_support_clicked'
          }
      >
    | Extract<
          MsgOf<typeof SignUnblockLoginMsg>,
          {
              type:
                  | 'on_predefined_fee_preset_selected'
                  | 'cancel_submitted'
                  | 'transaction_submited'
                  | 'transaction_request_replaced'
          }
      >

type State =
    | { type: 'create_user_and_login_to_unblock' }
    | {
          type: 'creating_account'
          loginInfo: UnblockLoginInfo
          bankTransferInfo:
              | BankTransferUnblockUserCreated
              | BankTransferUnblockUserCreatedForSafeWallet
      }
    | {
          type: 'deposit_withdraw_form'
          loginInfo: UnblockLoginInfo
          bankTransferInfo: BankTransferUnblockUserCreated
          offRampAccounts: OffRampAccount[]
      }

export const Flow = ({
    bankTransferCurrencies,
    customCurrencies,
    sessionPassword,
    bankTransfer,
    portfolioMap,
    accountsMap,
    keystoreMap,
    networkMap,
    installationId,
    network,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    onMsg,
    gasCurrencyPresetMap,
}: Props) => {
    const [state, setState] = useState<State>({
        type: 'create_user_and_login_to_unblock',
    })

    switch (state.type) {
        case 'create_user_and_login_to_unblock':
            return (
                <CreateUnblockUserAndLogin
                    customCurrencies={customCurrencies}
                    currencyHiddenMap={currencyHiddenMap}
                    keystoreMap={keystoreMap}
                    bankTransferInfo={bankTransfer}
                    network={network}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    sessionPassword={sessionPassword}
                    accountsMap={accountsMap}
                    feePresetMap={feePresetMap}
                    portfolioMap={portfolioMap}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    installationId={installationId}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_user_login_to_unblock_success':
                                onMsg(msg)
                                setState({
                                    type: 'creating_account',
                                    bankTransferInfo: msg.bankTransferInfo,
                                    loginInfo: msg.unblockLoginInfo,
                                })
                                break
                            case 'on_account_create_request':
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

        case 'creating_account':
            return (
                <SetupOfframpBankAccount
                    currencies={bankTransferCurrencies}
                    account={
                        accountsMap[
                            state.bankTransferInfo.connectedWalletAddress
                        ]
                    }
                    network={network}
                    keyStoreMap={keystoreMap}
                    unblockLoginInfo={state.loginInfo}
                    bankTransferInfo={state.bankTransferInfo}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setState({
                                    type: 'create_user_and_login_to_unblock',
                                })
                                break
                            case 'unblock_offramp_account_created':
                                setState({
                                    type: 'deposit_withdraw_form',
                                    loginInfo: state.loginInfo,
                                    offRampAccounts: [msg.account],
                                    bankTransferInfo: {
                                        ...state.bankTransferInfo,
                                    },
                                })
                                break
                            case 'unblock_offramp_account_fetched':
                                setState({
                                    type: 'deposit_withdraw_form',
                                    loginInfo: state.loginInfo,
                                    offRampAccounts: msg.offRampAccounts,
                                    bankTransferInfo: {
                                        ...state.bankTransferInfo,
                                    },
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'deposit_withdraw_form': {
            const account =
                accountsMap[state.bankTransferInfo.connectedWalletAddress]

            if (!account) {
                throw new ImperativeError(
                    `we don't get account in bank transfer form`
                )
            }

            const keystore = getKeyStore({
                address: account.address,
                keyStoreMap: keystoreMap,
            })
            switch (keystore.type) {
                case 'track_only':
                    throw new ImperativeError(
                        `we get track only keystore inside bank transfer flow in deposit_withdraw_form`
                    )
                case 'safe_4337':
                case 'private_key_store':
                case 'ledger':
                case 'secret_phrase_key':
                case 'trezor':
                    return (
                        <DepositWithdrawForm
                            gasCurrencyPresetMap={gasCurrencyPresetMap}
                            feePresetMap={feePresetMap}
                            offRampAccounts={state.offRampAccounts}
                            customCurrencies={customCurrencies}
                            bankTransferCurrencies={bankTransferCurrencies}
                            accountsMap={accountsMap}
                            network={network}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                            keystoreMap={keystoreMap}
                            installationId={installationId}
                            portfolioMap={portfolioMap}
                            account={account}
                            sessionPassword={sessionPassword}
                            loginInfo={state.loginInfo}
                            bankTransferInfo={state.bankTransferInfo}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        onMsg(msg)
                                        break
                                    case 'unblock_offramp_account_created':
                                        setState({
                                            ...state,
                                            offRampAccounts: [
                                                ...state.offRampAccounts.map(
                                                    (account) => {
                                                        return {
                                                            ...account,
                                                            mainBeneficiary:
                                                                false,
                                                        }
                                                    }
                                                ),
                                                {
                                                    ...msg.account,
                                                    mainBeneficiary: true,
                                                },
                                            ],
                                        })
                                        break
                                    case 'on_off_ramp_account_become_default':
                                        setState({
                                            ...state,
                                            offRampAccounts:
                                                state.offRampAccounts.map(
                                                    (account) => ({
                                                        ...account,
                                                        mainBeneficiary:
                                                            account.uuid ===
                                                            msg.offRampAccount
                                                                .uuid,
                                                    })
                                                ),
                                        })
                                        break
                                    case 'kyc_applicant_created':
                                    case 'import_keys_button_clicked':
                                    case 'on_predefined_fee_preset_selected':
                                    case 'on_on_ramp_transfer_success_close_click':
                                    case 'on_withdrawal_monitor_fiat_transaction_start':
                                    case 'on_withdrawal_monitor_fiat_transaction_success':
                                    case 'on_4337_gas_currency_selected':
                                    case 'on_contact_support_clicked':
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
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
