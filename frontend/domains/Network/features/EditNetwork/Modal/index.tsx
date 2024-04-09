import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Network } from '@zeal/domains/Network'

import { EditNetworkRPC } from './EditNetworkRPC'

export type Props = {
    network: Network
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<MsgOf<typeof EditNetworkRPC>, { type: 'on_rpc_change_confirmed' }>

export type State =
    | { type: 'closed' }
    | { type: 'predefined_network_info' }
    | { type: 'add_network_rpc' }
    | { type: 'edit_network_rpc'; rpcUrl: string }

export const Modal = ({ network, state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'predefined_network_info':
            return (
                <Popup.Layout
                    onMsg={onMsg}
                    aria-labelledby="predefined_network_info-label"
                    aria-describedby="predefined_network_info-description"
                >
                    <Header
                        titleId="predefined_network_info-label"
                        subtitleId="predefined_network_info-description"
                        title={
                            <FormattedMessage
                                id="network.editRpc.predefined_network_info.title"
                                defaultMessage="Zeal privacy RPC"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="network.editRpc.predefined_network_info.subtitle"
                                defaultMessage="Like a VPN, Zeal uses RPCs that prevents your personal data from being tracked.{br}{br}Zeal’s Default RPCs are reliable battle tested RPC providers."
                                values={{ br: '\n' }}
                            />
                        }
                    />
                </Popup.Layout>
            )

        case 'add_network_rpc':
            return (
                <UIModal>
                    <EditNetworkRPC
                        network={network}
                        initialRPCUrl={null}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'edit_network_rpc':
            return (
                <UIModal>
                    <EditNetworkRPC
                        network={network}
                        initialRPCUrl={state.rpcUrl}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        default:
            return notReachable(state)
    }
}
