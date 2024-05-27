import { FormattedMessage } from 'react-intl'

import { Modal as UIModal } from '@zeal/uikit/Modal'
import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'success_modal' }

type Msg = { type: 'on_accounts_create_success_animation_finished' }

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
                                type: 'on_accounts_create_success_animation_finished',
                            })
                        }
                        title={
                            <FormattedMessage
                                id="AddFromPrivateKey.success"
                                defaultMessage="Private key added 🎉"
                            />
                        }
                    />
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
