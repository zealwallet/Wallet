import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { LoadedReloadableData } from '@zeal/toolkit/LoadableData/LoadedReloadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import {
    SwapQuote,
    SwapQuoteRequest,
} from '@zeal/domains/Currency/domains/SwapQuote'
import { KeyStoreMap } from '@zeal/domains/KeyStore'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    pollable: LoadedReloadableData<SwapQuote, SwapQuoteRequest>
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

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
            <Modal
                state={modalState}
                slippagePercent={pollable.params.swapSlippagePercent}
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
