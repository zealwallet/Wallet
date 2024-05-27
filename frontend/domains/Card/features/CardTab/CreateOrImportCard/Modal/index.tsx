import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap, GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { OrderCardFlow } from './OrderCardFlow'

type Props = {
    state: State
    installationId: string
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    keyStoreMap: KeyStoreMap
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | MsgOf<typeof OrderCardFlow>

export type State =
    | { type: 'closed' }
    | { type: 'order_card_flow'; userSelected: 'create' | 'import' }

export const Modal = ({
    onMsg,
    state,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    currencyHiddenMap,
    keyStoreMap,
    networkMap,
    networkRPCMap,
    portfolioMap,
    keystoreMap,
    sessionPassword,
    installationId,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'order_card_flow':
            return (
                <UIModal>
                    <OrderCardFlow
                        userSelected={state.userSelected}
                        installationId={installationId}
                        accountsMap={accountsMap}
                        keystoreMap={keystoreMap}
                        portfolioMap={portfolioMap}
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        feePresetMap={feePresetMap}
                        gasCurrencyPresetMap={gasCurrencyPresetMap}
                        keyStoreMap={keyStoreMap}
                        sessionPassword={sessionPassword}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
