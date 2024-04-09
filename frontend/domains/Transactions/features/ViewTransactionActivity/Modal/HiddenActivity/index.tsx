import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    installationId: string
    networkMap: NetworkMap
    accountsMap: AccountsMap
    account: Account
    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    currencyHiddenMap: CurrencyHiddenMap
    accounts: AccountsMap
    encryptedPassword: string

    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap

    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'account_item_clicked'
                  | 'confirm_account_delete_click'
                  | 'on_account_create_request'
                  | 'on_account_label_change_submit'
                  | 'on_add_private_key_click'
                  | 'on_recovery_kit_setup'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'safe_wallet_clicked'
                  | 'hardware_wallet_clicked'
          }
      >

export const HiddenActivity = ({
    account,
    selectedNetwork,
    networkRPCMap,
    accountsMap,
    networkMap,
    portfolioMap,
    keystoreMap,
    currencyHiddenMap,
    accounts,
    encryptedPassword,
    installationId,
    sessionPassword,
    customCurrencyMap,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                networkMap={networkMap}
                accountsMap={accountsMap}
                account={account}
                selectedNetwork={selectedNetwork}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_activity_transaction_click':
                            setModal({
                                type: 'transaction_details',
                                transaction: msg.transaction,
                            })
                            break

                        case 'on_account_selector_click':
                            setModal({
                                type: 'account_filter',
                            })
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                sessionPassword={sessionPassword}
                customCurrencyMap={customCurrencyMap}
                installationId={installationId}
                account={account}
                accountsMap={accountsMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                state={modal}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModal({ type: 'closed' })
                            break

                        case 'account_item_clicked':
                        case 'confirm_account_delete_click':
                            setModal({ type: 'closed' })
                            onMsg(msg)
                            break

                        case 'on_account_label_change_submit':
                        case 'on_recovery_kit_setup':
                        case 'on_add_private_key_click':
                        case 'track_wallet_clicked':
                        case 'on_account_create_request':
                        case 'add_wallet_clicked':
                        case 'hardware_wallet_clicked':
                        case 'safe_wallet_clicked':
                            onMsg(msg)
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
                portfolioMap={portfolioMap}
                keystoreMap={keystoreMap}
                currencyHiddenMap={currencyHiddenMap}
                accounts={accounts}
                encryptedPassword={encryptedPassword}
            />
        </>
    )
}
