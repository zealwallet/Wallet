import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { KeyStore } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { Network } from '@zeal/domains/Network'
import {
    EthSignTypedData,
    EthSignTypedDataV3,
    EthSignTypedDataV4,
    PersonalSign,
} from '@zeal/domains/RPCRequest'

import { Layout } from './Layout'

type Props = {
    keyStore: KeyStore
    installationId: string
    request:
        | PersonalSign
        | EthSignTypedDataV4
        | EthSignTypedData
        | EthSignTypedDataV3

    isLoading: boolean

    account: Account
    dApp: DAppSiteInfo
    network: Network
    actionSource: ActionSource

    state: State

    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Layout> | MsgOf<typeof ConnectedMinimized>

export type State = { type: 'minimised' } | { type: 'maximised' }

// TODO @resetko-zeal we can remove this and have simulation always pass to unknown
export const NoSimulation = ({
    account,
    request,
    keyStore,
    dApp,
    state,
    network,
    isLoading,
    actionSource,
    installationId,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'minimised':
            return (
                <ConnectedMinimized
                    installationId={installationId}
                    onMsg={onMsg}
                />
            )
        case 'maximised':
            return (
                <Layout
                    isLoading={isLoading}
                    keyStore={keyStore}
                    request={request}
                    dApp={dApp}
                    account={account}
                    network={network}
                    actionSource={actionSource}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
