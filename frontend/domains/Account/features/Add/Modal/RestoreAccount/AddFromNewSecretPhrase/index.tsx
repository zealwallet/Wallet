import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { AccountSelection } from './AccountSelection'
import { Form } from './Form'

type Props = {
    accounts: Account[]
    sessionPassword: string
    initialSecretPhrase: string
    keystoreMap: KeyStoreMap
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type State =
    | { type: 'form' }
    | {
          type: 'account_selection'
          encryptedPhrase: string
      }

type Msg =
    | Extract<
          MsgOf<typeof Form>,
          { type: 'on_user_cleared_secret_phrase' | 'close' }
      >
    | Extract<
          MsgOf<typeof AccountSelection>,
          {
              type:
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >

export const AddFromNewSecretPhrase = ({
    sessionPassword,
    accounts,
    initialSecretPhrase,
    keystoreMap,
    customCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({
        type: 'form',
    })

    switch (state.type) {
        case 'form':
            return (
                <Form
                    sessionPassword={sessionPassword}
                    initialSecretPhrase={initialSecretPhrase}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_user_cleared_secret_phrase':
                            case 'close':
                                onMsg(msg)
                                break

                            case 'on_encrypted_secret_phrase_submitted':
                                setState({
                                    type: 'account_selection',
                                    encryptedPhrase: msg.encryptedPhrase,
                                })
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'account_selection':
            return (
                <AccountSelection
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencies={customCurrencies}
                    keystoreMap={keystoreMap}
                    encryptedPhrase={state.encryptedPhrase}
                    accounts={accounts}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(state)
    }
}
