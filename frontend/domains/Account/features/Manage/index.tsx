import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { groupBySecretPhrase } from '@zeal/domains/Account/helpers/groupBySecretPhrase'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    installationId: string
    accounts: AccountsMap
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    networkRPCMap: NetworkRPCMap
    account: Account
    encryptedPassword: string
    currencyHiddenMap: CurrencyHiddenMap
    networkMap: NetworkMap
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'confirm_account_delete_click'
                  | 'on_account_label_change_submit'
                  | 'on_recovery_kit_setup'
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_add_private_key_click'
                  | 'safe_wallet_clicked'
          }
      >
    | Extract<
          MsgOf<typeof Layout>,
          {
              type: 'account_item_clicked' | 'track_wallet_clicked'
          }
      >

export const Manage = ({
    account,
    accounts,
    portfolioMap,
    onMsg,
    keystoreMap,
    encryptedPassword,
    currencyHiddenMap,
    networkRPCMap,
    sessionPassword,
    customCurrencyMap,
    networkMap,
    installationId,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                installationId={installationId}
                currencyHiddenMap={currencyHiddenMap}
                account={account}
                accounts={accounts}
                portfolioMap={portfolioMap}
                keystoreMap={keystoreMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'track_wallet_clicked':
                            onMsg(msg)
                            break
                        case 'add_new_account_click':
                            setModalState({
                                type: 'select_type_of_account_to_add',
                            })
                            break

                        case 'create_new_contact_account_click':
                            setModalState({
                                type: 'track_account',
                                address: msg.address,
                            })
                            break
                        case 'account_item_clicked':
                            onMsg(msg)
                            break
                        case 'account_details_clicked':
                            setModalState({
                                type: 'account_details',
                                address: msg.account.address,
                            })
                            break

                        case 'on_active_and_tracked_wallets_clicked':
                            setModalState({
                                type: 'active_and_tracked_wallets',
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
                networkMap={networkMap}
                customCurrencyMap={customCurrencyMap}
                installationId={installationId}
                networkRPCMap={networkRPCMap}
                currencyHiddenMap={currencyHiddenMap}
                state={modalState}
                accounts={accounts}
                portfolioMap={portfolioMap}
                keystoreMap={keystoreMap}
                encryptedPassword={encryptedPassword}
                onMsg={async (msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_accounts_create_success_animation_finished':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_account_label_change_submit':
                        case 'on_recovery_kit_setup':
                        case 'on_account_create_request':
                        case 'on_add_private_key_click':
                            onMsg(msg)
                            break

                        case 'confirm_account_delete_click':
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break

                        case 'track_wallet_clicked':
                        case 'add_wallet_clicked':
                        case 'safe_wallet_clicked':
                        case 'hardware_wallet_clicked':
                            onMsg(msg)
                            break
                        case 'create_clicked': {
                            try {
                                const secretPhraseMap =
                                    await groupBySecretPhrase(
                                        values(accounts),
                                        keystoreMap,
                                        sessionPassword
                                    )

                                setModalState({
                                    type: 'add_from_secret_phrase',
                                    secretPhraseMap,
                                })
                            } catch (e) {
                                captureError(e)
                            }
                            break
                        }

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
