import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { EnableNotificationsPrompt } from './EnableNotificationsPrompt'

type Props = {
    account: Account
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_card_imported_success_animation_complete'
    address: Address
}

type State =
    | { type: 'card_imported_success' }
    | { type: 'enable_notifications_prompt' }

export const CardImported = ({
    account,
    onMsg,
    accountsMap,
    keyStoreMap,
    installationId,
}: Props) => {
    // FIXME @resetko-zeal do same permissions loading as in OrderNewCard.tsx before showing the wizard
    const [state, setState] = useState<State>({ type: 'card_imported_success' })

    switch (state.type) {
        case 'card_imported_success':
            return (
                <SuccessLayout
                    title={
                        <FormattedMessage
                            id="gnosisPayAccountStatus.success.title"
                            defaultMessage="Card imported"
                        />
                    }
                    onAnimationComplete={() => {
                        // FIXME @resetko-zeal switch over platform and fire message if web, switch state if mobile
                        postUserEvent({
                            installationId: installationId,
                            type: 'CardImportSuccessEvent',
                        })
                        return setState({ type: 'enable_notifications_prompt' })
                    }}
                />
            )

        case 'enable_notifications_prompt':
            return (
                <EnableNotificationsPrompt
                    accountsMap={accountsMap}
                    keyStoreMap={keyStoreMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_user_skipped_notifications':
                            case 'on_user_enabled_notifications':
                                onMsg({
                                    type: 'on_card_imported_success_animation_complete',
                                    address: account.address,
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        default:
            return notReachable(state)
    }
}
