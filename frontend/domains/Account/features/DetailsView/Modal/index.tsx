import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { ShieldFail } from '@zeal/uikit/Icon/ShieldFail'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    EditLabel,
    Msg as EditLabelMsg,
} from '@zeal/domains/Account/domains/Label/components/EditLabel'
import { Receive } from '@zeal/domains/Account/features/Receive'
import {
    KeyStore,
    KeyStoreMap,
    PrivateKey,
    SecretPhrase,
} from '@zeal/domains/KeyStore'
import { ViewPrivateKey } from '@zeal/domains/KeyStore/features/ViewPrivateKey'
import { ViewSecretPhrase } from '@zeal/domains/KeyStore/features/ViewSecretPhrase'

type Props = {
    installationId: string
    accounts: AccountsMap
    keystoreMap: KeyStoreMap
    account: Account
    encryptedPassword: string
    state: State
    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'edit_label'; keystore: KeyStore }
    | { type: 'show_secret_phrase'; keystore: SecretPhrase }
    | { type: 'show_private_key'; keystore: PrivateKey | SecretPhrase }
    | { type: 'show_qr_code'; keystore: KeyStore }
    | { type: 'confirm_delete' }

export type Msg =
    | { type: 'close' }
    | EditLabelMsg
    | MsgOf<typeof Receive>
    | { type: 'confirm_account_delete_click'; account: Account }

export const Modal = ({
    state,
    account,
    accounts,
    encryptedPassword,
    installationId,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'edit_label':
            return (
                <EditLabel
                    accounts={accounts}
                    account={account}
                    keystore={state.keystore}
                    onMsg={onMsg}
                />
            )

        case 'show_private_key':
            return (
                <ViewPrivateKey
                    encryptedPassword={encryptedPassword}
                    keystore={state.keystore}
                    onMsg={onMsg}
                />
            )

        case 'show_secret_phrase':
            return (
                <ViewSecretPhrase
                    encryptedPassword={encryptedPassword}
                    keystore={state.keystore}
                    onMsg={onMsg}
                />
            )

        case 'show_qr_code':
            return (
                <UIModal>
                    <Receive
                        installationId={installationId}
                        account={account}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'confirm_delete':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        icon={({ size }) => (
                            <ShieldFail size={size} color="statusCritical" />
                        )}
                        title={
                            <FormattedMessage
                                id="walletDeleteConfirm.title"
                                defaultMessage="Remove wallet?"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="walletDeleteConfirm.subtitle"
                                defaultMessage="You’ll have to import again to view portfolio or make transactions"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() => {
                                onMsg({ type: 'close' })
                            }}
                        >
                            <FormattedMessage
                                id="action.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>
                        <Button
                            variant="secondary"
                            size="regular"
                            onClick={() =>
                                onMsg({
                                    type: 'confirm_account_delete_click',
                                    account,
                                })
                            }
                        >
                            <FormattedMessage
                                id="walletDeleteConfirm.main_action"
                                defaultMessage="Remove"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
