import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { KeyStore } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap } from '@zeal/domains/Network'
import {
    EthSignTypedData,
    EthSignTypedDataV3,
    EthSignTypedDataV4,
    PersonalSign,
} from '@zeal/domains/RPCRequest'
import { fetchSimulatedSignMessage } from '@zeal/domains/RPCRequest/domains/SignMessageSimulation/api/fetchSimulatedSignMessage'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'

import { NoSimulation, State as FormVisualState } from './NoSimulation'
import { Simulation } from './Simulation'

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
    networkMap: NetworkMap

    state: VisualState
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

export type VisualState = FormVisualState

type Msg =
    | MsgOf<typeof NoSimulation>
    | Extract<
          MsgOf<typeof Simulation>,
          {
              type:
                  | 'cancel_button_click'
                  | 'sign_click'
                  | 'import_keys_button_clicked'
          }
      >

export const Flow = ({
    account,
    dApp,
    keyStore,
    network,
    networkMap,
    onMsg,
    request,
    state,
    isLoading,
    actionSource,
    installationId,
}: Props) => {
    const [loadable] = useLoadableData(fetchSimulatedSignMessage, {
        type: 'loading',
        params: {
            request,
            network,
            dApp,
        },
    })

    switch (loadable.type) {
        case 'loading':
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
                        <Screen
                            background="light"
                            padding="form"
                            onNavigateBack={() =>
                                onMsg({ type: 'on_minimize_click' })
                            }
                        >
                            <Column spacing={12} fill>
                                <ActionBar
                                    title={null}
                                    account={account}
                                    actionSource={actionSource}
                                    network={null}
                                    onMsg={onMsg}
                                />

                                <Content>
                                    <Content.Splash
                                        onAnimationComplete={null}
                                        variant="spinner"
                                        title={
                                            <FormattedMessage
                                                id="Sign.Simuation.Skeleton.title"
                                                defaultMessage="Doing safety checks…"
                                            />
                                        }
                                    />
                                </Content>
                            </Column>
                        </Screen>
                    )

                default:
                    return notReachable(state)
            }

        case 'loaded': {
            switch (loadable.data.type) {
                case 'not_supported':
                case 'failed':
                    return (
                        <NoSimulation
                            installationId={installationId}
                            account={account}
                            dApp={dApp}
                            isLoading={isLoading}
                            keyStore={keyStore}
                            network={network}
                            onMsg={onMsg}
                            request={loadable.params.request}
                            state={state}
                            actionSource={actionSource}
                        />
                    )

                case 'simulated':
                    return (
                        <Simulation
                            installationId={installationId}
                            account={account}
                            request={loadable.params.request}
                            isLoading={isLoading}
                            keyStore={keyStore}
                            dApp={dApp}
                            simulationResponse={
                                loadable.data.simulationResponse
                            }
                            state={state}
                            networkMap={networkMap}
                            actionSource={actionSource}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'cancel_button_click':
                                    case 'sign_click':
                                    case 'import_keys_button_clicked':
                                    case 'on_minimize_click':
                                    case 'on_expand_request':
                                    case 'drag':
                                        onMsg(msg)
                                        break
                                    default:
                                        notReachable(msg)
                                }
                            }}
                        />
                    )

                default:
                    return notReachable(loadable.data)
            }
        }

        case 'error':
            return (
                <NoSimulation
                    installationId={installationId}
                    account={account}
                    dApp={dApp}
                    isLoading={isLoading}
                    keyStore={keyStore}
                    network={network}
                    onMsg={onMsg}
                    request={loadable.params.request}
                    state={state}
                    actionSource={actionSource}
                />
            )

        default:
            return notReachable(loadable)
    }
}
