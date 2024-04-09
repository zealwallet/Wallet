import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { BoldDiscount } from '@zeal/uikit/Icon/BoldDiscount'
import { SolidLightning } from '@zeal/uikit/Icon/SolidLightning'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

import { SetSlippagePopup } from '@zeal/domains/Currency/components/SetSlippagePopup'

type Props = {
    state: State
    slippagePercent: number
    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'best_return' }
    | { type: 'best_service_time' }
    | { type: 'set_slippage' }

type Msg =
    | { type: 'close' }
    | { type: 'on_set_slippage_percent'; slippagePercent: number }

export const Modal = ({ state, slippagePercent, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'best_service_time':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        icon={({ size }) => (
                            <SolidLightning
                                size={size}
                                color="iconStatusNeutral"
                            />
                        )}
                        title={
                            <FormattedMessage
                                id="currency.bridge.fastest_route_popup.title"
                                defaultMessage="Fastest route"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="currency.bridge.fastest_route_popup.subtitle"
                                defaultMessage="This bridge provider will give you the fastest transaction route."
                            />
                        }
                    />
                </Popup.Layout>
            )

        case 'set_slippage':
            return (
                <SetSlippagePopup
                    slippagePercent={slippagePercent}
                    onMsg={onMsg}
                />
            )

        case 'best_return':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        icon={({ size }) => (
                            <BoldDiscount
                                size={size}
                                color="iconStatusSuccess"
                            />
                        )}
                        title={
                            <FormattedMessage
                                id="currency.bridge.best_returns_popup.title"
                                defaultMessage="Best returns"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="currency.bridge.best_returns.subtitle"
                                defaultMessage="This bridge provider will give you the highest output, including all fees."
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
