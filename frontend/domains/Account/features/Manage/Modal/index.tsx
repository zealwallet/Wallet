import React from 'react'

import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { SelectTypeOfAccountToAdd } from '@zeal/domains/Account/components/SelectTypeOfAccountToAdd'
import {
    AddFromAddress,
    Msg as AddFromAddressMsg,
} from '@zeal/domains/Account/features/AddFromAddress'
import { AddFromSecretPhrase } from '@zeal/domains/Account/features/AddFromSecretPhrase'
import {
    DetailsView,
    Msg as DetailsViewMsg,
} from '@zeal/domains/Account/features/DetailsView'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { ActiveAndTrackedWallets } from './ActiveAndTrackedWallets'

type Props = {
    installationId: string
    state: State
    accounts: AccountsMap
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    encryptedPassword: string
    currencyHiddenMap: CurrencyHiddenMap
    networkRPCMap: NetworkRPCMap
    networkMap: NetworkMap
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | DetailsViewMsg
    | AddFromAddressMsg
    | MsgOf<typeof SelectTypeOfAccountToAdd>
    | MsgOf<typeof AddFromSecretPhrase>

export type State =
    | { type: 'closed' }
    | { type: 'account_details'; address: Address }
    | { type: 'track_account'; address: Address }
    | { type: 'active_and_tracked_wallets' }
    | { type: 'select_type_of_account_to_add' }
    | {
          type: 'add_from_secret_phrase'
          secretPhraseMap: Record<
              string,
              { keystore: SecretPhrase; account: Account }[]
          >
      }

export const Modal = ({
    state,
    keystoreMap,
    portfolioMap,
    accounts,
    installationId,
    encryptedPassword,
    currencyHiddenMap,
    networkRPCMap,
    networkMap,
    sessionPassword,
    customCurrencyMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'add_from_secret_phrase':
            return (
                <UIModal>
                    <AddFromSecretPhrase
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        accountsMap={accounts}
                        keystoreMap={keystoreMap}
                        sessionPassword={sessionPassword}
                        secretPhraseMap={state.secretPhraseMap}
                        customCurrencies={customCurrencyMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'account_details':
            return (
                <UIModal>
                    <DetailsView
                        installationId={installationId}
                        currencyHiddenMap={currencyHiddenMap}
                        keystoreMap={keystoreMap}
                        accounts={accounts}
                        encryptedPassword={encryptedPassword}
                        portfolio={getPortfolio({
                            address: state.address,
                            portfolioMap,
                        })}
                        account={accounts[state.address]}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'select_type_of_account_to_add':
            return <SelectTypeOfAccountToAdd onMsg={onMsg} />

        case 'track_account':
            return (
                <UIModal>
                    <AddFromAddress
                        address={state.address}
                        accountMap={accounts}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'active_and_tracked_wallets':
            return <ActiveAndTrackedWallets onMsg={onMsg} />

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
