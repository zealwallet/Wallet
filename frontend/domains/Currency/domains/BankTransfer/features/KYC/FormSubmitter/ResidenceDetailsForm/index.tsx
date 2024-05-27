import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'

import { InitialResidenceDetails, Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

export type { InitialResidenceDetails } from './Layout'

type Props = {
    initialResidenceDetails: InitialResidenceDetails
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

export type Msg = Extract<
    MsgOf<typeof Layout>,
    { type: 'on_form_submitted' | 'close' }
>

export const ResidenceDetailsForm = ({
    initialResidenceDetails,
    account,
    network,
    keyStoreMap,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })
    const [form, setForm] = useState<InitialResidenceDetails>(
        initialResidenceDetails
    )

    return (
        <>
            <Layout
                account={account}
                network={network}
                keyStoreMap={keyStoreMap}
                form={form}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_select_country_click':
                            setModalState({ type: 'select_country' })
                            break
                        case 'on_form_submitted':
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_form_change':
                            setForm(msg.form)
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                form={form}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break
                        case 'on_country_selected':
                            setModalState({ type: 'closed' })
                            setForm({
                                ...form,
                                country: msg.countryCode,
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
