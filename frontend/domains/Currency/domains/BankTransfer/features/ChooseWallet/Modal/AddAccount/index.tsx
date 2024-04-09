import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { AccountsMap } from '@zeal/domains/Account'
import { SelectTypeOfAccountToAdd } from '@zeal/domains/Account/components/SelectTypeOfAccountToAdd'
import { groupBySecretPhrase } from '@zeal/domains/Account/helpers/groupBySecretPhrase'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Modal, State as ModalState } from './Modal'

type Props = {
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    installationId: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type State = { type: 'select_account_to_add' }

export type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_accounts_create_success_animation_finished'
                  | 'on_account_create_request'
                  | 'hardware_wallet_clicked'
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'safe_wallet_clicked'
          }
      >

export const AddAccount = ({
    keystoreMap,
    accountsMap,
    sessionPassword,
    customCurrencies,
    installationId,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })
    return (
        <>
            <SelectTypeOfAccountToAdd
                onMsg={async (msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break
                        case 'add_wallet_clicked':
                            setState({ type: 'add_account' })
                            break
                        case 'hardware_wallet_clicked':
                            setState({ type: 'add_hardware_wallet' })
                            break

                        case 'track_wallet_clicked':
                            setState({ type: 'create_contact' })
                            break

                        case 'create_clicked':
                            try {
                                const secretPhraseMap =
                                    await groupBySecretPhrase(
                                        values(accountsMap),
                                        keystoreMap,
                                        sessionPassword
                                    )

                                setState({
                                    type: 'add_from_secret_phrase',
                                    secretPhraseMap,
                                })
                            } catch (e) {
                                captureError(e)
                            }
                            break
                        case 'safe_wallet_clicked':
                            setState({
                                type: 'safe_4337_wallet_creation',
                            })
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
                state={state}
                accountsMap={accountsMap}
                keystoreMap={keystoreMap}
                sessionPassword={sessionPassword}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                customCurrencies={customCurrencies}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break
                        case 'on_account_create_request':
                        case 'on_accounts_create_success_animation_finished':
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
