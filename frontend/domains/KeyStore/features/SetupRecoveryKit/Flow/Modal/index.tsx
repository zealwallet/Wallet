import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { WriteDownSecretPhrase } from '@zeal/domains/KeyStore/features/WriteDownSecretPhrase'

import { GoogleDriveBackup } from './GoogleDriveBackup'

type Props = {
    state: State
    accounts: AccountsMap
    keystoreMap: KeyStoreMap

    encryptedPassword: string
    keystore: SecretPhrase
    account: Account
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof WriteDownSecretPhrase>
    | MsgOf<typeof GoogleDriveBackup>

export type State =
    | { type: 'closed' }
    | { type: 'on_google_drive_backup' }
    | { type: 'on_write_down_secret_phrase' }

export const Modal = ({
    state,
    account,
    accounts,
    keystoreMap,
    keystore,
    encryptedPassword,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'on_google_drive_backup':
            return (
                <UIModal>
                    <GoogleDriveBackup
                        encryptedPassword={encryptedPassword}
                        accounts={accounts}
                        keystore={keystore}
                        account={account}
                        keystoreMap={keystoreMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'on_write_down_secret_phrase':
            return (
                <WriteDownSecretPhrase
                    keystoreMap={keystoreMap}
                    accounts={accounts}
                    keystore={keystore}
                    account={account}
                    encryptedPassword={encryptedPassword}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
