import React, { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { useReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'

import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Layout, Msg as LayoutMsg } from './Layout'
import { Modal, State as ModalState } from './Modal'

import { fetchLedgerAddress } from '../api/fetchLedgerAddress'
import { HDPath } from '../helpers/generatePaths'

type Props = {
    addresses: { path: string; address: Address }[]
    customCurrencies: CustomCurrencyMap
    accounts: Account[]
    keystoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg = Extract<
    LayoutMsg,
    { type: 'close' | 'on_account_create_request' }
>

export const SelectAddresses = ({
    addresses,
    keystoreMap,
    customCurrencies,
    accounts,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [selected, setSelected] = useState<Address[]>([])
    const [loadable, setLoadable] = useReloadableData<
        { address: Address; path: string }[],
        { offset: number; hdPath: HDPath }
    >(
        fetchLedgerAddress,
        {
            type: 'loaded',
            params: {
                offset: 0,
                hdPath: 'ledger_live' as const,
            },
            data: addresses,
        },
        {
            accumulate: (newData, prevData) => {
                return [...prevData, ...newData]
            },
        }
    )

    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
                setSelected([])
                break
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed':
            case 'error':
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable])

    return (
        <>
            <Layout
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                customCurrencies={customCurrencies}
                keystoreMap={keystoreMap}
                accounts={accounts}
                selected={selected}
                loadable={loadable}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_account_create_request':
                            onMsg(msg)
                            break

                        case 'change_path_settings_clicked':
                            setModalState({ type: 'select_hd_path' })
                            break
                        case 'item_clicked':
                            const newSelected = selected.includes(
                                msg.item.address
                            )
                                ? selected.filter(
                                      (address) => address !== msg.item.address
                                  )
                                : [msg.item.address, ...selected]
                            setSelected(newSelected)

                            break
                        case 'scroll_marker_trigger':
                            setLoadable({
                                type: 'reloading',
                                params: {
                                    // Since we don't have batch loading we need to load one by one, hence we do just +1
                                    offset: msg.params.offset + 1,
                                    hdPath: msg.params.hdPath,
                                },
                                data: msg.data,
                            })
                            break
                        case 'try_again_clicked': {
                            switch (loadable.type) {
                                case 'subsequent_failed':
                                    setLoadable({
                                        type: 'reloading',
                                        params: loadable.params,
                                        data: loadable.data,
                                    })
                                    break
                                case 'error':
                                    setLoadable({
                                        type: 'loading',
                                        params: loadable.params,
                                    })
                                    break
                                case 'loading':
                                case 'loaded':
                                case 'reloading':
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(loadable)
                            }
                            break
                        }
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                hdPath={loadable.params.hdPath}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break
                        case 'hd_path_selected':
                            setModalState({ type: 'closed' })
                            setLoadable({
                                type: 'loading',
                                params: {
                                    offset: 0,
                                    hdPath: msg.hdPath,
                                },
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
