import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { SelectTypeOfAccountToAdd } from '@zeal/domains/Account/components/SelectTypeOfAccountToAdd'
import { AddFromSecretPhrase } from '@zeal/domains/Account/features/AddFromSecretPhrase'
import { CreateNewSafe4337WithStories } from '@zeal/domains/Account/features/CreateNewSafe4337WithStories'
import { TrackWallet } from '@zeal/domains/Account/features/TrackWallet'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { LabelAddress } from './LabelAddress'

type Props = {
    state: State
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    installationId: string
    customCurrencies: CustomCurrencyMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | MsgOf<typeof LabelAddress>
    | MsgOf<typeof SelectTypeOfAccountToAdd>
    | MsgOf<typeof TrackWallet>
    | MsgOf<typeof AddFromSecretPhrase>

export type State =
    | { type: 'closed' }
    | { type: 'label_address'; address: Address }
    | {
          type: 'add_from_secret_phrase'
          secretPhraseMap: Record<
              string,
              {
                  keystore: SecretPhrase
                  account: Account
              }[]
          >
      }
    | { type: 'add_wallet' }
    | { type: 'add_tracked' }
    | { type: 'safe_4337_wallet_creation' }

export const Modal = ({
    state,
    accountsMap,
    customCurrencies,
    networkMap,
    installationId,
    networkRPCMap,
    sessionPassword,
    keyStoreMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'label_address':
            return (
                <LabelAddress
                    accountsMap={accountsMap}
                    address={state.address}
                    onMsg={onMsg}
                />
            )

        case 'add_wallet':
            return <SelectTypeOfAccountToAdd onMsg={onMsg} />

        case 'add_tracked':
            return (
                <UIModal>
                    <TrackWallet
                        installationId={installationId}
                        currencyHiddenMap={currencyHiddenMap}
                        customCurrencies={customCurrencies}
                        keyStoreMap={keyStoreMap}
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
                <AddFromSecretPhrase
                    currencyHiddenMap={currencyHiddenMap}
                    accountsMap={accountsMap}
                    customCurrencies={customCurrencies}
                    keystoreMap={keyStoreMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    secretPhraseMap={state.secretPhraseMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        case 'safe_4337_wallet_creation':
            return (
                <UIModal>
                    <CreateNewSafe4337WithStories
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
