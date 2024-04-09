import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { App } from '@zeal/domains/App'
import { AppPositionDetails } from '@zeal/domains/App/components/AppPositionDetails'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap } from '@zeal/domains/Network'

type Props = {
    account: Account
    keystore: KeyStore
    networkMap: NetworkMap
    knownCurrencies: KnownCurrencies
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export type State =
    | { type: 'closed' }
    | { type: 'app_position_details'; app: App }

export const Modal = ({
    account,
    keystore,
    knownCurrencies,
    networkMap,
    state,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'app_position_details':
            return (
                <UIModal>
                    <AppPositionDetails
                        account={account}
                        keystore={keystore}
                        networkMap={networkMap}
                        knownCurrencies={knownCurrencies}
                        app={state.app}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        default:
            return notReachable(state)
    }
}
