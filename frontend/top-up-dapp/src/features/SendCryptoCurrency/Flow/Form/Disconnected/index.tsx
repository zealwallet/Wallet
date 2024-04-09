import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { FXRate } from '@zeal/domains/FXRate'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

import { ConnectionState } from '../ConnectionState'
import { Form } from '../validation'

type Props = {
    pollable: PollableData<{ rate: FXRate; currencies: KnownCurrencies }, Form>
    connectionState: Extract<
        ConnectionState,
        { type: 'disconnected' | 'connecting' | 'reconnecting' }
    >
    zealAccount: Account
    topUpCurrencies: CryptoCurrency[]
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<MsgOf<typeof Layout>, { type: 'on_form_change' }>
    | Extract<MsgOf<typeof Modal>, { type: 'on_crypto_currency_selected' }>

export const Disconnected = ({
    zealAccount,
    topUpCurrencies,
    connectionState,
    pollable,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                connectionState={connectionState}
                zealAccount={zealAccount}
                pollable={pollable}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_connect_wallet_clicked':
                            setModal({ type: 'wallet_selector' })
                            break
                        case 'on_crypto_currency_selector_clicked':
                            setModal({ type: 'crypto_currency_selector' })
                            break
                        case 'on_form_change':
                            onMsg(msg)
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                state={modal}
                topUpCurrencies={topUpCurrencies}
                form={pollable.params}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_crypto_currency_selected':
                            onMsg(msg)
                            setModal({ type: 'closed' })
                            break
                        case 'close':
                            setModal({ type: 'closed' })
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
