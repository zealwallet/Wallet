import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import {
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    networks: CurrentNetwork[]
    currencies: CurrencyId[]
    currentNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    installationId: string

    networkMap: NetworkMap
    selectedCurrencyId: CurrencyId | null

    account: Account
    keyStoreMap: KeyStoreMap
    portfolio: Portfolio

    knownCurrencies: KnownCurrencies

    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap

    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_network_item_click'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
          }
      >
    | Extract<
          MsgOf<typeof Layout>,
          { type: 'close' | 'on_currency_selected' | 'try_again_clicked' }
      >

export const SelectCurrencyAndNetwork = ({
    currentNetwork,
    networks,
    account,
    keyStoreMap,
    portfolio,
    selectedCurrencyId,
    currencies,
    knownCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    currencyPinMap,
    installationId,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                currencyHiddenMap={currencyHiddenMap}
                currencyPinMap={currencyPinMap}
                networkMap={networkMap}
                selectedCurrencyId={selectedCurrencyId}
                currencies={currencies}
                knownCurrencies={knownCurrencies}
                portfolio={portfolio}
                account={account}
                keystoreMap={keyStoreMap}
                currentNetwork={currentNetwork}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_currency_selected':
                            onMsg(msg)
                            break

                        case 'on_network_selection_click':
                            setModal({ type: 'select_network' })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                installationId={installationId}
                networkMap={networkMap}
                currencyHiddenMap={currencyHiddenMap}
                account={account}
                keyStoreMap={keyStoreMap}
                portfolio={portfolio}
                currentNetwork={currentNetwork}
                networkRPCMap={networkRPCMap}
                state={modal}
                networks={networks}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModal({ type: 'closed' })
                            break

                        case 'on_rpc_change_confirmed':
                        case 'on_select_rpc_click':
                        case 'on_network_item_click':
                            onMsg(msg)
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
