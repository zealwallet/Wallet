import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { NetworkFilter } from '@zeal/domains/Network/features/Fillter'
import { Portfolio } from '@zeal/domains/Portfolio'

type Props = {
    state: State
    installationId: string

    account: Account
    keyStoreMap: KeyStoreMap
    portfolio: Portfolio

    networks: CurrentNetwork[]
    currentNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    networkMap: NetworkMap

    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'select_network' }

type Msg = MsgOf<typeof NetworkFilter>

export const Modal = ({
    state,
    networks,
    account,
    currentNetwork,
    networkRPCMap,
    keyStoreMap,
    portfolio,
    currencyHiddenMap,
    networkMap,
    installationId,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'select_network': {
            return (
                <UIModal>
                    <NetworkFilter
                        installationId={installationId}
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        account={account}
                        currentNetwork={currentNetwork}
                        networkRPCMap={networkRPCMap}
                        keyStoreMap={keyStoreMap}
                        networks={networks}
                        portfolio={portfolio}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        }

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
