import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { BoldDiscount } from '@zeal/uikit/Icon/BoldDiscount'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { SetSlippagePopup } from '@zeal/domains/Currency/components/SetSlippagePopup'

type Props = {
    state: State
    slippagePercent: number
    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'best_return' }
    | { type: 'set_slippage' }

type Msg = MsgOf<typeof SetSlippagePopup>

export const Modal = ({ state, slippagePercent, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'set_slippage':
            return (
                <SetSlippagePopup
                    slippagePercent={slippagePercent}
                    onMsg={onMsg}
                />
            )

        case 'best_return':
            return (
                <Popup.Layout
                    onMsg={onMsg}
                    aria-labelledby="best-return-title"
                    aria-describedby="bet-return-descr"
                >
                    <Header
                        titleId="best-return-title"
                        icon={({ size }) => (
                            <BoldDiscount
                                size={size}
                                color="iconStatusSuccess"
                            />
                        )}
                        title={
                            <FormattedMessage
                                id="BestReturnsPopup.title"
                                defaultMessage="Best returns"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="BestReturns.subtitle"
                                defaultMessage="This swap provider will give you the highest output, including all fees."
                            />
                        }
                    />
                </Popup.Layout>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
