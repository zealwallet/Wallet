import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { WalletAddEthereumChain } from '@zeal/domains/RPCRequest'

import { Flow } from './Flow'

type Props = {
    request: WalletAddEthereumChain
    account: Account
    dApp: DAppSiteInfo
    network: Network
    keyStore: KeyStore
    visualState: VisualState
    installationId: string

    onMsg: (msg: Msg) => void
}

type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg = MsgOf<typeof ConnectedMinimized> | MsgOf<typeof Flow>

export const AddCustomNetwork = ({
    onMsg,
    account,
    dApp,
    network,
    request,
    visualState,
    installationId,
    keyStore,
}: Props) => {
    switch (visualState.type) {
        case 'minimised':
            return (
                <ConnectedMinimized
                    installationId={installationId}
                    onMsg={onMsg}
                />
            )
        case 'maximised':
            return (
                <Flow
                    keyStore={keyStore}
                    request={request}
                    account={account}
                    dApp={dApp}
                    network={network}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(visualState)
    }
}
