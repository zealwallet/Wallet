import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { ShieldFail } from '@zeal/uikit/Icon/ShieldFail'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'wrong_answer' }

type Msg = { type: 'on_wrong_answer_confirm_clicked' }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'wrong_answer':
            return (
                <Popup.Layout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({
                                    type: 'on_wrong_answer_confirm_clicked',
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                >
                    <Header
                        icon={({ size }) => (
                            <ShieldFail size={size} color="statusCritical" />
                        )}
                        title={
                            <FormattedMessage
                                id="keystore.secret_phrase_test.wrong_answer.view_phrase_title"
                                defaultMessage="Don’t try to guess the word"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="keystore.secret_phrase_test.wrong_answer.view_phrase_subtitle"
                                defaultMessage="Keep a safe offline copy of your Secret Phrase so you can recover your assets later"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() => {
                                onMsg({
                                    type: 'on_wrong_answer_confirm_clicked',
                                })
                            }}
                        >
                            <FormattedMessage
                                id="keystore.secret_phrase_test.wrong_answer.view_phrase_cta"
                                defaultMessage="View phrase"
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
