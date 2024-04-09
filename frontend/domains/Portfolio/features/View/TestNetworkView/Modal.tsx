import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AddCustom } from '@zeal/domains/Currency/features/AddCustom'
import {
    CustomNetwork,
    NetworkRPCMap,
    TestNetwork,
} from '@zeal/domains/Network'

type Props = {
    state: State
    network: TestNetwork | CustomNetwork
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof AddCustom>

export type State = { type: 'closed' } | { type: 'add_custom_currency' }

export const Modal = ({ state, network, networkRPCMap, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'add_custom_currency':
            return (
                <UIModal>
                    <AddCustom
                        cryptoCurrency={null}
                        network={network}
                        networkRPCMap={networkRPCMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
