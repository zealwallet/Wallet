import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { Submited } from '@zeal/domains/TransactionRequest'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Layout } from './Layout'
import { Modal, State } from './Modal'

type Props = {
    installationId: string
    account: Account
    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    accounts: AccountsMap
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    transactionRequests: Record<Address, Submited[]>
    submitedBridgesMap: SubmitedBridgesMap
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    encryptedPassword: string
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | {
          type: 'on_network_item_click'
          network: CurrentNetwork
      }
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'bridge_completed'
                  | 'on_bridge_submitted_click'
                  | 'on_transaction_request_widget_click'
                  | 'transaction_request_cancelled'
                  | 'transaction_request_completed'
                  | 'transaction_request_failed'
                  | 'transaction_request_replaced'
          }
      >
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
                  | 'safe_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'add_wallet_clicked'
          }
      >

export const ViewTransactionActivity = ({
    selectedNetwork,
    networkRPCMap,
    portfolioMap,
    accounts,
    account,
    keystoreMap,
    transactionRequests,
    submitedBridgesMap,
    networkMap,
    currencyHiddenMap,
    encryptedPassword,
    installationId,
    sessionPassword,
    customCurrencyMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'closed' })

    useEffect(() => {
        postUserEvent({
            type: 'ActivityEnteredEvent',
            installationId,
        })
    }, [installationId])

    return (
        <>
            <Layout
                accountsMap={accounts}
                keyStoreMap={keystoreMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                submitedBridgesMap={submitedBridgesMap}
                transactionRequests={transactionRequests}
                account={account}
                selectedNetwork={selectedNetwork}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_activity_transaction_click':
                            setState({
                                type: 'transaction_details',
                                transaction: msg.transaction,
                            })
                            break
                        case 'network_filter_click':
                            setState({ type: 'network_filter' })
                            break
                        case 'on_hidden_activity_icon_click':
                            setState({ type: 'hidden_activity' })
                            break

                        case 'transaction_request_completed':
                        case 'transaction_request_failed':
                        case 'bridge_completed':
                        case 'on_bridge_submitted_click':
                        case 'on_transaction_request_widget_click':
                        case 'transaction_request_replaced':
                            onMsg(msg)
                            break

                        case 'on_account_selector_click':
                            setState({ type: 'account_filter' })
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
                currencyHiddenMap={currencyHiddenMap}
                accountsMap={accounts}
                networkMap={networkMap}
                keystoreMap={keystoreMap}
                state={state}
                portfolioMap={portfolioMap}
                selectedNetwork={selectedNetwork}
                networkRPCMap={networkRPCMap}
                account={account}
                accounts={accounts}
                encryptedPassword={encryptedPassword}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break

                        case 'account_item_clicked':
                        case 'confirm_account_delete_click':
                        case 'on_network_item_click':
                            setState({ type: 'closed' })
                            onMsg(msg)
                            break

                        case 'on_rpc_change_confirmed':
                        case 'on_select_rpc_click':
                        case 'on_account_label_change_submit':
                        case 'on_recovery_kit_setup':
                        case 'on_add_private_key_click':
                        case 'track_wallet_clicked':
                        case 'on_account_create_request':
                        case 'safe_wallet_clicked':
                        case 'hardware_wallet_clicked':
                        case 'add_wallet_clicked':
                            onMsg(msg)
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
