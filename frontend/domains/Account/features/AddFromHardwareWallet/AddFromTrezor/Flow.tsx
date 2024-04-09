import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, Trezor } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { SelectAccounts } from './SelectAccounts'
import { SyncTrezorPublicKey } from './SyncTrezorPublicKey'

type Props = {
    accounts: Account[]
    keystoreMap: KeyStoreMap
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type State =
    | { type: 'sync_trezor_public_key' }
    | { type: 'select_accounts'; extendedPublicKey: string }
    | { type: 'success' }

type Msg =
    | { type: 'close' }
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: Trezor
          }[]
      }
    | { type: 'on_accounts_create_success_animation_finished' }

export const Flow = ({
    accounts,
    keystoreMap,
    customCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({
        type: 'sync_trezor_public_key',
    })

    switch (state.type) {
        case 'sync_trezor_public_key':
            return (
                <SyncTrezorPublicKey
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break

                            case 'on_trezor_extended_public_key_synced':
                                setState({
                                    type: 'select_accounts',
                                    extendedPublicKey: msg.extendedPublicKey,
                                })
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'select_accounts':
            return (
                <SelectAccounts
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencies={customCurrencies}
                    extendedPublicKey={state.extendedPublicKey}
                    accounts={accounts}
                    keystoreMap={keystoreMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break

                            case 'on_account_create_request':
                                onMsg(msg)
                                setState({ type: 'success' })
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        case 'success':
            return (
                <SuccessLayout
                    onAnimationComplete={() =>
                        onMsg({
                            type: 'on_accounts_create_success_animation_finished',
                        })
                    }
                    title={
                        <FormattedMessage
                            id="AddFromTrezor.success"
                            defaultMessage="Wallets added to Zeal"
                        />
                    }
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
