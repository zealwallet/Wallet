import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'close'
                  | 'on_back_button_clicked'
                  | 'on_source_of_funds_selected'
          }
      >
    | Extract<MsgOf<typeof Modal>, { type: 'on_source_of_funds_selected' }>

export const SourceOfFundsForm = ({
    onMsg,
    account,
    network,
    keyStoreMap,
}: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                account={account}
                network={network}
                keyStoreMap={keyStoreMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_back_button_clicked':
                        case 'on_source_of_funds_selected':
                            onMsg(msg)
                            break
                        case 'on_other_source_of_funds_clicked':
                            setState({ type: 'source_of_funds_description' })
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
                        case 'on_source_of_funds_selected':
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
