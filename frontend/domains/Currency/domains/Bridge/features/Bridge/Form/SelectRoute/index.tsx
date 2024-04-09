import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { BridgePollable } from '@zeal/domains/Currency/domains/Bridge'
import { KeyStoreMap } from '@zeal/domains/KeyStore'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    pollable: BridgePollable
    keystoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<MsgOf<typeof Layout>, { type: 'close' | 'on_route_selected' }>
    | Extract<MsgOf<typeof Modal>, { type: 'on_set_slippage_percent' }>

export const SelectRoute = ({ pollable, keystoreMap, onMsg }: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                keystoreMap={keystoreMap}
                pollable={pollable}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_route_selected':
                            onMsg(msg)
                            break

                        case 'on_best_return_icon_clicked':
                            setModalState({ type: 'best_return' })
                            break

                        case 'on_slippage_clicked':
                            setModalState({ type: 'set_slippage' })
                            break

                        case 'on_best_service_time_icon_clicked':
                            setModalState({ type: 'best_service_time' })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
            <Modal
                slippagePercent={pollable.params.slippagePercent}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_set_slippage_percent':
                            setModalState({ type: 'closed' })
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
