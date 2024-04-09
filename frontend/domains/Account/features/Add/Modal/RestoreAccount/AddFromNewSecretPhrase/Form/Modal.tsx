import { FormattedMessage } from 'react-intl'

import { Modal as UIModal } from '@zeal/uikit/Modal'
import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_encrypted_secret_phrase_submitted'
          encryptedPhrase: string
      }

export type State =
    | { type: 'closed' }
    | { type: 'success_modal'; encryptedPhrase: string }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'success_modal':
            return (
                <UIModal>
                    <SuccessLayout
                        onAnimationComplete={() =>
                            onMsg({
                                type: 'on_encrypted_secret_phrase_submitted',
                                encryptedPhrase: state.encryptedPhrase,
                            })
                        }
                        title={
                            <FormattedMessage
                                id="AddFromNewSecretPhrase.success"
                                defaultMessage="Secret Phrase added 🎉"
                            />
                        }
                    />
                </UIModal>
            )

        default:
            return notReachable(state)
    }
}
