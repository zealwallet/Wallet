import React from 'react'

import { notReachable } from '@zeal/toolkit'
import { ReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'

import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Loaded, Msg as LoadedMsg } from './Loaded'
import { Loading, Msg as LoadingMsg } from './Loading'

import { HDPath } from '../../helpers/generatePaths'

type Props = {
    selected: Address[]
    accounts: Account[]
    customCurrencies: CustomCurrencyMap
    keystoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    loadable: ReloadableData<
        { address: Address; path: string }[],
        { offset: number; hdPath: HDPath }
    >
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg = LoadingMsg | LoadedMsg

export const Layout = ({
    loadable,
    keystoreMap,
    accounts,
    selected,
    customCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    switch (loadable.type) {
        case 'loading':
            return <Loading onMsg={onMsg} />
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <Loaded
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencies={customCurrencies}
                    keystoreMap={keystoreMap}
                    accounts={accounts}
                    selected={selected}
                    onMsg={onMsg}
                    loadable={loadable}
                />
            )
        case 'error':
            return (
                <AppErrorPopup
                    error={parseAppError(loadable.error)}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
