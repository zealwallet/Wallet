import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { generateRandomNumber } from '@zeal/toolkit/Number'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { KeyStoreMap, Safe4337 } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { SendSafe4337Transaction } from '@zeal/domains/RPCRequest/features/SendSafe4337Transaction'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'

type Props = {
    sessionPassword: string

    visualState: VisualState

    account: Account
    keyStore: Safe4337
    dApp: DAppSiteInfo
    network: Network
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap

    accountsMap: AccountsMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    keyStoreMap: KeyStoreMap
    portfolio: Portfolio | null
    actionSource: ActionSource

    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_safe_deployemnt_cancelled' }
    | { type: 'on_safe_deployed' }
    | Extract<
          MsgOf<typeof SendSafe4337Transaction>,
          {
              type:
                  | 'on_minimize_click'
                  | 'drag'
                  | 'on_expand_request'
                  | 'on_4337_gas_currency_selected'
          }
      >

type State =
    | { type: 'deployment_prompt' }
    | { type: 'deploy_safe'; transactionRequest: EthSendTransaction }

type VisualState = { type: 'minimised' } | { type: 'maximised' }

export const DeploySafe = ({
    onMsg,
    account,
    accountsMap,
    dApp,
    gasCurrencyPresetMap,
    installationId,
    keyStoreMap,
    network,
    networkMap,
    networkRPCMap,
    portfolio,
    sessionPassword,
    visualState,
    actionSource,
    keyStore,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'deployment_prompt' })

    switch (state.type) {
        case 'deployment_prompt':
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
                        <Screen background="light" padding="form">
                            <ActionBar
                                title={null}
                                account={account}
                                actionSource={actionSource}
                                network={null}
                                onMsg={onMsg}
                            />

                            <Column spacing={12} fill>
                                <Header
                                    title={
                                        <FormattedMessage
                                            id="Sign.CheckSafeDeployment.title"
                                            defaultMessage="Smart Wallet is not active on this network yet"
                                        />
                                    }
                                    subtitle={
                                        <FormattedMessage
                                            id="Sign.CheckSafeDeployment.subtitle"
                                            defaultMessage="You’re trying to sign in to an app or sign an off-chain message.{br}{br}You need to activate your wallet on this network before you can do this."
                                            values={{ br: '\n' }}
                                        />
                                    }
                                    icon={({ size }) => (
                                        <BoldDangerTriangle
                                            size={size}
                                            color="iconStatusWarning"
                                        />
                                    )}
                                />

                                <Spacer />

                                <Actions>
                                    <Button
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_safe_deployemnt_cancelled',
                                            })
                                        }
                                        size="regular"
                                        variant="secondary"
                                    >
                                        <FormattedMessage
                                            id="actions.cancel"
                                            defaultMessage="Cancel"
                                        />
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            setState({
                                                type: 'deploy_safe',
                                                transactionRequest: {
                                                    id: generateRandomNumber(),
                                                    jsonrpc: '2.0',
                                                    method: 'eth_sendTransaction',
                                                    params: [
                                                        {
                                                            from: account.address,
                                                            to: account.address,
                                                            value: '0x0',
                                                            data: '',
                                                        },
                                                    ],
                                                },
                                            })
                                        }
                                        size="regular"
                                        variant="primary"
                                    >
                                        <FormattedMessage
                                            id="Sign.CheckSafeDeployment.activate"
                                            defaultMessage="Activate"
                                        />
                                    </Button>
                                </Actions>
                            </Column>
                        </Screen>
                    )
                default:
                    return notReachable(visualState)
            }

        case 'deploy_safe':
            return (
                <SendSafe4337Transaction
                    accountsMap={accountsMap}
                    dAppInfo={dApp}
                    keyStore={keyStore}
                    keyStoreMap={keyStoreMap}
                    rpcRequestToBundle={state.transactionRequest}
                    account={account}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    installationId={installationId}
                    portfolio={portfolio}
                    network={network}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    sessionPassword={sessionPassword}
                    source="zwidget"
                    state={visualState}
                    actionSource={actionSource}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_minimize_click':
                            case 'drag':
                            case 'on_expand_request':
                            case 'on_4337_gas_currency_selected':
                                onMsg(msg)
                                break

                            case 'on_completed_safe_transaction_close_click':
                            case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                                onMsg({ type: 'on_safe_deployed' })
                                break

                            case 'on_safe_transaction_failure_accepted':
                            case 'on_wrong_network_accepted':
                            case 'on_cancel_confirm_transaction_clicked':
                                onMsg({ type: 'on_safe_deployemnt_cancelled' })
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        default:
            return notReachable(state)
    }
}
