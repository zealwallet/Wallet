import { ViewPortModal } from '@zeal/uikit/ViewPortModal'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { CryptoCurrency } from '@zeal/domains/Currency'
import { Portfolio } from '@zeal/domains/Portfolio'

import { CryptoCurrencySelector } from './CryptoCurrencySelector'

import { Form } from '../../validation'

type Props = {
    state: State
    form: Form
    portfolioLoadable: LoadableData<Portfolio, unknown>
    topUpCurrencies: CryptoCurrency[]
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof CryptoCurrencySelector>

export type State = { type: 'closed' } | { type: 'crypto_currency_selector' }

export const Modal = ({
    form,
    state,
    topUpCurrencies,
    onMsg,
    portfolioLoadable,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'crypto_currency_selector':
            return (
                <ViewPortModal>
                    <CryptoCurrencySelector
                        selectedCurrency={form.currency}
                        portfolioLoadable={portfolioLoadable}
                        topUpCurrencies={topUpCurrencies}
                        onMsg={onMsg}
                    />
                </ViewPortModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
