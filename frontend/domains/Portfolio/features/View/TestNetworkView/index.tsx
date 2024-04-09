import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import {
    CurrencyHiddenMap,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import {
    CustomNetwork,
    NetworkMap,
    NetworkRPCMap,
    TestNetwork,
} from '@zeal/domains/Network'
import { Token } from '@zeal/domains/Token'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    fetchedAt: Date
    network: TestNetwork | CustomNetwork
    tokens: Token[]
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    knownCurrencies: KnownCurrencies
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'show_all_tokens_click'
                  | 'reload_button_click'
                  | 'on_token_click'
          }
      >
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_custom_currency_delete_request'
                  | 'on_custom_currency_update_request'
          }
      >

export const TestNetworkView = ({
    fetchedAt,
    knownCurrencies,
    tokens,
    network,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                currencyHiddenMap={currencyHiddenMap}
                currencyPinMap={currencyPinMap}
                networkMap={networkMap}
                fetchedAt={fetchedAt}
                knownCurrencies={knownCurrencies}
                tokens={tokens}
                network={network}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_add_custom_currency_click':
                            setModalState({ type: 'add_custom_currency' })
                            break

                        case 'show_all_tokens_click':
                        case 'reload_button_click':
                        case 'on_token_click':
                            onMsg(msg)
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                state={modalState}
                network={network}
                networkRPCMap={networkRPCMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_custom_currency_delete_request':
                        case 'on_custom_currency_update_request':
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break

                        case 'close':
                            setModalState({ type: 'closed' })
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
