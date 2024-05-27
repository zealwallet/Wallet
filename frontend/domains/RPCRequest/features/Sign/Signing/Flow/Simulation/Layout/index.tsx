import { Column } from '@zeal/uikit/Column'
import { Content as LayoutContent } from '@zeal/uikit/Content'
import { Screen } from '@zeal/uikit/Screen'

import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStore } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap } from '@zeal/domains/Network'
import { SignMessageRequest } from '@zeal/domains/RPCRequest'
import { SignMessageSimulationResponse } from '@zeal/domains/RPCRequest/domains/SignMessageSimulation'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'

import { ActionButtons } from './ActionButtons'
import { Content } from './Content'
import { Footer } from './Footer'
import { Header } from './Header'

type Props = {
    simulationResponse: SignMessageSimulationResponse
    account: Account
    keyStore: KeyStore
    isLoading: boolean
    dApp: DAppSiteInfo
    request: SignMessageRequest
    networkMap: NetworkMap
    nowTimestampMs: number
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

type Msg =
    | MsgOf<typeof Header>
    | MsgOf<typeof Content>
    | MsgOf<typeof Footer>
    | MsgOf<typeof ActionButtons>
    | { type: 'on_minimize_click' }

export const Layout = ({
    dApp,
    onMsg,
    keyStore,
    isLoading,
    request,
    networkMap,
    account,
    simulationResponse,
    nowTimestampMs,
    actionSource,
}: Props) => {
    return (
        <Screen
            background="light"
            padding="form"
            onNavigateBack={() => onMsg({ type: 'on_minimize_click' })}
        >
            <Column spacing={8} fill>
                <ActionBar
                    title={null}
                    account={account}
                    actionSource={actionSource}
                    network={null}
                    onMsg={onMsg}
                />

                <Column spacing={12} shrink alignY="stretch">
                    <LayoutContent
                        header={
                            <Header
                                dApp={dApp}
                                onMsg={onMsg}
                                simulatedSignMessage={
                                    simulationResponse.message
                                }
                            />
                        }
                        footer={
                            <Footer
                                networkMap={networkMap}
                                knownCurrencies={simulationResponse.currencies}
                                safetyChecks={simulationResponse.checks}
                                simulatedSignMessage={
                                    simulationResponse.message
                                }
                                onMsg={onMsg}
                            />
                        }
                    >
                        <Content
                            nowTimestampMs={nowTimestampMs}
                            request={request}
                            safetyChecks={simulationResponse.checks}
                            simulatedSignMessage={simulationResponse.message}
                            onMsg={onMsg}
                        />
                    </LayoutContent>

                    <ActionButtons
                        request={request}
                        isLoading={isLoading}
                        keyStore={keyStore}
                        safetyChecks={simulationResponse.checks}
                        onMsg={onMsg}
                    />
                </Column>
            </Column>
        </Screen>
    )
}
