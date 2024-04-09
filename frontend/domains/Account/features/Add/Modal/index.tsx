import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { AddFromHardwareWallet } from '@zeal/domains/Account/features/AddFromHardwareWallet'
import { AddFromSecretPhrase } from '@zeal/domains/Account/features/AddFromSecretPhrase'
import { CreateNewAccount } from '@zeal/domains/Account/features/CreateNewAccount'
import {
    DEFAULT_WALLET_LABEL,
    generateAccountLabel,
} from '@zeal/domains/Account/helpers/generateAccountsLabel'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { SMART_WALLET_REFERENCE_NETWORK } from '@zeal/domains/Network/constants'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Add4337SafeFromPasskey } from './Add4337SafeFromPasskey'
import { AddFromGoogleDriveRecovery } from './AddFromGoogleDriveRecovery'
import { ChooseImportOrCreateSecretPhrase } from './ChooseImportOrCreateSecretPhrase'
import { RestoreAccount } from './RestoreAccount'

type Props = {
    state: State

    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap

    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap

    sessionPassword: string
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof AddFromHardwareWallet>
    | MsgOf<typeof ChooseImportOrCreateSecretPhrase>
    | MsgOf<typeof RestoreAccount>
    | MsgOf<typeof CreateNewAccount>
    | MsgOf<typeof AddFromGoogleDriveRecovery>
    | MsgOf<typeof AddFromGoogleDriveRecovery>
    | MsgOf<typeof AddFromSecretPhrase>
    | MsgOf<typeof Add4337SafeFromPasskey>

export type State =
    | { type: 'closed' }
    | {
          type: 'add_account_from_existing_phrase'
          secretPhraseMap: Record<
              string,
              { keystore: SecretPhrase; account: Account }[]
          >
      }
    | { type: 'choose_import_or_create_secret_phrase' }
    | { type: 'import_secret_phrase' }
    | { type: 'create_new_secret_phrase' }
    | { type: 'import_private_key' }
    | { type: 'import_from_recovery_kit' }
    | { type: 'import_from_hardware_wallet' }
    | { type: 'import_4337_safe_from_passkey' }

export const Modal = ({
    state,
    accountsMap,
    keystoreMap,
    sessionPassword,
    customCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'add_account_from_existing_phrase':
            return (
                <UIModal>
                    <AddFromSecretPhrase
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        customCurrencies={customCurrencies}
                        accountsMap={accountsMap}
                        keystoreMap={keystoreMap}
                        secretPhraseMap={state.secretPhraseMap}
                        sessionPassword={sessionPassword}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'choose_import_or_create_secret_phrase':
            return (
                <UIModal>
                    <ChooseImportOrCreateSecretPhrase onMsg={onMsg} />
                </UIModal>
            )

        case 'import_secret_phrase':
        case 'import_private_key':
            return (
                <UIModal>
                    <RestoreAccount
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        customCurrencies={customCurrencies}
                        accounts={values(accountsMap)}
                        keystoreMap={keystoreMap}
                        sessionPassword={sessionPassword}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'create_new_secret_phrase':
            return (
                <UIModal>
                    <CreateNewAccount
                        label={generateAccountLabel(
                            values(accountsMap),
                            DEFAULT_WALLET_LABEL
                        )}
                        sessionPassword={sessionPassword}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'import_from_recovery_kit':
            return (
                <UIModal>
                    <AddFromGoogleDriveRecovery
                        sessionPassword={sessionPassword}
                        accounts={accountsMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'import_from_hardware_wallet':
            return (
                <UIModal>
                    <AddFromHardwareWallet
                        currencyHiddenMap={currencyHiddenMap}
                        closable
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        customCurrencies={customCurrencies}
                        accounts={accountsMap}
                        keystoreMap={keystoreMap}
                        sessionPassword={sessionPassword}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'import_4337_safe_from_passkey':
            return (
                <UIModal>
                    <Add4337SafeFromPasskey
                        networkRPCMap={networkRPCMap}
                        network={SMART_WALLET_REFERENCE_NETWORK}
                        accountsMap={accountsMap}
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
