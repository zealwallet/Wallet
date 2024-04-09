import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { LoginExistingUser } from '@zeal/domains/Currency/domains/BankTransfer/features/LoginExistingUser'
import { SignUnblockLoginMsg } from '@zeal/domains/Currency/domains/BankTransfer/features/SignUnblockLoginMsg'
import { EOA, KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

type Props = {
    account: Account
    network: Network
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    keystore: EOA
    sessionPassword: string
    accountsMap: AccountsMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_unblock_login_success'
          unblockLoginInfo: UnblockLoginInfo
          unblockLoginSignature: UnblockLoginSignature
      }
    | Extract<
          MsgOf<typeof SignUnblockLoginMsg>,
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
          type: 'sign_unblock_login_msg'
      }
    | {
          type: 'login_user'
          unblockLoginSignature: UnblockLoginSignature
      }
export const LoginEOA = ({
    network,
    networkMap,
    networkRPCMap,
    accountsMap,
    account,
    gasCurrencyPresetMap,
    portfolioMap,
    keyStoreMap,
    feePresetMap,
    installationId,
    sessionPassword,
    keystore,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({
        type: 'sign_unblock_login_msg',
    })
    switch (state.type) {
        case 'sign_unblock_login_msg':
            return (
                <SignUnblockLoginMsg
                    keystore={keystore}
                    accountsMap={accountsMap}
                    feePresetMap={feePresetMap}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    installationId={installationId}
                    portfolio={getPortfolio({
                        address: account.address,
                        portfolioMap,
                    })}
                    networkRPCMap={networkRPCMap}
                    networkMap={networkMap}
                    network={network}
                    account={account}
                    sessionPassword={sessionPassword}
                    keyStoreMap={keyStoreMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_4337_gas_currency_selected':
                                onMsg(msg)
                                break
                            case 'on_message_signed':
                                setState({
                                    type: 'login_user',
                                    unblockLoginSignature: msg.loginSignature,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'login_user':
            return (
                <LoginExistingUser
                    network={network}
                    keyStore={keystore}
                    account={account}
                    unblockLoginSignature={state.unblockLoginSignature}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
