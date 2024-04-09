import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'

import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { Token } from '@zeal/domains/Token'

import { Layout } from './Layout'
import { Modal, State } from './Modal'

type Props = {
    token: Token
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_token_hide_click'; token: Token }
    | { type: 'on_token_un_hide_click'; token: Token }

export const HideUnHideButton = ({
    token,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'closed' })
    return (
        <>
            <Layout
                token={token}
                currencyHiddenMap={currencyHiddenMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_token_hide_click':
                            setState({
                                type: 'confirm_hide_token',
                                token: msg.token,
                            })
                            break
                        case 'on_token_un_hide_click':
                            onMsg(msg)
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                state={state}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break
                        case 'on_hide_token_confirm':
                            setState({
                                type: 'hide_success_screen',
                                token: msg.token,
                            })
                            break
                        case 'on_hide_token_success_animation_finish':
                            setState({ type: 'closed' })
                            onMsg({
                                type: 'on_token_hide_click',
                                token: msg.token,
                            })
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
