import { ActionBar } from '@zeal/uikit/ActionBar'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActionBarAccountIndicator } from '@zeal/domains/Account/components/ActionBarAccountIndicator'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap, Safe4337 } from '@zeal/domains/KeyStore'
import { getSafe4337Instance } from '@zeal/domains/KeyStore/helpers/getSafe4337Instance'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import {
    EthSignTypedData,
    EthSignTypedDataV3,
    EthSignTypedDataV4,
    PersonalSign,
} from '@zeal/domains/RPCRequest'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { DeploySafe } from './DeploySafe'

import { Signing, State as SigningVisualState } from '../Signing'

type Props = {
    sessionPassword: string
    keyStore: Safe4337
    request:
        | PersonalSign
        | EthSignTypedData
        | EthSignTypedDataV3
        | EthSignTypedDataV4

    state: SigningVisualState

    account: Account
    dApp: DAppSiteInfo
    network: Network
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap

    accountsMap: AccountsMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    keyStoreMap: KeyStoreMap
    portfolio: Portfolio | null
    actionSource: ActionSource

    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_pre_sign_safe_deployment_error_popup_cancel_clicked' }
    | MsgOf<typeof Signing>
    | Extract<
          MsgOf<typeof DeploySafe>,
          {
              type:
                  | 'drag'
                  | 'on_expand_request'
                  | 'on_4337_gas_currency_selected'
                  | 'on_minimize_click'
                  | 'on_safe_deployemnt_cancelled'
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'on_safe_transaction_failure_accepted'
                  | 'on_wrong_network_accepted'
          }
      >

type SafeOnChainState = 'deployed' | 'not_deployed' | 'no_local_signer_added'

const checkSafeDeployment = async ({
    keyStore,
    network,
    networkRPCMap,
}: {
    keyStore: Safe4337
    network: Network
    networkRPCMap: NetworkRPCMap
}): Promise<SafeOnChainState> => {
    const instance = await getSafe4337Instance({
        network,
        networkRPCMap,
        safeDeplymentConfig: keyStore.safeDeplymentConfig,
    })

    switch (instance.type) {
        case 'deployed':
            return instance.owners.includes(
                keyStore.localSignerKeyStore.address
            )
                ? 'deployed'
                : 'no_local_signer_added'

        case 'not_deployed':
            return 'not_deployed'

        default:
            return notReachable(instance)
    }
}

export const CheckSafe4337Deployment = ({
    account,
    dApp,
    keyStore,
    network,
    networkMap,
    onMsg,
    request,
    sessionPassword,
    state,
    networkRPCMap,
    accountsMap,
    gasCurrencyPresetMap,
    installationId,
    keyStoreMap,
    portfolio,
    actionSource,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(checkSafeDeployment, {
        type: 'loading',
        params: {
            keyStore,
            network,
            networkRPCMap,
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
                        <LoadingLayout
                            onClose={null}
                            actionBar={
                                <ActionBar
                                    left={
                                        <ActionBarAccountIndicator
                                            account={account}
                                        />
                                    }
                                />
                            }
                        />
                    )
                default:
                    return notReachable(state)
            }

        case 'error':
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
                        <>
                            <LoadingLayout
                                onClose={null}
                                actionBar={
                                    <ActionBar
                                        left={
                                            <ActionBarAccountIndicator
                                                account={account}
                                            />
                                        }
                                    />
                                }
                            />

                            <AppErrorPopup
                                error={parseAppError(loadable.error)}
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'close':
                                            onMsg({
                                                type: 'on_pre_sign_safe_deployment_error_popup_cancel_clicked',
                                            })
                                            break
                                        case 'try_again_clicked':
                                            setLoadable({
                                                type: 'loading',
                                                params: loadable.params,
                                            })
                                            break

                                        default:
                                            notReachable(msg)
                                    }
                                }}
                            />
                        </>
                    )

                default:
                    return notReachable(state)
            }

        case 'loaded': {
            switch (loadable.data) {
                case 'deployed':
                    return (
                        <Signing
                            installationId={installationId}
                            account={account}
                            dApp={dApp}
                            keyStore={keyStore}
                            network={network}
                            networkMap={networkMap}
                            request={request}
                            sessionPassword={sessionPassword}
                            state={state}
                            actionSource={actionSource}
                            onMsg={onMsg}
                        />
                    )
                case 'no_local_signer_added':
                case 'not_deployed':
                    return (
                        <DeploySafe
                            keyStore={keyStore}
                            account={account}
                            accountsMap={accountsMap}
                            dApp={dApp}
                            gasCurrencyPresetMap={gasCurrencyPresetMap}
                            installationId={installationId}
                            keyStoreMap={keyStoreMap}
                            network={network}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                            portfolio={portfolio}
                            sessionPassword={sessionPassword}
                            visualState={state}
                            actionSource={actionSource}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'drag':
                                    case 'on_expand_request':
                                    case 'on_4337_gas_currency_selected':
                                    case 'on_minimize_click':
                                    case 'on_safe_deployemnt_cancelled':
                                    case 'on_cancel_confirm_transaction_clicked':
                                    case 'on_safe_transaction_failure_accepted':
                                    case 'on_wrong_network_accepted':
                                        onMsg(msg)
                                        break

                                    case 'on_safe_deployed':
                                        setLoadable({
                                            type: 'loading',
                                            params: loadable.params,
                                        })
                                        break

                                    default:
                                        return notReachable(msg)
                                }
                            }}
                        />
                    )

                default:
                    return notReachable(loadable.data)
            }
        }

        default:
            return notReachable(loadable)
    }
}
