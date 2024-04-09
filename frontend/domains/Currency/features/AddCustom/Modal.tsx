import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldDelete } from '@zeal/uikit/Icon/BoldDelete'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { Popup } from '@zeal/uikit/Popup'
import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'

import { CryptoCurrency } from '@zeal/domains/Currency'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'custom_currency_delete_confirmation_click'
          currency: CryptoCurrency
      }
    | {
          type: 'on_custom_currency_update_request'
          currency: CryptoCurrency
      }
    | { type: 'on_custom_currency_delete_request'; currency: CryptoCurrency }

export type State =
    | { type: 'closed' }
    | { type: 'confirm_currency_delete'; currency: CryptoCurrency }
    | { type: 'delete_success'; currency: CryptoCurrency }
    | { type: 'update_success'; currency: CryptoCurrency }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'delete_success':
            return (
                <UIModal>
                    <SuccessLayout
                        title={
                            <FormattedMessage
                                id="currency.add_custom.token_removed"
                                defaultMessage="Token removed"
                            />
                        }
                        onAnimationComplete={() => {
                            onMsg({
                                type: 'on_custom_currency_delete_request',
                                currency: state.currency,
                            })
                        }}
                    />
                </UIModal>
            )
        case 'update_success':
            return (
                <UIModal>
                    <SuccessLayout
                        title={
                            <FormattedMessage
                                id="currency.add_custom.token_updated"
                                defaultMessage="Token updated"
                            />
                        }
                        onAnimationComplete={() => {
                            onMsg({
                                type: 'on_custom_currency_update_request',
                                currency: state.currency,
                            })
                        }}
                    />
                </UIModal>
            )
        case 'confirm_currency_delete':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        icon={({ size, color }) => (
                            <BoldDelete size={size} color={color} />
                        )}
                        title={
                            <FormattedMessage
                                id="currency.add_custom.remove_token.header"
                                defaultMessage="Remove token"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="currency.add_custom.remove_token.subtitle"
                                defaultMessage="Your wallet will still hold any balance of this token but it will be hidden from your Zeal portfolio balances."
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            variant="secondary"
                            size="regular"
                            onClick={() =>
                                onMsg({
                                    type: 'close',
                                })
                            }
                        >
                            <FormattedMessage
                                id="action.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>

                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() =>
                                onMsg({
                                    type: 'custom_currency_delete_confirmation_click',
                                    currency: state.currency,
                                })
                            }
                        >
                            <FormattedMessage
                                id="currency.add_custom.remove_token.cta"
                                defaultMessage="Remove token"
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
