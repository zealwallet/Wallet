import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldDelete } from '@zeal/uikit/Icon/BoldDelete'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { Popup } from '@zeal/uikit/Popup'
import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'

import { Token } from '@zeal/domains/Token'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_hide_token_confirm'; token: Token }
    | {
          type: 'on_hide_token_success_animation_finish'
          token: Token
      }

export type State =
    | { type: 'closed' }
    | { type: 'confirm_hide_token'; token: Token }
    | { type: 'hide_success_screen'; token: Token }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'confirm_hide_token':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        icon={({ size, color }) => (
                            <BoldDelete size={size} color={color} />
                        )}
                        title={
                            <FormattedMessage
                                id="currency.hide_currency.confirm.title"
                                defaultMessage="Hide token"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="currency.hide_currency.confirm.subtitle"
                                defaultMessage="Hide this token from your portfolio. You can always unhide it anytime."
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            variant="secondary"
                            size="regular"
                            onClick={() => onMsg({ type: 'close' })}
                        >
                            <FormattedMessage
                                id="actions.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>
                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() => {
                                onMsg({
                                    type: 'on_hide_token_confirm',
                                    token: state.token,
                                })
                            }}
                        >
                            <FormattedMessage
                                id="action.hide"
                                defaultMessage="Hide"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )
        case 'hide_success_screen':
            return (
                <UIModal>
                    <SuccessLayout
                        title={
                            <FormattedMessage
                                id="currency.hide_currency.success.title"
                                defaultMessage="Token hidden"
                            />
                        }
                        onAnimationComplete={() => {
                            onMsg({
                                type: 'on_hide_token_success_animation_finish',
                                token: state.token,
                            })
                        }}
                    />
                </UIModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
