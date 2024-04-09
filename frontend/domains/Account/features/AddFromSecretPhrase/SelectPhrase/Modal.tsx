import React from 'react'

import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { SelectAccount } from '../SelectAccount'

type Props = {
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    state: State
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'account_selection'; keystore: SecretPhrase }

type Msg = { type: 'close' } | MsgOf<typeof SelectAccount>

export const Modal = ({
    state,
    accountsMap,
    sessionPassword,
    keystoreMap,
    customCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'account_selection':
            return (
                <UIModal>
                    <SelectAccount
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        customCurrencies={customCurrencies}
                        keystoreMap={keystoreMap}
                        sessionPassword={sessionPassword}
                        accountsMap={accountsMap}
                        keystore={state.keystore}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        default:
            return notReachable(state)
    }
}
