import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    installationId: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof Layout>,
          { type: 'on_back_button_clicked' | 'on_continue_click' }
      >
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'safe_wallet_clicked'
          }
      >

export const ChooseWallet = ({
    accountsMap,
    keystoreMap,
    networkMap,
    networkRPCMap,
    sessionPassword,
    customCurrencies,
    portfolioMap,
    installationId,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                installationId={installationId}
                currencyHiddenMap={currencyHiddenMap}
                portfolioMap={portfolioMap}
                accountsMap={accountsMap}
                keystoreMap={keystoreMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_back_button_clicked':
                        case 'on_continue_click':
                            onMsg(msg)
                            break
                        case 'on_add_wallet_click':
                            setState({ type: 'add_account' })

                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                installationId={installationId}
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                customCurrencies={customCurrencies}
                sessionPassword={sessionPassword}
                accountsMap={accountsMap}
                keystoreMap={keystoreMap}
                state={state}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break
                        case 'on_account_create_request':
                            onMsg(msg)
                            break
                        case 'on_accounts_create_success_animation_finished':
                            setState({ type: 'closed' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
