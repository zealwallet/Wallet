import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { ConnectToLedger } from './ConnectToLedger'
import { SelectAddresses } from './SelectAddresses'
import { Success } from './Success'

type Props = {
    accounts: Account[]
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof SelectAddresses>,
          { type: 'on_account_create_request' }
      >
    | MsgOf<typeof Success>
    | { type: 'close' }

type State =
    | { type: 'connect_to_ledger' }
    | { type: 'success' }
    | {
          type: 'select_address'
          addresses: { path: string; address: Address }[]
      }

export const Flow = ({
    accounts,
    keystoreMap,
    customCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'connect_to_ledger' })

    switch (state.type) {
        case 'select_address':
            return (
                <SelectAddresses
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencies={customCurrencies}
                    keystoreMap={keystoreMap}
                    accounts={accounts}
                    addresses={state.addresses}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setState({ type: 'connect_to_ledger' })
                                break

                            case 'on_account_create_request':
                                setState({ type: 'success' })
                                onMsg(msg)
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        case 'connect_to_ledger':
            return (
                <ConnectToLedger
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'leger_connected_success':
                                setState({
                                    type: 'select_address',
                                    addresses: msg.addresses,
                                })
                                break

                            case 'close':
                                onMsg(msg)
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        case 'success':
            return <Success onMsg={onMsg} />

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
