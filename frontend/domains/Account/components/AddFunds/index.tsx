import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'

import { Layout } from './Layout'
import { Modal, State } from './Modal'

type Props = {
    account: Account
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof Layout>,
          { type: 'from_any_wallet_click' | 'bank_transfer_click' }
      >

export const AddFunds = ({ account, installationId, onMsg }: Props) => {
    const [state, setState] = useState<State>({ type: 'close' })

    return (
        <>
            <Layout
                account={account}
                installationId={installationId}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'bank_transfer_click':
                        case 'from_any_wallet_click':
                            onMsg(msg)
                            break
                        case 'receive_click':
                            setState({ type: 'receive_funds' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                installationId={installationId}
                state={state}
                account={account}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'close' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg.type)
                    }
                }}
            />
        </>
    )
}
