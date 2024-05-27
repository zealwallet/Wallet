import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Address } from '@zeal/domains/Address'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Layout } from './Layout'
import { Modal, State } from './Modal'

type Props = {
    installationId: string
    address: Address
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof Modal>,
          { type: 'on_bridge_clicked' | 'on_swap_clicked' }
      >
    | Extract<
          MsgOf<typeof Layout>,
          { type: 'on_add_funds_click' | 'on_send_clicked' | 'on_bank_clicked' }
      >
export const QuickActionsWidget = ({
    onMsg,
    address,
    installationId,
}: Props) => {
    const [modalState, setModalState] = useState<State>({
        type: 'closed',
    })
    return (
        <>
            <Layout
                address={address}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_exchange_clicked':
                            setModalState({
                                type: 'choose_swap_bridge',
                            })
                            break
                        case 'on_add_funds_click':
                            postUserEvent({
                                type: 'ReceiveFlowEnteredEvent',
                                installationId,
                                location: 'portfolio_quick_actions',
                            })
                            onMsg(msg)
                            break
                        case 'on_bank_clicked':
                            onMsg(msg)
                            break

                        case 'on_send_clicked':
                            postUserEvent({
                                type: 'SendFlowEnteredEvent',
                                location: 'portfolio_quick_actions',
                                installationId,
                                asset: 'token',
                            })
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
                address={address}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break
                        case 'on_bridge_clicked':
                            postUserEvent({
                                type: 'BridgeFlowEnteredEvent',
                                location: 'portfolio_quick_actions',
                                installationId,
                            })
                            onMsg(msg)
                            break

                        case 'on_swap_clicked':
                            postUserEvent({
                                type: 'SwapFlowEnteredEvent',
                                installationId,
                                location: 'portfolio_quick_actions',
                            })
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
