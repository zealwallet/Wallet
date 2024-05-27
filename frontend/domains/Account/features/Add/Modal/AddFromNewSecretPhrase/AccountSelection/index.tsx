import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { useReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { generateSecretPhraseAddress } from '@zeal/domains/KeyStore/helpers/generateSecretPhraseAddress'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    accounts: Account[]
    keystoreMap: KeyStoreMap
    sessionPassword: string
    encryptedPhrase: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof Modal>,
          { type: 'on_accounts_create_success_animation_finished' }
      >
    | Extract<MsgOf<typeof Layout>, { type: 'on_account_create_request' }>

const fetch = async (
    ...args: Parameters<typeof generateSecretPhraseAddress>
): Promise<{ address: Address; path: string }[]> => {
    const addressWithPath = await generateSecretPhraseAddress(...args)
    return [addressWithPath]
}

const toggleSelected = (selected: Address[], address: Address): Address[] =>
    selected.find((item) => item === address)
        ? selected.filter((item) => item !== address)
        : [...selected, address]

export const AccountSelection = ({
    accounts,
    encryptedPhrase,
    sessionPassword,
    keystoreMap,
    customCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })
    const [selected, setSelected] = useState<Address[]>([])

    const [reloadable, setReloadable] = useReloadableData(
        fetch,
        {
            type: 'loading',
            params: { encryptedPhrase, offset: 0, sessionPassword },
        },
        {
            accumulate: (newData, prevData) => {
                return [...prevData, ...newData]
            },
        }
    )

    return (
        <>
            <Layout
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                customCurrencies={customCurrencies}
                accounts={accounts}
                encryptedPhrase={encryptedPhrase}
                keystoreMap={keystoreMap}
                reloadable={reloadable}
                selected={selected}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_account_create_request':
                            setModal({ type: 'success' })
                            onMsg(msg)
                            break

                        case 'close':
                            onMsg(msg)
                            break

                        case 'header_info_icon_click':
                            setModal({ type: 'secret_phrase_accounts_hint' })
                            break

                        case 'on_item_click':
                            setSelected(toggleSelected(selected, msg.address))
                            break

                        case 'try_again_clicked': {
                            switch (reloadable.type) {
                                case 'subsequent_failed':
                                    setReloadable({
                                        type: 'reloading',
                                        params: reloadable.params,
                                        data: reloadable.data,
                                    })
                                    break
                                case 'error':
                                    setReloadable({
                                        type: 'loading',
                                        params: reloadable.params,
                                    })
                                    break
                                case 'loading':
                                case 'loaded':
                                case 'reloading':
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(reloadable)
                            }
                            break
                        }

                        case 'on_scroll_marker_reached':
                            setReloadable({
                                type: 'reloading',
                                data: msg.currentData,
                                params: {
                                    encryptedPhrase: encryptedPhrase,
                                    sessionPassword: sessionPassword,
                                    offset: reloadable.params.offset + 1,
                                },
                            })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                state={modal}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModal({ type: 'closed' })
                            break

                        case 'on_accounts_create_success_animation_finished':
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
