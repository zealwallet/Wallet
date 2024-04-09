import React from 'react'
import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { groupBySecretPhrase } from '@zeal/domains/Account/helpers/groupBySecretPhrase'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    installationId: string
    accounts: AccountsMap
    alternativeProvider: AlternativeProvider // TODO @max-tern :: unify alternative provider or MetaMask (assume you will not have anything else then metamask
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    selectedProvider: { type: 'zeal'; account: Account } | { type: 'metamask' }
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'safe_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'account_item_clicked'
                  | 'track_wallet_clicked'
                  | 'other_provider_selected'
                  | 'close'
          }
      >

export const ChangeAccount = ({
    selectedProvider,
    accounts,
    portfolioMap,
    alternativeProvider,
    onMsg,
    sessionPassword,
    keystoreMap,
    networkRPCMap,
    networkMap,
    customCurrencyMap,
    currencyHiddenMap,
    installationId,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                installationId={installationId}
                alternativeProvider={alternativeProvider}
                currencyHiddenMap={currencyHiddenMap}
                selectedProvider={selectedProvider}
                accounts={accounts}
                portfolioMap={portfolioMap}
                keystores={keystoreMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'track_wallet_clicked':
                        case 'account_item_clicked':
                        case 'other_provider_selected':
                            onMsg(msg)
                            break
                        case 'add_new_account_click':
                            setModal({ type: 'select_type_of_account_to_add' })
                            break
                        case 'track_account_click':
                            setModal({
                                type: 'track_account',
                                address: msg.address,
                            })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                customCurrencyMap={customCurrencyMap}
                accountMap={accounts}
                keystoreMap={keystoreMap}
                sessionPassword={sessionPassword}
                state={modal}
                onMsg={async (msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModal({ type: 'closed' })
                            break
                        case 'track_wallet_clicked':
                        case 'safe_wallet_clicked':
                        case 'add_wallet_clicked':
                        case 'hardware_wallet_clicked':
                        case 'on_account_create_request':
                        case 'on_accounts_create_success_animation_finished':
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

                                setModal({
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
