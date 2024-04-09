import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { AddCustom } from '@zeal/domains/Currency/features/AddCustom'
import {
    CustomNetwork,
    NetworkMap,
    NetworkRPCMap,
    TestNetwork,
} from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { HiddenTokens } from '@zeal/domains/Token/components/HiddenTokens'

type Props = {
    state: State
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    portfolio: Portfolio
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'add_custom_currency'; network: TestNetwork | CustomNetwork }
    | { type: 'hidden_tokens' }

type Msg = MsgOf<typeof AddCustom> | MsgOf<typeof HiddenTokens>

export const Modal = ({
    state,
    currencyHiddenMap,
    currencyPinMap,
    portfolio,
    networkMap,
    networkRPCMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'hidden_tokens':
            return (
                <UIModal>
                    <HiddenTokens
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        currencyPinMap={currencyPinMap}
                        portfolio={portfolio}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'add_custom_currency':
            return (
                <UIModal>
                    <AddCustom
                        cryptoCurrency={null}
                        onMsg={onMsg}
                        network={state.network}
                        networkRPCMap={networkRPCMap}
                    />
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
