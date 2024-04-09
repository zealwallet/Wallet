import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    account: Account
    selectedNetwork: CurrentNetwork
    installationId: string
    portfolio: Portfolio
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'close'
                  | 'account_filter_click'
                  | 'network_filter_click'
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

export const TokenList = ({
    account,
    selectedNetwork,
    portfolio,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    currencyPinMap,
    installationId,
    onMsg,
}: Props) => {
    useEffect(() => {
        postUserEvent({
            type: 'TokenListEnteredEvent',
            installationId,
        })
    }, [installationId])

    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })
    return (
        <>
            <Layout
                currencyHiddenMap={currencyHiddenMap}
                currencyPinMap={currencyPinMap}
                networkMap={networkMap}
                account={account}
                portfolio={portfolio}
                selectedNetwork={selectedNetwork}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_add_custom_currency_click':
                            setModalState({
                                type: 'add_custom_currency',
                                network: msg.network,
                            })
                            break

                        case 'on_show_hidden_token_click':
                            setModalState({
                                type: 'hidden_tokens',
                            })
                            break
                        case 'close':
                        case 'account_filter_click':
                        case 'network_filter_click':
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
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                portfolio={portfolio}
                currencyHiddenMap={currencyHiddenMap}
                currencyPinMap={currencyPinMap}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_token_click':
                            onMsg(msg)
                            break

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
