import { ViewPortModal } from '@zeal/uikit/ViewPortModal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { CryptoCurrency } from '@zeal/domains/Currency'

import { CryptoCurrencySelector } from './CryptoCurrencySelector'
import { WalletSelector } from './WalletSelector'

import { Form } from '../../validation'

type Props = {
    state: State
    topUpCurrencies: CryptoCurrency[]
    form: Form
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof CryptoCurrencySelector>

export type State =
    | { type: 'closed' }
    | { type: 'wallet_selector' }
    | { type: 'crypto_currency_selector' }

export const Modal = ({ state, topUpCurrencies, onMsg, form }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'wallet_selector':
            return <WalletSelector form={form} onMsg={onMsg} />
        case 'crypto_currency_selector':
            return (
                <ViewPortModal>
                    <CryptoCurrencySelector
                        selectedCurrency={form.currency}
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
