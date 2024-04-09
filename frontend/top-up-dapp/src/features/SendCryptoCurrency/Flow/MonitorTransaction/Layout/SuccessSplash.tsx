import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Content } from '@zeal/uikit/Content'

import { notReachable } from '@zeal/toolkit'

import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'

import { TransactionContent } from './TransactionContent'

import { TopUpRequest } from '../../TopUpRequest'

type Props = {
    topUpRequest: TopUpRequest
    knownCurrencies: KnownCurrencies | null
    currency: CryptoCurrency
}

type State = { type: 'success_animation' } | { type: 'final_confirmation' }

export const SuccessSplash = ({
    currency,
    topUpRequest,
    knownCurrencies,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'success_animation' })

    switch (state.type) {
        case 'success_animation':
            return (
                <Content.Splash
                    onAnimationComplete={() =>
                        setState({ type: 'final_confirmation' })
                    }
                    variant="success"
                    title={
                        <FormattedMessage
                            id="TopupDapp.MonitorTransaction.success.splash"
                            defaultMessage="Complete"
                        />
                    }
                />
            )

        case 'final_confirmation':
            return (
                <TransactionContent
                    knownCurrencies={knownCurrencies}
                    currency={currency}
                    topUpRequest={topUpRequest}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
