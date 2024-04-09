import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { ShieldFail } from '@zeal/uikit/Icon/ShieldFail'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'

type Props = {
    state: State
    account: Account
    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'confirm_skip_verification' }

type Msg =
    | { type: 'on_skip_verification_click'; account: Account }
    | { type: 'on_write_down_click' }

export const Modal = ({ state, account, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'confirm_skip_verification':
            return (
                <Popup.Layout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_write_down_click' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg.type)
                        }
                    }}
                >
                    <Header
                        icon={({ size }) => (
                            <ShieldFail
                                size={size}
                                color="iconStatusCritical"
                            />
                        )}
                        title={
                            <FormattedMessage
                                id="SecretPhraseReveal.skip.title"
                                defaultMessage="Skip writing down phrase?"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="SecretPhraseReveal.skip.subtitle"
                                defaultMessage="While you can do this later, if you lose this device before writing down your phrase, you’ll lose all assets you’ve added to this wallet"
                            />
                        }
                    />

                    <Popup.Actions>
                        <Button
                            size="regular"
                            variant="secondary"
                            onClick={() =>
                                onMsg({
                                    type: 'on_skip_verification_click',
                                    account,
                                })
                            }
                        >
                            <FormattedMessage
                                id="SecretPhraseReveal.skip.takeTheRisk"
                                defaultMessage="I’ll take the risk"
                            />
                        </Button>

                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() =>
                                onMsg({ type: 'on_write_down_click' })
                            }
                        >
                            <FormattedMessage
                                id="SecretPhraseReveal.skip.writeDown"
                                defaultMessage="Write down"
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
