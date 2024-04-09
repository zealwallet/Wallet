import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import { CreateUnblockUser } from '@zeal/domains/Currency/domains/BankTransfer/features/CreateUnblockUser'
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
    | MsgOf<typeof CreateUnblockUser>
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
          type: 'create_user'
          unblockLoginSignature: UnblockLoginSignature
      }

export const SetupEoa = ({
    account,
    onMsg,
    gasCurrencyPresetMap,
    feePresetMap,
    networkMap,
    networkRPCMap,
    accountsMap,
    network,
    keystore,
    keyStoreMap,
    sessionPassword,
    portfolioMap,
    installationId,
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
                                onMsg(msg)
                                break

                            case 'on_message_signed':
                                setState({
                                    type: 'create_user',
                                    unblockLoginSignature: msg.loginSignature,
                                })
                                break

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
        case 'create_user':
            return (
                <CreateUnblockUser
                    keystore={keystore}
                    networkRPCMap={networkRPCMap}
                    keyStoreMap={keyStoreMap}
                    accountsMap={accountsMap}
                    feePresetMap={feePresetMap}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    installationId={installationId}
                    portfolio={getPortfolio({
                        address: account.address,
                        portfolioMap,
                    })}
                    network={network}
                    account={account}
                    unblockLoginSignature={state.unblockLoginSignature}
                    networkMap={networkMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
