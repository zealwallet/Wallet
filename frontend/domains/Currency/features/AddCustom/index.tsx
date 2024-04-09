import React, { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { CryptoCurrency } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    cryptoCurrency: CryptoCurrency | null
    network: Network
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_custom_currency_delete_request'
                  | 'on_custom_currency_update_request'
          }
      >

export const AddCustom = ({
    network,
    networkRPCMap,
    cryptoCurrency,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    useEffect(() => {
        if (
            cryptoCurrency &&
            network.hexChainId !== cryptoCurrency.networkHexChainId
        ) {
            captureError(
                new ImperativeError(
                    `network should be same as to cryptoCurrency.networkHexChainId`,
                    {
                        network,
                        networkHexChainId: cryptoCurrency.networkHexChainId,
                    }
                )
            )
        }
    }, [network, cryptoCurrency])

    return (
        <>
            <Layout
                network={network}
                networkRPCMap={networkRPCMap}
                currency={cryptoCurrency}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break
                        case 'custom_currency_delete_click':
                            setModalState({
                                type: 'confirm_currency_delete',
                                currency: msg.currency,
                            })
                            break
                        case 'on_custom_currency_updated':
                            setModalState({
                                type: 'update_success',
                                currency: msg.currency,
                            })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break
                        case 'custom_currency_delete_confirmation_click':
                            setModalState({
                                type: 'delete_success',
                                currency: msg.currency,
                            })
                            break
                        case 'on_custom_currency_delete_request':
                        case 'on_custom_currency_update_request':
                            setModalState({ type: 'closed' })
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
