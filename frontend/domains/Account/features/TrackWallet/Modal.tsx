import React from 'react'

import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { AccountsMap } from '@zeal/domains/Account'
import { SelectTypeOfAccountToAdd } from '@zeal/domains/Account/components/SelectTypeOfAccountToAdd'
import { Add } from '@zeal/domains/Account/features/Add'
import { AddFromHardwareWallet } from '@zeal/domains/Account/features/AddFromHardwareWallet'
import { CreateNewAccount } from '@zeal/domains/Account/features/CreateNewAccount'
import { CreateNewSafe4337WithStories } from '@zeal/domains/Account/features/CreateNewSafe4337WithStories'
import { generateAccountLabel } from '@zeal/domains/Account/helpers/generateAccountsLabel'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

type Props = {
    state: State
    sessionPassword: string
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    installationId: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof SelectTypeOfAccountToAdd>
    | MsgOf<typeof CreateNewAccount>
    | MsgOf<typeof AddFromHardwareWallet>
    | MsgOf<typeof Add>

export type State =
    | { type: 'closed' }
    | { type: 'select_type_of_account_to_add' }
    | { type: 'create_wallet' }
    | { type: 'safe_4337_wallet' }
    | { type: 'add_wallet' }
    | { type: 'hardware_wallet' }

export const Modal = ({
    state,
    sessionPassword,
    accountsMap,
    currencyHiddenMap,
    customCurrencies,
    keyStoreMap,
    networkMap,
    networkRPCMap,
    installationId,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'select_type_of_account_to_add':
            return <SelectTypeOfAccountToAdd onMsg={onMsg} />

        case 'create_wallet':
            return (
                <UIModal>
                    <CreateNewAccount
                        label={generateAccountLabel(
                            values(accountsMap),
                            'Wallet'
                        )}
                        sessionPassword={sessionPassword}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'safe_4337_wallet':
            return (
                <UIModal>
                    <CreateNewSafe4337WithStories
                        installationId={installationId}
                        accountsMap={accountsMap}
                        networkRPCMap={networkRPCMap}
                        sessionPassword={sessionPassword}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'add_wallet':
            return (
                <UIModal>
                    <Add
                        currencyHiddenMap={currencyHiddenMap}
                        accountsMap={accountsMap}
                        keystoreMap={keyStoreMap}
                        sessionPassword={sessionPassword}
                        customCurrencies={customCurrencies}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'hardware_wallet':
            return (
                <UIModal>
                    <AddFromHardwareWallet
                        accounts={accountsMap}
                        closable
                        currencyHiddenMap={currencyHiddenMap}
                        customCurrencies={customCurrencies}
                        keystoreMap={keyStoreMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        sessionPassword={sessionPassword}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
