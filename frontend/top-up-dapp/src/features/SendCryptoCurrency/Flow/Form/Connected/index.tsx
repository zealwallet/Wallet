import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { FXRate } from '@zeal/domains/FXRate'
import { fetchServerPortfolio } from '@zeal/domains/Portfolio/api/fetchPortfolio'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

import { ConnectionState } from '../ConnectionState'
import { Form } from '../validation'

type Props = {
    connectionState: Extract<
        ConnectionState,
        { type: 'connected' | 'connected_to_unsupported_network' }
    >
    zealAccount: Account
    topUpCurrencies: CryptoCurrency[]
    ratePollable: PollableData<
        { rate: FXRate; currencies: KnownCurrencies },
        Form
    >
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'on_form_submitted'
                  | 'on_form_change'
                  | 'on_connect_to_correct_network_clicked'
          }
      >
    | Extract<MsgOf<typeof Modal>, { type: 'on_crypto_currency_selected' }>

export const Connected = ({
    connectionState,
    ratePollable,
    onMsg,
    zealAccount,
    topUpCurrencies,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetchServerPortfolio, {
        type: 'loading',
        params: {
            address: connectionState.account.address,
            forceRefresh: false,
        },
    })

    useEffect(() => {
        setLoadable({
            type: 'loading',
            params: {
                address: connectionState.account.address,
                forceRefresh: false,
            },
        })
    }, [setLoadable, connectionState.account.address])

    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                connectionState={connectionState}
                portfolioLoadable={loadable}
                ratePollable={ratePollable}
                zealAccount={zealAccount}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_crypto_currency_selector_clicked':
                            setModal({ type: 'crypto_currency_selector' })
                            break
                        case 'on_form_submitted':
                        case 'on_form_change':
                        case 'on_connect_to_correct_network_clicked':
                            onMsg(msg)
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                form={ratePollable.params}
                state={modal}
                portfolioLoadable={loadable}
                topUpCurrencies={topUpCurrencies}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_crypto_currency_selected':
                            setModal({ type: 'closed' })
                            onMsg(msg)
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
