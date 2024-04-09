import React from 'react'
import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    secretPhraseMap: Record<
        string,
        { keystore: SecretPhrase; account: Account }[]
    >
    keystoreMap: KeyStoreMap
    customCurrencies: CustomCurrencyMap
    accountsMap: AccountsMap
    sessionPassword: string
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | Extract<MsgOf<typeof Modal>, { type: 'on_account_create_request' }>

export const SelectPhrase = ({
    accountsMap,
    sessionPassword,
    customCurrencies,
    secretPhraseMap,
    keystoreMap,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                secretPhraseMap={secretPhraseMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg({ type: 'close' })
                            break

                        case 'on_phrase_selected':
                            setModal({
                                type: 'account_selection',
                                keystore: msg.keystore,
                            })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                customCurrencies={customCurrencies}
                sessionPassword={sessionPassword}
                accountsMap={accountsMap}
                keystoreMap={keystoreMap}
                state={modal}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_account_create_request':
                            onMsg(msg)
                            break

                        case 'close':
                            setModal({ type: 'closed' })
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
