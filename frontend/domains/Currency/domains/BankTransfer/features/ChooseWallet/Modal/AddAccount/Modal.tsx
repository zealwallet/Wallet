import React from 'react'

import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Add } from '@zeal/domains/Account/features/Add'
import { AddFromHardwareWallet } from '@zeal/domains/Account/features/AddFromHardwareWallet'
import { AddFromSecretPhrase } from '@zeal/domains/Account/features/AddFromSecretPhrase'
import { CreateNewSafe4337 } from '@zeal/domains/Account/features/CreateNewSafe4337'
import { TrackWallet } from '@zeal/domains/Account/features/TrackWallet'
import { EncryptedPhrase } from '@zeal/domains/Account/helpers/groupBySecretPhrase'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

type Props = {
    state: State
    installationId: string
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof AddFromSecretPhrase>
    | MsgOf<typeof TrackWallet>
    | MsgOf<typeof AddFromHardwareWallet>
    | MsgOf<typeof CreateNewSafe4337>
    | MsgOf<typeof Add>

export type State =
    | { type: 'closed' }
    | {
          type: 'add_from_secret_phrase'
          secretPhraseMap: Record<
              EncryptedPhrase,
              { keystore: SecretPhrase; account: Account }[]
          >
      }
    | { type: 'create_contact' }
    | { type: 'add_hardware_wallet' }
    | { type: 'add_account' }
    | { type: 'safe_4337_wallet_creation' }

export const Modal = ({
    state,
    accountsMap,
    keystoreMap,
    networkMap,
    networkRPCMap,
    onMsg,
    sessionPassword,
    customCurrencies,
    installationId,
    currencyHiddenMap,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'add_account':
            return (
                <UIModal>
                    <Add
                        currencyHiddenMap={currencyHiddenMap}
                        accountsMap={accountsMap}
                        keystoreMap={keystoreMap}
                        sessionPassword={sessionPassword}
                        customCurrencies={customCurrencies}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'create_contact':
            return (
                <UIModal>
                    <TrackWallet
                        installationId={installationId}
                        currencyHiddenMap={currencyHiddenMap}
                        customCurrencies={customCurrencies}
                        keyStoreMap={keystoreMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        sessionPassword={sessionPassword}
                        variant="track"
                        accountsMap={accountsMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'add_from_secret_phrase':
            return (
                <UIModal>
                    <AddFromSecretPhrase
                        currencyHiddenMap={currencyHiddenMap}
                        accountsMap={accountsMap}
                        keystoreMap={keystoreMap}
                        customCurrencies={customCurrencies}
                        secretPhraseMap={state.secretPhraseMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        sessionPassword={sessionPassword}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'add_hardware_wallet':
            return (
                <UIModal>
                    <AddFromHardwareWallet
                        currencyHiddenMap={currencyHiddenMap}
                        accounts={accountsMap}
                        keystoreMap={keystoreMap}
                        sessionPassword={sessionPassword}
                        customCurrencies={customCurrencies}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        closable
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'safe_4337_wallet_creation':
            return (
                <UIModal>
                    <CreateNewSafe4337
                        installationId={installationId}
                        sessionPassword={sessionPassword}
                        networkRPCMap={networkRPCMap}
                        accountsMap={accountsMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
