import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { Popup } from '@zeal/uikit/Popup'
import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'secret_phrase_accounts_hint' }
    | { type: 'success' }

type Msg =
    | { type: 'close' }
    | { type: 'on_accounts_create_success_animation_finished' }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'success':
            return (
                <UIModal>
                    <SuccessLayout
                        onAnimationComplete={() =>
                            onMsg({
                                type: 'on_accounts_create_success_animation_finished',
                            })
                        }
                        title={
                            <FormattedMessage
                                id="AddFromNewSecretPhrase.success"
                                defaultMessage="Wallets added to Zeal"
                            />
                        }
                    />
                </UIModal>
            )

        case 'secret_phrase_accounts_hint':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        title={
                            <FormattedMessage
                                id="AddFromNewSecretPhrase.secretPhraseTip.title"
                                defaultMessage="Secret Phrase Wallets"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="AddFromNewSecretPhrase.secretPhraseTip.subtitle"
                                defaultMessage="A Secret Phrase acts like a keychain for millions of wallets, each with a unique private key.{br}{br}You can import as many wallets as you need now or add more later."
                                values={{
                                    br: '\n',
                                }}
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() => onMsg({ type: 'close' })}
                        >
                            <FormattedMessage
                                id="actions.continue"
                                defaultMessage="Continue"
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
