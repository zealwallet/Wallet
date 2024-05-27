import { FormattedMessage } from 'react-intl'

import Web3 from 'web3'

import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { Hexadecimal } from '@zeal/toolkit/Hexadecimal'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { ImperativeError } from '@zeal/domains/Error'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap, Safe4337 as SafeKeystore } from '@zeal/domains/KeyStore'
import { getSafe4337Instance } from '@zeal/domains/KeyStore/helpers/getSafe4337Instance'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { ZealWeb3RPCProvider } from '@zeal/domains/RPCRequest/helpers/ZealWeb3RPCProvider'
import {
    SimulatedUserOperationRequest,
    SimulatedWithAddOwnerUserOperationRequest,
    SimulatedWithDeploymentBundleUserOperationRequest,
    SimulatedWithoutDeploymentBundleUserOperationRequest,
} from '@zeal/domains/TransactionRequest'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'
import { fetchAccountAbstractionTransactionSimulation } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchAccountAbstractionTransactionSimulation'
import {
    GasAbstractionTransactionFee,
    InitialUserOperation,
    MetaTransactionData,
    OperationType,
} from '@zeal/domains/UserOperation'
import { fetchCurrentEntrypointNonce } from '@zeal/domains/UserOperation/api/fetchCurrentEntrypointNonce'
import { fetchGasAbstractionTransactionFees } from '@zeal/domains/UserOperation/api/fetchGasAbstractionTransactionFees'
import {
    DUMMY_EOA_SIGNATURE,
    DUMMY_PASSKEY_SIGNATURE,
    EOA_SIGNATURE_VERIFICATION_GAS_LIMIT_BUFFER,
    PASSKEY_SIGNATURE_VERIFICATION_GAS_LIMIT_BUFFER,
} from '@zeal/domains/UserOperation/constants'
import { ethSendTransactionToMetaTransactionData } from '@zeal/domains/UserOperation/helpers/ethSendTransactionToMetaTransactionData'
import { metaTransactionDatasToUserOperationCallData } from '@zeal/domains/UserOperation/helpers/metaTransactionDatasToUserOperationCallData'

import { Flow } from './Flow'

type Props = {
    installationId: string
    keyStore: SafeKeystore
    account: Account
    network: Network
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    dAppInfo: DAppSiteInfo | null
    rpcRequestToBundle: EthSendTransaction
    portfolio: Portfolio | null
    sessionPassword: string
    state: VisualState
    gasCurrencyPresetMap: GasCurrencyPresetMap
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof Flow>,
          {
              type:
                  | 'on_minimize_click'
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'on_submit_click'
                  | 'on_expand_request'
                  | 'drag'
                  | 'on_4337_gas_currency_selected'
                  | 'on_user_confirmed_transaction_for_signing'
          }
      >
    | MsgOf<typeof ConnectedMinimized>
    | { type: 'on_cancel_confirm_transaction_clicked' }

type VisualState = { type: 'minimised' } | { type: 'maximised' }

const SAFE_ADD_OWNER_WITH_THRESHOLD_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_threshold',
                type: 'uint256',
            },
        ],
        name: 'addOwnerWithThreshold',
        outputs: [],
        stateMutability: 'nonpayable' as const,
        type: 'function' as const,
    },
] as const

const simulateSafeTransaction = async ({
    network,
    keyStore,
    networkRPCMap,
    rpcRequestToBundle,
    account,
    portfolio,
    dApp,
    sessionPassword,
    signal,
}: {
    rpcRequestToBundle: EthSendTransaction
    network: Network
    keyStore: SafeKeystore
    account: Account
    networkRPCMap: NetworkRPCMap
    dApp: DAppSiteInfo | null
    portfolio: Portfolio | null
    sessionPassword: string
    signal?: AbortSignal
}): Promise<{
    userOperationRequest: SimulatedUserOperationRequest
    feeForecast: GasAbstractionTransactionFee[] // FXIME @resetko-zeal rename
}> => {
    const { safeDeplymentConfig } = keyStore

    const safeInstance = await getSafe4337Instance({
        safeDeplymentConfig,
        network,
        networkRPCMap,
    })

    const safeAddress = safeInstance.safeAddress
    const localSignerAddress = keyStore.localSignerKeyStore.address

    if (safeAddress !== keyStore.address) {
        throw new ImperativeError(`Safe address mismatch vs keystore`, {
            safeAddress: safeAddress,
            keyStoreAddress: keyStore.address,
        })
    }

    const requestData = rpcRequestToBundle.params[0]

    if (!requestData.to) {
        throw new ImperativeError(
            'Cannot bundle transaction without `to` address'
        )
    }

    const requestMetaTransaction =
        ethSendTransactionToMetaTransactionData(rpcRequestToBundle)

    switch (safeInstance.type) {
        case 'deployed': {
            const entrypoint = safeInstance.entrypoint

            const initialUserOperation: InitialUserOperation = {
                type: 'initial_user_operation',
                sender: safeAddress,
                callData: metaTransactionDatasToUserOperationCallData({
                    metaTransactionDatas: [requestMetaTransaction],
                }),
                initCode: null,
                nonce: await fetchCurrentEntrypointNonce({
                    network,
                    address: safeAddress,
                    entrypoint,
                    networkRPCMap,
                    signal,
                }),
                entrypoint,
            }

            if (safeInstance.owners.includes(localSignerAddress)) {
                const entrypoint = safeInstance.entrypoint
                const [simulation, feeForecast] = await Promise.all([
                    fetchAccountAbstractionTransactionSimulation({
                        initialUserOperation,
                        dApp,
                        network,
                        signal,
                    }),
                    fetchGasAbstractionTransactionFees({
                        network,
                        initCode: null,
                        metaTransactionDatas: [requestMetaTransaction],
                        sender: safeAddress,
                        verificationGasLimitBuffer:
                            EOA_SIGNATURE_VERIFICATION_GAS_LIMIT_BUFFER,
                        entrypoint,
                        networkRPCMap,
                        portfolio,
                        dummySignature: DUMMY_EOA_SIGNATURE,
                        signal,
                    }),
                ])
                const userOperationRequest: SimulatedWithoutDeploymentBundleUserOperationRequest =
                    {
                        type: 'simulated_safe_without_deployment_bundle_user_operation_request',
                        account,
                        dApp,
                        network,
                        rpcRequest: rpcRequestToBundle,
                        simulationResult: simulation,
                        metaTransactionData: requestMetaTransaction,
                        initCode: null,
                        entrypoint,
                    }

                return {
                    feeForecast,
                    userOperationRequest,
                }
            } else {
                const web3 = new Web3(
                    new ZealWeb3RPCProvider({ network, networkRPCMap })
                )
                const safeInterface = new web3.eth.Contract(
                    SAFE_ADD_OWNER_WITH_THRESHOLD_ABI,
                    safeAddress
                )

                const addOwnerTrxData = safeInterface.methods
                    .addOwnerWithThreshold(localSignerAddress, 1)
                    .encodeABI()

                const addOwnerMetaTransactionData: MetaTransactionData = {
                    to: safeAddress as Hexadecimal,
                    data: addOwnerTrxData as Hexadecimal,
                    value: '0',
                    operation: OperationType.Call,
                }

                const entrypoint = safeInstance.entrypoint

                const [simulation, feeForecast] = await Promise.all([
                    fetchAccountAbstractionTransactionSimulation({
                        initialUserOperation,
                        dApp,
                        network,
                        signal,
                    }),
                    fetchGasAbstractionTransactionFees({
                        network,
                        initCode: null,
                        metaTransactionDatas: [
                            requestMetaTransaction,
                            addOwnerMetaTransactionData,
                        ],
                        sender: safeAddress,
                        verificationGasLimitBuffer:
                            PASSKEY_SIGNATURE_VERIFICATION_GAS_LIMIT_BUFFER,
                        entrypoint,
                        networkRPCMap,
                        portfolio,
                        dummySignature: DUMMY_PASSKEY_SIGNATURE,
                        signal,
                    }),
                ])

                const userOperationRequest: SimulatedWithAddOwnerUserOperationRequest =
                    {
                        type: 'simulated_safe_with_add_owner_user_operation_request',
                        account,
                        dApp,
                        network,
                        rpcRequest: rpcRequestToBundle,
                        simulationResult: simulation,
                        metaTransactionData: requestMetaTransaction,
                        addOwnerMetaTransactionData,
                        initCode: null,
                        entrypoint,
                    }

                return {
                    feeForecast,
                    userOperationRequest,
                }
            }
        }

        case 'not_deployed': {
            const entrypoint = safeInstance.entrypoint

            const simulationUserOperation: InitialUserOperation = {
                type: 'initial_user_operation',
                sender: safeAddress,
                callData: metaTransactionDatasToUserOperationCallData({
                    metaTransactionDatas: [requestMetaTransaction],
                }),
                initCode: safeInstance.deploymentInitCode,
                nonce: await fetchCurrentEntrypointNonce({
                    network,
                    address: safeAddress,
                    entrypoint,
                    networkRPCMap,
                    signal,
                }),
                entrypoint,
            }

            const web3 = new Web3(
                new ZealWeb3RPCProvider({ network, networkRPCMap })
            )
            const safeInterface = new web3.eth.Contract(
                SAFE_ADD_OWNER_WITH_THRESHOLD_ABI,
                safeAddress
            )

            const addOwnerTrxData = safeInterface.methods
                .addOwnerWithThreshold(localSignerAddress, 1)
                .encodeABI()

            const addOwnerMetaTransactionData: MetaTransactionData = {
                to: safeAddress as Hexadecimal,
                data: addOwnerTrxData as Hexadecimal,
                value: '0',
                operation: OperationType.Call,
            }

            const [simulation, feeForecast] = await Promise.all([
                fetchAccountAbstractionTransactionSimulation({
                    initialUserOperation: simulationUserOperation,
                    dApp,
                    network,
                    signal,
                }),
                fetchGasAbstractionTransactionFees({
                    network,
                    initCode: safeInstance.deploymentInitCode,
                    metaTransactionDatas: [
                        requestMetaTransaction,
                        addOwnerMetaTransactionData,
                    ],
                    sender: safeAddress,
                    verificationGasLimitBuffer:
                        PASSKEY_SIGNATURE_VERIFICATION_GAS_LIMIT_BUFFER,
                    entrypoint,
                    networkRPCMap,
                    portfolio,
                    dummySignature: DUMMY_PASSKEY_SIGNATURE,
                    signal,
                }),
            ])

            const userOperationRequest: SimulatedWithDeploymentBundleUserOperationRequest =
                {
                    type: 'simulated_safe_deployment_bundle_user_operation_request',
                    account,
                    dApp,
                    network,
                    rpcRequest: rpcRequestToBundle,
                    simulationResult: simulation,
                    metaTransactionData: requestMetaTransaction,
                    addOwnerMetaTransactionData,
                    initCode: safeInstance.deploymentInitCode,
                    entrypoint,
                }

            return {
                feeForecast,
                userOperationRequest,
            }
        }
        default:
            return notReachable(safeInstance)
    }
}

export const Confirm = ({
    keyStore,
    rpcRequestToBundle,
    network,
    networkRPCMap,
    dAppInfo,
    accountsMap,
    networkMap,
    keyStoreMap,
    portfolio,
    account,
    sessionPassword,
    state,
    onMsg,
    gasCurrencyPresetMap,
    actionSource,
    installationId,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(simulateSafeTransaction, {
        type: 'loading',
        params: {
            rpcRequestToBundle,
            network,
            account,
            networkRPCMap,
            keyStore,
            portfolio,
            dApp: dAppInfo,
            sessionPassword,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return (
                <LoadingLayout
                    installationId={installationId}
                    account={account}
                    keyStore={keyStore}
                    network={network}
                    onMsg={onMsg}
                    state={state}
                    actionSource={actionSource}
                />
            )

        case 'loaded': {
            switch (loadable.data.userOperationRequest.simulationResult.type) {
                case 'failed':
                case 'not_supported':
                    return (
                        <>
                            <LoadingLayout
                                installationId={installationId}
                                account={account}
                                keyStore={keyStore}
                                network={network}
                                onMsg={onMsg}
                                state={state}
                                actionSource={actionSource}
                            />

                            <AppErrorPopup
                                error={parseAppError(
                                    new ImperativeError(
                                        'Simulation failed or not supported'
                                    )
                                )}
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'close':
                                            onMsg({
                                                type: 'on_cancel_confirm_transaction_clicked',
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

                case 'simulated':
                    return (
                        <Flow
                            networkRPCMap={networkRPCMap}
                            installationId={installationId}
                            simulation={
                                loadable.data.userOperationRequest
                                    .simulationResult.simulation
                            }
                            gasCurrencyPresetMap={gasCurrencyPresetMap}
                            accountsMap={accountsMap}
                            keyStoreMap={keyStoreMap}
                            networkMap={networkMap}
                            initialGasAbstractionTransactionFees={
                                loadable.data.feeForecast
                            }
                            userOperationRequest={
                                loadable.data.userOperationRequest
                            }
                            network={network}
                            dAppInfo={dAppInfo}
                            portfolio={portfolio}
                            visualState={state}
                            actionSource={actionSource}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'on_minimize_click':
                                    case 'on_cancel_confirm_transaction_clicked':
                                    case 'on_submit_click':
                                    case 'on_expand_request':
                                    case 'drag':
                                    case 'on_4337_gas_currency_selected':
                                    case 'on_user_confirmed_transaction_for_signing':
                                        onMsg(msg)
                                        break
                                    case 'on_edit_approval_form_submit':
                                        setLoadable({
                                            type: 'loading',
                                            params: {
                                                rpcRequestToBundle:
                                                    msg.updatedEthSendTransaction,
                                                network,
                                                account,
                                                networkRPCMap,
                                                keyStore,
                                                portfolio,
                                                dApp: dAppInfo,
                                                sessionPassword,
                                            },
                                        })
                                        break
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(msg)
                                }
                            }}
                        />
                    )

                default:
                    return notReachable(
                        loadable.data.userOperationRequest.simulationResult
                    )
            }
        }

        case 'error':
            return (
                <>
                    <LoadingLayout
                        installationId={installationId}
                        account={account}
                        keyStore={keyStore}
                        network={network}
                        onMsg={onMsg}
                        state={state}
                        actionSource={actionSource}
                    />

                    <AppErrorPopup
                        error={parseAppError(loadable.error)}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg({
                                        type: 'on_cancel_confirm_transaction_clicked',
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
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}

const LoadingLayout = ({
    state,
    keyStore,
    account,
    network,
    actionSource,
    installationId,
    onMsg,
}: {
    state: VisualState
    account: Account
    keyStore: SafeKeystore
    network: Network
    actionSource: ActionSource
    installationId: string
    onMsg: (msg: Msg) => void
}) => {
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
                    onNavigateBack={() => onMsg({ type: 'on_minimize_click' })}
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
                                        id="SendSafeTransaction.Confirm.loading"
                                        defaultMessage="Doing safety checks…"
                                    />
                                }
                            />
                        </Content>
                    </Column>
                </Screen>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
