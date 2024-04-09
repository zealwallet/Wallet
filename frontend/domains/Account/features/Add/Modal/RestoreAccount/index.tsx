import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { AddFromNewSecretPhrase } from './AddFromNewSecretPhrase'
import { AddFromPrivateKey } from './AddFromPrivateKey'

type Props = {
    accounts: Account[]
    sessionPassword: string
    keystoreMap: KeyStoreMap
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof AddFromNewSecretPhrase>,
          { type: 'on_account_create_request' }
      >
    | Extract<
          MsgOf<typeof AddFromPrivateKey>,
          {
              type:
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >

type State =
    | { type: 'create_private_key' }
    | { type: 'add_from_new_secret_phrase'; initialSecretPhrase: string }

export const RestoreAccount = ({
    accounts,
    sessionPassword,
    keystoreMap,
    customCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({
        type: 'create_private_key',
    })

    switch (state.type) {
        case 'create_private_key':
            return (
                <AddFromPrivateKey
                    accounts={accounts}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_account_create_request':
                            case 'on_accounts_create_success_animation_finished':
                            case 'close':
                                onMsg(msg)
                                break

                            case 'on_secret_phrase_detected':
                                setState({
                                    type: 'add_from_new_secret_phrase',
                                    initialSecretPhrase:
                                        msg.initialSecretPhrase,
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'add_from_new_secret_phrase':
            return (
                <AddFromNewSecretPhrase
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencies={customCurrencies}
                    keystoreMap={keystoreMap}
                    accounts={accounts}
                    initialSecretPhrase={state.initialSecretPhrase}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_account_create_request':
                            case 'on_accounts_create_success_animation_finished':
                                onMsg(msg)
                                break

                            case 'on_user_cleared_secret_phrase':
                                setState({ type: 'create_private_key' })
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        default:
            return notReachable(state)
    }
}
