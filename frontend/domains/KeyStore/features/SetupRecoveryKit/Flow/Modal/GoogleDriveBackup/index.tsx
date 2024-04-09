import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'

import { BeforeYouBegin } from './BeforeYouBegin'
import { UploadFileToGDrive } from './UploadFileToGDrive'

type Props = {
    encryptedPassword: string
    keystore: SecretPhrase
    account: Account
    accounts: AccountsMap
    keystoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | MsgOf<typeof UploadFileToGDrive>

type State = { type: 'before_you_begin' } | { type: 'upload_file_to_gdrive' }

export const GoogleDriveBackup = ({
    accounts,
    account,
    keystoreMap,
    keystore,
    encryptedPassword,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'before_you_begin' })
    switch (state.type) {
        case 'before_you_begin':
            return (
                <BeforeYouBegin
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_continue_clicked':
                                setState({ type: 'upload_file_to_gdrive' })
                                break
                            case 'close':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'upload_file_to_gdrive':
            return (
                <UploadFileToGDrive
                    encryptedPassword={encryptedPassword}
                    keystore={keystore}
                    account={account}
                    accounts={accounts}
                    keystoreMap={keystoreMap}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
