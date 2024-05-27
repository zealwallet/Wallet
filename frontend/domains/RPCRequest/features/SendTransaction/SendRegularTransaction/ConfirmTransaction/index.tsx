import { notReachable } from '@zeal/toolkit'
import { withDelay } from '@zeal/toolkit/delay'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { bigint, numberString } from '@zeal/toolkit/Result'

import { AccountsMap } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import { FALLBACK_GAS_LIMIT } from '@zeal/domains/TransactionRequest/constants'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { Flow } from './Flow'
import {
    Msg as SkeletonMsg,
    Skeleton,
    State as SkeletonState,
} from './Skeleton'

export type FetchSimulationByRequest = ({
    network,
    rpcRequest,
    dApp,
}: {
    network: Network
    rpcRequest: EthSendTransaction
    dApp: DAppSiteInfo | null
}) => Promise<SimulationResult>

type Props = {
    installationId: string
    actionSource: ActionSource
    transactionRequest: NotSigned
    state: State

    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap

    accounts: AccountsMap
    keystores: KeyStoreMap

    fetchSimulationByRequest: FetchSimulationByRequest

    dApp: DAppSiteInfo | null

    onMsg: (msg: Msg) => void
}

const fetchGasEstimate = ({
    network,
    networkRPCMap,
    rpcRequest,
}: {
    network: Network
    networkRPCMap: NetworkRPCMap
    rpcRequest: EthSendTransaction
}): Promise<string> =>
    fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_estimateGas',
            params: [
                {
                    ...rpcRequest.params[0],
                    gas: undefined, // This RPC call will fail if we set a gas value here and the estimate is higher. It is seen as an upper bound - see https://ethereum.org/uz/developers/docs/apis/json-rpc/#eth_estimategas
                    data: (() => {
                        switch (network.type) {
                            case 'predefined': {
                                switch (network.name) {
                                    case 'Ethereum':
                                    case 'Arbitrum':
                                    case 'BSC':
                                    case 'Polygon':
                                    case 'PolygonZkevm':
                                    case 'Linea':
                                    case 'Fantom':
                                    case 'Optimism':
                                    case 'Base':
                                    case 'Blast':
                                    case 'OPBNB':
                                    case 'Gnosis':
                                    case 'Celo':
                                    case 'Avalanche':
                                    case 'Cronos':
                                    case 'Aurora':
                                        return rpcRequest.params[0].data
                                    case 'zkSync':
                                        return rpcRequest.params[0].data || '0x'
                                    default:
                                        return notReachable(network)
                                }
                            }
                            case 'custom':
                            case 'testnet':
                                return rpcRequest.params[0].data

                            default:
                                return notReachable(network)
                        }
                    })(),
                },
            ],
        },
    })
        .then((data) =>
            bigint(data).getSuccessResultOrThrow('failed to parse gas estimate')
        )
        .then((num) => `0x${num.toString(16)}`)
        .catch((error) => {
            captureError(error)
            return rpcRequest.params[0].gas || FALLBACK_GAS_LIMIT
        })

const fetch = async ({
    request,
    fetchSimulationByRequest,
    networkMap,
    networkRPCMap,
    dApp,
}: {
    request: NotSigned
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    fetchSimulationByRequest: FetchSimulationByRequest
    dApp: DAppSiteInfo | null
}): Promise<{
    simulation: SimulationResult
    nonce: number
    gasEstimate: string
}> => {
    const network = findNetworkByHexChainId(request.networkHexId, networkMap)
    const [simulation, nonce, gasEstimate] = await Promise.all([
        fetchSimulationByRequest({
            network,
            rpcRequest: request.rpcRequest,
            dApp,
        }),
        fetchRPCResponse({
            network,
            networkRPCMap,
            request: {
                id: generateRandomNumber(),
                jsonrpc: '2.0',
                method: 'eth_getTransactionCount',
                params: [request.account.address, 'latest'],
            },
        }).then((data) =>
            numberString(data).getSuccessResultOrThrow(
                'failed to parse current nonce'
            )
        ),
        fetchGasEstimate({
            network,
            networkRPCMap,
            rpcRequest: request.rpcRequest,
        }),
    ])

    return { simulation, nonce, gasEstimate }
}

type State = SkeletonState

export type Msg =
    | Extract<
          MsgOf<typeof Flow>,
          {
              type:
                  | 'drag'
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'on_expand_request'
                  | 'on_minimize_click'
                  | 'user_confirmed_transaction_for_signing'
                  | 'import_keys_button_clicked'
                  | 'on_predefined_fee_preset_selected'
          }
      >
    | SkeletonMsg

const SIMULATION_ANIMATION_TIME_MS = 1000

export const ConfirmTransaction = ({
    actionSource,
    transactionRequest,
    state,
    accounts,
    keystores,
    fetchSimulationByRequest,
    dApp,
    networkMap,
    networkRPCMap,
    feePresetMap,
    installationId,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(
        withDelay(fetch, SIMULATION_ANIMATION_TIME_MS),
        {
            type: 'loading',
            params: {
                request: transactionRequest,
                fetchSimulationByRequest: fetchSimulationByRequest,
                networkMap,
                networkRPCMap,
                dApp,
            },
        }
    )

    switch (loadable.type) {
        case 'loading':
            return (
                <Skeleton
                    installationId={installationId}
                    keystore={getKeyStore({
                        keyStoreMap: keystores,
                        address: loadable.params.request.account.address,
                    })}
                    state={state}
                    actionSource={actionSource}
                    account={loadable.params.request.account}
                    onMsg={onMsg}
                />
            )

        case 'loaded':
            return (
                <Flow
                    installationId={installationId}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    accounts={accounts}
                    keystores={keystores}
                    state={state}
                    transactionRequest={loadable.params.request}
                    simulation={loadable.data.simulation}
                    nonce={loadable.data.nonce}
                    gasEstimate={loadable.data.gasEstimate}
                    actionSource={actionSource}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'drag':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_expand_request':
                            case 'on_minimize_click':
                            case 'user_confirmed_transaction_for_signing':
                            case 'import_keys_button_clicked':
                            case 'on_predefined_fee_preset_selected':
                                onMsg(msg)
                                break

                            case 'on_retry_button_clicked':
                            case 'on_transaction_simulation_retry_clicked':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        request: loadable.params.request,
                                        fetchSimulationByRequest,
                                        networkMap,
                                        networkRPCMap,
                                        dApp,
                                    },
                                })
                                break
                            case 'on_edit_approval_form_submit':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        request: {
                                            ...loadable.params.request,
                                            rpcRequest:
                                                msg.updatedEthSendTransaction,
                                        },
                                        fetchSimulationByRequest,
                                        networkMap,
                                        networkRPCMap,
                                        dApp,
                                    },
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'error':
            return (
                <>
                    <Skeleton
                        installationId={installationId}
                        keystore={getKeyStore({
                            keyStoreMap: keystores,
                            address: loadable.params.request.account.address,
                        })}
                        state={state}
                        actionSource={actionSource}
                        account={loadable.params.request.account}
                        onMsg={onMsg}
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
