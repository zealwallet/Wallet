import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Modal, State } from './Modal'
import { Track } from './Track'

type Props = {
    accountsMap: AccountsMap
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    installationId: string

    keyStoreMap: KeyStoreMap
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap

    variant: 'track' | 'track_or_create'
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof Track>,
          {
              type:
                  | 'close'
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >

export const TrackWallet = ({
    accountsMap,
    installationId,
    sessionPassword,
    variant,
    networkRPCMap,
    currencyHiddenMap,
    customCurrencies,
    keyStoreMap,
    networkMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'closed' })

    return (
        <>
            <Track
                networkRPCMap={networkRPCMap}
                accountsMap={accountsMap}
                variant={variant}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_account_create_request':
                        case 'on_accounts_create_success_animation_finished':
                            onMsg(msg)
                            break

                        case 'on_create_wallet_instead_clicked':
                            setState({ type: 'select_type_of_account_to_add' })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
            <Modal
                installationId={installationId}
                currencyHiddenMap={currencyHiddenMap}
                customCurrencies={customCurrencies}
                keyStoreMap={keyStoreMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                state={state}
                sessionPassword={sessionPassword}
                accountsMap={accountsMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break
                        case 'on_account_create_request':
                        case 'on_accounts_create_success_animation_finished':
                            onMsg(msg)
                            break

                        case 'safe_wallet_clicked':
                            setState({
                                type: 'safe_4337_wallet',
                            })
                            break

                        case 'add_wallet_clicked':
                            setState({ type: 'add_wallet' })
                            break

                        case 'track_wallet_clicked':
                            setState({ type: 'closed' })
                            break

                        case 'hardware_wallet_clicked':
                            setState({ type: 'hardware_wallet' })
                            break

                        case 'create_clicked':
                            setState({ type: 'create_wallet' })
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
