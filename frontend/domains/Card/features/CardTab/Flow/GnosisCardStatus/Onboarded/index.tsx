import { useEffect, useState } from 'react'

import { Side } from '@zeal/uikit/CardWidget'

import { noop, notReachable } from '@zeal/toolkit'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GnosisPayAccountOnboardedState } from '@zeal/domains/Card'
import { SENSITIVE_SECRET_VIEW_TIMEOUT_SECONDS } from '@zeal/domains/Card/constants'

import { Layout } from './Layout'
import { Modal, State } from './Modal'

type Props = {
    encryptedPassword: string
    account: Account
    accountsMap: AccountsMap
    installationId: string
    gnosisPayAccountOnboardedState: GnosisPayAccountOnboardedState
}

export const Onboarded = ({
    account,
    accountsMap,
    gnosisPayAccountOnboardedState,
    installationId,
    encryptedPassword,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'closed' })
    const [side, setSide] = useState<Side>('front')

    useEffect(() => {
        switch (side) {
            case 'front':
                return noop
            case 'back':
                const timer = setTimeout(() => {
                    setSide('front')
                }, SENSITIVE_SECRET_VIEW_TIMEOUT_SECONDS * 1000)
                return () => clearTimeout(timer)
            /* istanbul ignore next */
            default:
                return notReachable(side)
        }
    }, [side])

    return (
        <>
            <Layout
                side={side}
                installationId={installationId}
                account={account}
                gnosisPayAccountOnboardedState={gnosisPayAccountOnboardedState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_card_settings_clicked':
                            setState({ type: 'card_settings' })
                            break
                        case 'on_add_cash_to_card_click':
                            setState({ type: 'add_cash' })
                            break

                        case 'on_show_card_details_click': {
                            switch (side) {
                                case 'front':
                                    setState({ type: 'lock_screen_popup' })
                                    break
                                case 'back':
                                    setSide('front')
                                    break
                                /* istanbul ignore next */
                                default:
                                    notReachable(side)
                            }
                            break
                        }

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                accountsMap={accountsMap}
                gnosisPayAccountOnboardedState={gnosisPayAccountOnboardedState}
                installationId={installationId}
                state={state}
                encryptedPassword={encryptedPassword}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'lock_screen_close_click':
                            setState({ type: 'closed' })
                            break

                        case 'session_password_decrypted':
                            setState({ type: 'closed' })
                            setSide('back')
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
