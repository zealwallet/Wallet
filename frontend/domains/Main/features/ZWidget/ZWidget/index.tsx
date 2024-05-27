import { useEffect, useLayoutEffect, useState } from 'react'

import { DragAndDropBar } from '@zeal/uikit/DragAndClickHandler'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { failure, oneOf, success } from '@zeal/toolkit/Result'
import { useUpdateEffect } from '@zeal/toolkit/useUpdateEffect'

import { Account } from '@zeal/domains/Account'
import { customNetworkFromChainIdNetwork } from '@zeal/domains/ChainIdNetwork/helpers/customNetworkFromChainIdNetwork'
import { fetchNetwork } from '@zeal/domains/ChainIdNetwork/helpers/fetchNetwork'
import { Disconnected } from '@zeal/domains/DApp/domains/ConnectionState/components/Disconnected'
import { calculate } from '@zeal/domains/DApp/domains/ConnectionState/helpers/calculate'
import { ImperativeError, RPCRequestParseError } from '@zeal/domains/Error'
import { parseRPCError } from '@zeal/domains/Error/domains/RPCError/parsers/parseRPCError'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { parseUnexpectedFailureError } from '@zeal/domains/Error/parsers/parseUnexpectedFailureError'
import {
    AlternativeProvider,
    ProviderToZwidget,
    RPCRequestMsg as RPCRequestMessage,
    RPCResponse,
    ZWidgetToExtension,
} from '@zeal/domains/Main'
import {
    openAddAccountPageTab,
    openAddFromHardwareWallet,
    openCreateContactPage,
    openCreateSafePage,
} from '@zeal/domains/Main/helpers/openEntrypoint'
import { parseChromeRuntimeMessageRequestMsgs } from '@zeal/domains/Main/parsers/parseChromeRuntimeMessageRequestMsgs'
import { parseProviderToZwidget } from '@zeal/domains/Main/parsers/parseZwidgetContentMsgs'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { DEFAULT_NETWORK } from '@zeal/domains/Network/constants'
import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import { updateNetworkRPC } from '@zeal/domains/Network/helpers/updateNetworkRPC'
import {
    InteractionRequest,
    notSupportedNetwork,
    ProviderRPCError,
    unauthorizedPRCRequest,
    unsupportedRPCMethod,
    userRejectedRequest,
    WalletSwitchEthereumChain,
} from '@zeal/domains/RPCRequest'
import { proxyRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { getSignatureAddress } from '@zeal/domains/RPCRequest/helpers/getSignatureAddress'
import { parseRPCRequest } from '@zeal/domains/RPCRequest/parsers/parseRPCRequest'
import { Storage } from '@zeal/domains/Storage'
import { addAccountsWithKeystores } from '@zeal/domains/Storage/helpers/addAccountsWithKeystores'
import { saveFeePreset } from '@zeal/domains/Storage/helpers/saveFeePreset'
import { saveGasCurrencyPreset } from '@zeal/domains/Storage/helpers/saveGasCurrencyPreset'
import { saveSessionPassword } from '@zeal/domains/Storage/helpers/saveSessionPassword'
import { toLocalStorage } from '@zeal/domains/Storage/helpers/toLocalStorage'
import { cancelSubmittedToSubmitted } from '@zeal/domains/TransactionRequest/helpers/cancelSubmittedToSubmitted'
import { removeTransactionRequest } from '@zeal/domains/TransactionRequest/helpers/removeTransactionRequest'
import { keystoreToUserEventType } from '@zeal/domains/UserEvents'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Connect } from './Connect'
import { Connected } from './Connected'
import { ConnectedToMetaMask } from './ConnectedToMetaMask'
import { send } from './helpers/send'
import { updateDAppInfo } from './helpers/updateDAppInfo'

const FAKE_PERMISSIONS_ID = '43bfdf429524a66f'

type Props = {
    dAppUrl: string
    selectedAddress: string
    installationId: string

    networkMap: NetworkMap

    storage: Storage
    sessionPassword: string | null
}

const failureResponse = (
    id: number | string,
    reason: ProviderRPCError
): RPCResponse => {
    return {
        type: 'rpc_response',
        id,
        response: failure(reason),
    }
}

export const ZWidget = ({
    sessionPassword,
    selectedAddress,
    dAppUrl,
    storage,
    networkMap,
    installationId,
}: Props) => {
    const state = calculate({ hostname: dAppUrl, dApps: storage.dApps })

    const [changeNetworkRequest, setChangeNetworkRequest] = useState<Network>(
        () => {
            switch (state.type) {
                case 'connected_to_meta_mask':
                case 'not_interacted':
                    return DEFAULT_NETWORK
                case 'disconnected':
                case 'connected': {
                    const network = networkMap[state.networkHexId]
                    return network || DEFAULT_NETWORK
                }
                /* istanbul ignore next */
                default:
                    return notReachable(state)
            }
        }
    )

    const [account, setAccount] = useState<Account>(() => {
        switch (state.type) {
            case 'not_interacted':
            case 'disconnected':
            case 'connected_to_meta_mask':
                return storage.accounts[selectedAddress]
            case 'connected':
                return storage.accounts[state.address]
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    })

    const [interactionRequest, setInteractionRequest] =
        useState<InteractionRequest | null>(null)

    const [alternativeProvider, setAlternativeProvider] =
        useState<AlternativeProvider>(() => {
            switch (state.type) {
                case 'not_interacted':
                case 'disconnected':
                case 'connected':
                    return 'provider_unavailable'
                case 'connected_to_meta_mask':
                    return 'metamask'
                /* istanbul ignore next */
                default:
                    return notReachable(state)
            }
        })

    const liveState = useLiveRef(state)
    const liveStorage = useLiveRef(storage)
    const liveChangeNetworkRequest = useLiveRef(changeNetworkRequest)
    const liveNetworkMap = useLiveRef(networkMap)

    useUpdateEffect(() => {
        // This ensures that all tabs connected to current dApp are in sync
        switch (state.type) {
            case 'not_interacted':
                break
            case 'disconnected':
                send({ type: 'disconnect' })
                break
            case 'connected':
                send({
                    type: 'select_zeal_provider',
                    address: state.address,
                    chainId: state.networkHexId,
                })
                break
            case 'connected_to_meta_mask':
                send({
                    type: 'select_meta_mask_provider',
                    request: {
                        id: generateRandomNumber(),
                        jsonrpc: '2.0',
                        method: 'eth_requestAccounts',
                        params: [],
                    },
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [state])

    useEffect(() => {
        const messageListener = (
            request: unknown,
            sender: chrome.runtime.MessageSender,
            respond: (response: ZWidgetToExtension | undefined) => void
        ): undefined | true => {
            if (sender.id === chrome.runtime.id) {
                const messageResult =
                    parseChromeRuntimeMessageRequestMsgs(request)

                switch (messageResult.type) {
                    case 'Failure':
                        respond(undefined)
                        return undefined
                    case 'Success': {
                        switch (messageResult.data.type) {
                            case 'extension_to_zwidget_extension_address_change':
                                respond(undefined)
                                const connectionState = liveState.current
                                const accounts = liveStorage.current.accounts
                                const account =
                                    accounts[messageResult.data.address]
                                if (!account) {
                                    captureError(
                                        new ImperativeError(
                                            'Failed to find account by address from extension message'
                                        )
                                    )
                                    return true
                                }

                                setAccount(account)

                                switch (connectionState.type) {
                                    case 'disconnected':
                                    case 'not_interacted':
                                    case 'connected_to_meta_mask':
                                        toLocalStorage({
                                            ...liveStorage.current,
                                            selectedAddress: account.address,
                                        })
                                        return true
                                    case 'connected':
                                        toLocalStorage({
                                            ...liveStorage.current,
                                            selectedAddress: account.address,
                                            dApps: {
                                                ...liveStorage.current.dApps,
                                                [dAppUrl]: {
                                                    type: 'connected',
                                                    address: account.address,
                                                    networkHexId:
                                                        liveChangeNetworkRequest
                                                            .current.hexChainId,
                                                    dApp: liveState.current
                                                        .dApp,
                                                    connectedAtMs: Date.now(),
                                                },
                                            },
                                        })
                                        send({
                                            type: 'account_change',
                                            account: account.address,
                                        })
                                        return true
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(connectionState)
                                }

                            case 'extension_to_zwidget_query_zwidget_connection_state_and_network':
                                respond({
                                    type: 'current_zwidget_connection_state_and_network',
                                    state: liveState.current,
                                    networkHexId:
                                        liveChangeNetworkRequest.current
                                            .hexChainId,
                                })
                                return true

                            case 'extension_to_zwidget_expand_zwidget':
                            case 'to_service_worker_trezor_connect_get_public_key':
                            case 'to_service_worker_trezor_connect_sign_transaction':
                            case 'to_service_worker_trezor_connect_sign_message':
                            case 'to_service_worker_trezor_connect_sign_typed_data':
                                // not handled here
                                return true

                            default:
                                return notReachable(messageResult.data)
                        }
                    }

                    default:
                        return notReachable(messageResult)
                }
            }

            return undefined
        }

        chrome.runtime.onMessage.addListener(messageListener)

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener)
        }
    }, [dAppUrl, liveChangeNetworkRequest, liveState, liveStorage])

    useLayoutEffect(() => {
        const listener = async (message: MessageEvent<ProviderToZwidget>) => {
            const event = parseProviderToZwidget(
                message.data
            ).getSuccessResult()

            if (!event) {
                return
            }

            const handleNetworkChangeRequest = async (
                event: RPCRequestMessage,
                request: WalletSwitchEthereumChain
            ) => {
                const chainId = request.params[0].chainId

                let network: Network | null =
                    liveNetworkMap.current[chainId] || null

                if (!network) {
                    try {
                        const chainIdNetwork = await fetchNetwork(chainId)
                        const customNetwork =
                            customNetworkFromChainIdNetwork(chainIdNetwork)
                        liveStorage.current.customNetworkMap[chainId] =
                            customNetwork
                        await toLocalStorage(liveStorage.current)
                        network = customNetwork
                    } catch (error) {
                        captureError(error)
                    }
                }

                if (network && isRPCSupported(network)) {
                    setChangeNetworkRequest(network)
                    const connection = liveState.current

                    switch (connection.type) {
                        case 'disconnected':
                        case 'not_interacted': {
                            liveStorage.current.dApps[
                                liveState.current.dApp.hostname
                            ] = {
                                type: 'disconnected',
                                dApp: connection.dApp,
                                networkHexId: chainId,
                            }

                            break
                        }

                        case 'connected': {
                            liveStorage.current.dApps[
                                liveState.current.dApp.hostname
                            ] = {
                                ...connection,
                                networkHexId: chainId,
                            }
                            break
                        }

                        case 'connected_to_meta_mask': {
                            captureError(
                                new ImperativeError(
                                    'we got network change request in connected to connected_to_meta_mask state'
                                )
                            )
                            break
                        }

                        /* istanbul ignore next */
                        default:
                            return notReachable(connection)
                    }
                    await toLocalStorage(liveStorage.current)

                    send({
                        type: 'network_change',
                        chainId,
                    })

                    send({
                        type: 'rpc_response',
                        id: event.request.id,
                        response: success(null),
                    })
                } else {
                    return send({
                        type: 'rpc_response',
                        id: event.request.id,
                        response: failure(notSupportedNetwork()),
                    })
                }
            }

            const handleRPCRequestWhenNotConnected = async (
                event: RPCRequestMessage
            ) => {
                const requestResult = parseRPCRequest(event.request)
                switch (requestResult.type) {
                    case 'Failure':
                        captureError(
                            new RPCRequestParseError({
                                reason: requestResult.reason,
                                rpcMethod: event.request.method,
                            })
                        )
                        send(
                            failureResponse(
                                event.request.id,
                                unsupportedRPCMethod()
                            )
                        )
                        break
                    case 'Success':
                        const request = requestResult.data
                        switch (request.method) {
                            case 'metamask_getProviderState':
                                send({
                                    type: 'rpc_response',
                                    id: event.request.id,
                                    response: success({
                                        isUnlocked: true,
                                        accounts: [],
                                        chainId:
                                            liveChangeNetworkRequest.current
                                                .hexChainId,
                                        networkVersion: parseInt(
                                            liveChangeNetworkRequest.current
                                                .hexChainId,
                                            16
                                        ).toString(10),
                                    }),
                                })
                                break
                            case 'net_listening': {
                                send({
                                    type: 'rpc_response',
                                    id: event.request.id,
                                    response: success(true),
                                })
                                break
                            }

                            case 'wallet_getSnaps':
                                send({
                                    type: 'rpc_response',
                                    id: event.request.id,
                                    response: success({}),
                                })
                                break

                            case 'wallet_requestSnaps':
                            case 'wallet_invokeSnap':
                                send({
                                    type: 'rpc_response',
                                    id: event.request.id,
                                    response: failure({
                                        code: 4001,
                                        message: 'Snaps not supported',
                                    }),
                                })
                                break

                            case 'eth_accounts':
                                send({
                                    type: 'rpc_response',
                                    id: event.request.id,
                                    response: success([]),
                                })
                                break
                            case 'net_version':
                                send({
                                    type: 'rpc_response',
                                    id: event.request.id,
                                    response: success(
                                        `${parseInt(
                                            liveChangeNetworkRequest.current
                                                .hexChainId,
                                            16
                                        )}`
                                    ),
                                })
                                break

                            case 'eth_chainId':
                                send({
                                    type: 'rpc_response',
                                    id: event.request.id,
                                    response: success(
                                        liveChangeNetworkRequest.current
                                            .hexChainId
                                    ),
                                })
                                break

                            case 'eth_coinbase':
                                send({
                                    type: 'rpc_response',
                                    id: event.request.id,
                                    response: success(null),
                                })
                                break

                            case 'wallet_watchAsset':
                                send({
                                    type: 'rpc_response',
                                    id: event.request.id,
                                    response: success(true),
                                })
                                break

                            case 'wallet_switchEthereumChain':
                                await handleNetworkChangeRequest(event, request)
                                break

                            // we allow some non-expensive read transaction without auth
                            case 'eth_call':
                            case 'eth_getCode':
                            case 'eth_blockNumber':
                            case 'eth_getBalance':
                            case 'eth_maxPriorityFeePerGas':
                            case 'eth_estimateGas':
                            case 'web3_clientVersion':
                            case 'eth_getFilterChanges':
                            case 'eth_newFilter':
                            case 'eth_uninstallFilter':
                                proxyRPCResponse({
                                    request,
                                    network: liveChangeNetworkRequest.current,
                                    networkRPCMap:
                                        liveStorage.current.networkRPCMap,
                                    dAppSiteInfo: liveState.current.dApp,
                                })
                                    .then((response) => {
                                        send({
                                            type: 'rpc_response',
                                            id: event.request.id,
                                            response: success(response),
                                        })
                                    })
                                    .catch((error: unknown) => {
                                        const parsed = oneOf(error, [
                                            parseRPCError(error).map(
                                                ({ payload }) => payload
                                            ),
                                            parseUnexpectedFailureError(
                                                error
                                            ).map(
                                                ({ error: { reason } }) =>
                                                    reason
                                            ),
                                        ]).getSuccessResult()

                                        send({
                                            type: 'rpc_response',
                                            id: event.request.id,
                                            response: failure(parsed || error),
                                        })
                                    })
                                break
                            case 'wallet_addEthereumChain':
                                const requestData = request.params[0]

                                const chainId =
                                    parseNetworkHexId(
                                        requestData.chainId.toLowerCase()
                                    ).getSuccessResult() || null

                                if (!chainId) {
                                    send({
                                        type: 'rpc_response',
                                        id: event.request.id,
                                        response: failure(
                                            notSupportedNetwork()
                                        ),
                                    })
                                    break
                                }

                                const network: Network | null =
                                    chainId && liveNetworkMap.current[chainId]

                                if (network) {
                                    send({
                                        type: 'rpc_response',
                                        id: event.request.id,
                                        response: success(null),
                                    })
                                    break
                                }

                                setInteractionRequest(request)
                                break

                            case 'eth_sendRawTransaction':
                            case 'eth_sendTransaction':
                            case 'eth_getTransactionReceipt':
                            case 'eth_getTransactionByHash':
                            case 'eth_getLogs':
                            case 'debug_traceTransaction':
                            case 'personal_sign':
                            case 'eth_getBlockByNumber':
                            case 'eth_signTypedData':
                            case 'eth_signTypedData_v4':
                            case 'eth_signTypedData_v3':
                            case 'eth_getTransactionCount':
                            case 'personal_ecRecover':
                            case 'eth_gasPrice':
                            case 'eth_getStorageAt':
                                send(
                                    failureResponse(
                                        request.id,
                                        unauthorizedPRCRequest()
                                    )
                                )

                                break

                            case 'eth_requestAccounts':
                            case 'wallet_requestPermissions':
                                setInteractionRequest(request)
                                break

                            case 'wallet_getPermissions':
                                send({
                                    type: 'rpc_response',
                                    id: event.request.id,
                                    response: success([]),
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(request)
                        }
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(requestResult)
                }
            }

            switch (liveState.current.type) {
                case 'connected_to_meta_mask':
                    switch (event.type) {
                        case 'cannot_switch_to_meta_mask': {
                            liveStorage.current.dApps[
                                liveState.current.dApp.hostname
                            ] = {
                                type: 'disconnected',
                                networkHexId:
                                    liveChangeNetworkRequest.current.hexChainId,
                                dApp: liveState.current.dApp,
                            }
                            setAlternativeProvider('provider_unavailable')
                            await toLocalStorage(liveStorage.current)
                            captureError(
                                new ImperativeError(
                                    'got cannot_switch_to_meta_mask in connected_to_meta_mask'
                                )
                            )
                            break
                        }

                        case 'meta_mask_provider_available': {
                            setAlternativeProvider('metamask')
                            break
                        }
                        case 'no_meta_mask_provider_during_init': {
                            liveStorage.current.dApps[
                                liveState.current.dApp.hostname
                            ] = {
                                type: 'disconnected',
                                networkHexId:
                                    liveChangeNetworkRequest.current.hexChainId,
                                dApp: liveState.current.dApp,
                            }
                            setAlternativeProvider('provider_unavailable')
                            await toLocalStorage(liveStorage.current)
                            break
                        }
                        case 'no_meta_mask_when_switching_to_zeal': {
                            captureError(
                                new ImperativeError(
                                    'got no_meta_mask_when_switching_to_zeal in connected_to_meta_mask'
                                )
                            )
                            break
                        }
                        case 'rpc_request':
                            captureError(
                                new ImperativeError(
                                    'we got rpc request in zwidget in connected_to_meta_mask state'
                                )
                            )
                            failureResponse(
                                event.request.id,
                                unsupportedRPCMethod()
                            )
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(event)
                    }
                    break

                case 'not_interacted':
                case 'disconnected': {
                    switch (event.type) {
                        case 'meta_mask_provider_available': {
                            setAlternativeProvider('metamask')
                            break
                        }
                        case 'cannot_switch_to_meta_mask':
                        case 'no_meta_mask_when_switching_to_zeal':
                        case 'no_meta_mask_provider_during_init': {
                            captureError(
                                new ImperativeError(
                                    `we got ${event.type} in zwidget in ${liveState.current.type} state`
                                )
                            )
                            break
                        }

                        case 'rpc_request':
                            liveStorage.current.dApps[dAppUrl] = {
                                type: 'disconnected',
                                networkHexId:
                                    liveChangeNetworkRequest.current.hexChainId,
                                dApp: {
                                    hostname: dAppUrl,
                                    avatar: null,
                                    title: null,
                                },
                            }
                            await toLocalStorage(liveStorage.current)
                            await handleRPCRequestWhenNotConnected(event)
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(event)
                    }
                    break
                }

                case 'connected':
                    switch (event.type) {
                        case 'no_meta_mask_when_switching_to_zeal':
                        case 'no_meta_mask_provider_during_init':
                        case 'cannot_switch_to_meta_mask': {
                            captureError(
                                new ImperativeError(
                                    `got ${event.type} in ${liveState.current.type}`
                                )
                            )
                            break
                        }

                        case 'meta_mask_provider_available': {
                            setAlternativeProvider('metamask')
                            break
                        }

                        case 'rpc_request': {
                            const request = parseRPCRequest(event.request)
                            switch (request.type) {
                                case 'Failure':
                                    captureError(
                                        new RPCRequestParseError({
                                            reason: request.reason,
                                            rpcMethod: event.request.method,
                                        })
                                    )
                                    send(
                                        failureResponse(
                                            event.request.id,
                                            unsupportedRPCMethod()
                                        )
                                    )
                                    break

                                case 'Success':
                                    switch (request.data.method) {
                                        case 'metamask_getProviderState':
                                            send({
                                                type: 'rpc_response',
                                                id: event.request.id,
                                                response: success({
                                                    isUnlocked: true,
                                                    accounts: [
                                                        liveState.current
                                                            .address,
                                                    ],
                                                    chainId:
                                                        liveChangeNetworkRequest
                                                            .current.hexChainId,
                                                    networkVersion: parseInt(
                                                        liveChangeNetworkRequest
                                                            .current.hexChainId,
                                                        16
                                                    ).toString(10),
                                                }),
                                            })
                                            break
                                        case 'personal_sign':
                                        case 'eth_signTypedData':
                                        case 'eth_signTypedData_v3':
                                        case 'eth_signTypedData_v4':
                                            setInteractionRequest(request.data)
                                            break

                                        case 'net_listening': {
                                            send({
                                                type: 'rpc_response',
                                                id: event.request.id,
                                                response: success(true),
                                            })
                                            break
                                        }

                                        case 'wallet_getSnaps':
                                            send({
                                                type: 'rpc_response',
                                                id: event.request.id,
                                                response: success({}),
                                            })
                                            break

                                        case 'wallet_requestSnaps':
                                        case 'wallet_invokeSnap':
                                            send({
                                                type: 'rpc_response',
                                                id: event.request.id,
                                                response: failure({
                                                    code: 4001,
                                                    message:
                                                        'Snaps not supported',
                                                }),
                                            })
                                            break

                                        case 'wallet_addEthereumChain':
                                            const requestData =
                                                request.data.params[0]

                                            const chainId =
                                                parseNetworkHexId(
                                                    requestData.chainId.toLowerCase()
                                                ).getSuccessResult() || null

                                            if (!chainId) {
                                                send({
                                                    type: 'rpc_response',
                                                    id: event.request.id,
                                                    response: failure(
                                                        notSupportedNetwork()
                                                    ),
                                                })
                                                break
                                            }

                                            const network: Network | null =
                                                chainId &&
                                                liveNetworkMap.current[chainId]

                                            if (network) {
                                                send({
                                                    type: 'rpc_response',
                                                    id: event.request.id,
                                                    response: success(null),
                                                })
                                                break
                                            }

                                            setInteractionRequest(request.data)
                                            break

                                        case 'wallet_watchAsset':
                                            send({
                                                type: 'rpc_response',
                                                id: event.request.id,
                                                response: success(true),
                                            })
                                            break

                                        case 'wallet_switchEthereumChain':
                                            await handleNetworkChangeRequest(
                                                event,
                                                request.data
                                            )
                                            break

                                        case 'eth_accounts':
                                        case 'eth_requestAccounts':
                                            send({
                                                type: 'rpc_response',
                                                id: event.request.id,
                                                response: success([
                                                    liveState.current.address.toLowerCase(),
                                                ]),
                                            })

                                            break
                                        case 'eth_sendTransaction':
                                            setInteractionRequest(request.data)
                                            break
                                        case 'eth_chainId': {
                                            send({
                                                type: 'rpc_response',
                                                id: event.request.id,
                                                response: success(
                                                    liveChangeNetworkRequest
                                                        .current.hexChainId
                                                ),
                                            })

                                            break
                                        }

                                        case 'eth_coinbase':
                                            send({
                                                type: 'rpc_response',
                                                id: event.request.id,
                                                response: success(
                                                    liveState.current.address
                                                ),
                                            })
                                            break

                                        case 'personal_ecRecover':
                                            getSignatureAddress({
                                                request: request.data,
                                            })
                                                .then((address) =>
                                                    send({
                                                        type: 'rpc_response',
                                                        id: event.request.id,
                                                        response: success(
                                                            address.toLowerCase()
                                                        ),
                                                    })
                                                )
                                                .catch((e) => {
                                                    send({
                                                        type: 'rpc_response',
                                                        id: event.request.id,
                                                        response: failure(e),
                                                    })
                                                })
                                            break

                                        case 'debug_traceTransaction':
                                        case 'eth_blockNumber':
                                        case 'eth_call':
                                        case 'eth_estimateGas':
                                        case 'eth_gasPrice':
                                        case 'eth_getBalance':
                                        case 'eth_getBlockByNumber':
                                        case 'eth_getCode':
                                        case 'eth_getLogs':
                                        case 'eth_maxPriorityFeePerGas':
                                        case 'eth_getTransactionByHash':
                                        case 'eth_getTransactionCount':
                                        case 'eth_getTransactionReceipt':
                                        case 'net_version':
                                        case 'web3_clientVersion':
                                        case 'eth_getStorageAt':
                                        case 'eth_getFilterChanges':
                                        case 'eth_newFilter':
                                        case 'eth_uninstallFilter':
                                        case 'eth_sendRawTransaction':
                                            proxyRPCResponse({
                                                request: request.data,
                                                network:
                                                    liveChangeNetworkRequest.current,
                                                networkRPCMap:
                                                    liveStorage.current
                                                        .networkRPCMap,
                                                dAppSiteInfo:
                                                    liveState.current.dApp,
                                            })
                                                .then((response) => {
                                                    send({
                                                        type: 'rpc_response',
                                                        id: event.request.id,
                                                        response:
                                                            success(response),
                                                    })
                                                })
                                                .catch((error: unknown) => {
                                                    const parsed = oneOf(
                                                        error,
                                                        [
                                                            parseRPCError(
                                                                error
                                                            ).map(
                                                                ({ payload }) =>
                                                                    payload
                                                            ),
                                                            parseUnexpectedFailureError(
                                                                error
                                                            ).map(
                                                                ({
                                                                    error: {
                                                                        reason,
                                                                    },
                                                                }) => reason
                                                            ),
                                                        ]
                                                    ).getSuccessResult()

                                                    send({
                                                        type: 'rpc_response',
                                                        id: event.request.id,
                                                        response: failure(
                                                            parsed || error
                                                        ),
                                                    })
                                                })
                                            break
                                        case 'wallet_requestPermissions':
                                        case 'wallet_getPermissions':
                                            send({
                                                type: 'rpc_response',
                                                id: event.request.id,
                                                response: success([
                                                    {
                                                        id: FAKE_PERMISSIONS_ID,
                                                        parentCapability:
                                                            'eth_accounts',
                                                        invoker:
                                                            document.referrer,
                                                        caveats: [
                                                            {
                                                                type: 'restrictReturnedAccounts',
                                                                value: [
                                                                    liveState
                                                                        .current
                                                                        .address,
                                                                ],
                                                            },
                                                        ],
                                                        date: 1704280814543,
                                                    },
                                                ]),
                                            })
                                            break

                                        default:
                                            notReachable(request.data)
                                    }
                                    break

                                /* istanbul ignore next */
                                default:
                                    return notReachable(request)
                            }
                            break
                        }

                        /* istanbul ignore next */
                        default:
                            return notReachable(event)
                    }
                    break

                /* istanbul ignore next */
                default:
                    return notReachable(liveState.current)
            }
        }

        window.addEventListener('message', listener)

        switch (liveState.current.type) {
            case 'connected_to_meta_mask':
                send({
                    type: 'ready',
                    state: {
                        type: 'connected_to_meta_mask',
                    },
                })
                break

            case 'not_interacted':
                send({
                    type: 'ready',
                    state: {
                        type: 'not_interacted',
                    },
                })
                break
            case 'disconnected':
                send({
                    type: 'ready',
                    state: {
                        type: 'disconnected',
                    },
                })
                break
            case 'connected':
                send({
                    type: 'ready',
                    state: {
                        type: 'connected',
                        networkHexId: liveState.current.networkHexId,
                        address: liveState.current.address,
                    },
                })
                break

            /* istanbul ignore next */
            default:
                return notReachable(liveState.current)
        }

        return () => {
            window.removeEventListener('message', listener)
        }
    }, [
        liveChangeNetworkRequest,
        liveState,
        liveStorage,
        dAppUrl,
        liveNetworkMap,
    ])

    useEffect(() => {
        const listener = async () => {
            if (!document.hidden) {
                switch (liveState.current.type) {
                    case 'connected':
                        await toLocalStorage({
                            ...liveStorage.current,
                            selectedAddress: liveState.current.address,
                        })
                        break

                    case 'disconnected':
                    case 'not_interacted':
                    case 'connected_to_meta_mask':
                        break

                    default:
                        notReachable(liveState.current)
                }
            }
        }

        document.addEventListener('visibilitychange', listener)

        listener()

        return () => {
            document.removeEventListener('visibilitychange', listener)
        }
    }, [liveState, liveStorage])

    useLayoutEffect(() => {
        if (interactionRequest) {
            send({ type: 'change_iframe_size', size: 'large' })
        }
    }, [interactionRequest])

    switch (state.type) {
        case 'not_interacted':
        case 'disconnected':
            if (interactionRequest) {
                return (
                    <>
                        <DragAndDropBar
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'drag':
                                        send(msg)
                                        break
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(msg.type)
                                }
                            }}
                        />
                        <Connect
                            installationId={installationId}
                            alternativeProvider={alternativeProvider}
                            currencyHiddenMap={storage.currencyHiddenMap}
                            networkMap={networkMap}
                            networkRPCMap={storage.networkRPCMap}
                            customCurrencyMap={storage.customCurrencies}
                            requestedNetwork={changeNetworkRequest}
                            key={interactionRequest.id}
                            encryptedPassword={storage.encryptedPassword}
                            sessionPassword={sessionPassword}
                            connectionState={state}
                            initialAccount={storage.accounts[selectedAddress]}
                            portfolioMap={storage.portfolios}
                            keystores={storage.keystoreMap}
                            accounts={storage.accounts}
                            dApps={storage.dApps}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'on_user_confirmed_connection_with_safety_checks':
                                    case 'use_meta_mask_instead_clicked':
                                    case 'on_continue_with_meta_mask':
                                        {
                                            setInteractionRequest(null)

                                            storage.dApps[state.dApp.hostname] =
                                                {
                                                    type: 'connected_to_meta_mask',
                                                    dApp: state.dApp,
                                                }
                                            await toLocalStorage(storage)

                                            switch (interactionRequest.method) {
                                                case 'wallet_requestPermissions':
                                                case 'eth_requestAccounts':
                                                    send({
                                                        type: 'select_meta_mask_provider',
                                                        request:
                                                            interactionRequest,
                                                    })
                                                    break

                                                case 'eth_sendTransaction':
                                                case 'eth_signTypedData_v4':
                                                case 'eth_signTypedData_v3':
                                                case 'eth_signTypedData':
                                                case 'personal_sign':
                                                case 'wallet_addEthereumChain':
                                                    captureError(
                                                        new ImperativeError(
                                                            `${interactionRequest.method} method can't be first request in disconnected state`
                                                        )
                                                    )
                                                    break

                                                /* istanbul ignore next */
                                                default:
                                                    notReachable(
                                                        interactionRequest
                                                    )
                                            }
                                        }

                                        break

                                    case 'on_account_create_request':
                                        msg.accountsWithKeystores.forEach(
                                            ({ keystore }) => {
                                                postUserEvent({
                                                    type: 'WalletAddedEvent',
                                                    keystoreType:
                                                        keystoreToUserEventType(
                                                            keystore
                                                        ),
                                                    keystoreId: keystore.id,
                                                    installationId,
                                                })
                                            }
                                        )
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        break

                                    case 'safe_wallet_clicked':
                                        openCreateSafePage()
                                        break

                                    case 'track_wallet_clicked':
                                        openCreateContactPage()
                                        break

                                    case 'add_wallet_clicked':
                                        openAddAccountPageTab()
                                        break

                                    case 'hardware_wallet_clicked':
                                        openAddFromHardwareWallet()
                                        break

                                    case 'session_password_decrypted':
                                        await saveSessionPassword(
                                            msg.sessionPassword
                                        )
                                        await toLocalStorage(storage)
                                        break
                                    case 'lock_screen_close_click':
                                    case 'on_minimize_click':
                                    case 'reject_connection_button_click':
                                        setInteractionRequest(null)
                                        send(
                                            failureResponse(
                                                interactionRequest.id,
                                                userRejectedRequest()
                                            )
                                        )
                                        break

                                    case 'on_rpc_change_confirmed':
                                        liveStorage.current.networkRPCMap[
                                            msg.network.hexChainId
                                        ] = updateNetworkRPC({
                                            network: msg.network,
                                            initialRPCUrl: msg.initialRPCUrl,
                                            networkRPCMap:
                                                liveStorage.current
                                                    .networkRPCMap,
                                            rpcUrl: msg.rpcUrl,
                                        })
                                        await toLocalStorage(
                                            liveStorage.current
                                        )
                                        break

                                    case 'on_select_rpc_click':
                                        liveStorage.current.networkRPCMap[
                                            msg.network.hexChainId
                                        ] = msg.networkRPC
                                        await toLocalStorage(
                                            liveStorage.current
                                        )
                                        break

                                    case 'dApp_info_loaded': {
                                        const newStorage = updateDAppInfo(
                                            msg.dApp,
                                            liveStorage.current,
                                            state
                                        )

                                        await toLocalStorage(newStorage)
                                        break
                                    }

                                    case 'on_zeal_account_connection_request':
                                    case 'zeal_account_connected':
                                        setInteractionRequest(null)

                                        storage.dApps[state.dApp.hostname] = {
                                            type: 'connected',
                                            dApp: state.dApp,
                                            address: msg.account.address,
                                            networkHexId:
                                                msg.network.hexChainId,
                                            connectedAtMs: Date.now(),
                                        }
                                        storage.selectedAddress =
                                            msg.account.address

                                        setAccount(msg.account)
                                        setChangeNetworkRequest(msg.network)
                                        await toLocalStorage(storage)

                                        send({
                                            type: 'network_change',
                                            chainId: msg.network.hexChainId,
                                        })

                                        send({
                                            type: 'account_change',
                                            account: msg.account.address,
                                        })

                                        switch (interactionRequest.method) {
                                            case 'eth_requestAccounts':
                                                send({
                                                    type: 'rpc_response',
                                                    id: interactionRequest.id,
                                                    response: success([
                                                        msg.account.address.toLowerCase(),
                                                    ]),
                                                })
                                                break

                                            case 'eth_sendTransaction':
                                            case 'eth_signTypedData_v4':
                                            case 'eth_signTypedData_v3':
                                            case 'eth_signTypedData':
                                            case 'personal_sign':
                                            case 'wallet_addEthereumChain':
                                                captureError(
                                                    new ImperativeError(
                                                        `${interactionRequest.method} method can't be first request in disconnected state`
                                                    )
                                                )
                                                break

                                            case 'wallet_requestPermissions':
                                                send({
                                                    type: 'rpc_response',
                                                    id: interactionRequest.id,
                                                    response: success([
                                                        {
                                                            id: FAKE_PERMISSIONS_ID,
                                                            parentCapability:
                                                                'eth_accounts',
                                                            invoker:
                                                                document.referrer,
                                                            caveats: [
                                                                {
                                                                    type: 'restrictReturnedAccounts',
                                                                    value: [
                                                                        msg
                                                                            .account
                                                                            .address,
                                                                    ],
                                                                },
                                                            ],
                                                            date: 1704280814543,
                                                        },
                                                    ]),
                                                })
                                                break
                                            /* istanbul ignore next */
                                            default:
                                                notReachable(interactionRequest)
                                        }

                                        break

                                    case 'on_how_to_connect_to_meta_mask_story_show':
                                        send({
                                            type: 'change_iframe_size',
                                            size: 'large_with_full_screen_takeover',
                                        })
                                        break

                                    case 'on_how_to_connect_to_meta_mask_story_closed':
                                        send({
                                            type: 'change_iframe_size',
                                            size: 'large',
                                        })
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(msg)
                                }
                            }}
                        />
                    </>
                )
            } else {
                switch (state.type) {
                    case 'not_interacted':
                        return null
                    case 'disconnected':
                        return (
                            <Disconnected
                                installationId={installationId}
                                isOnboardingStorySeen={
                                    storage.isOnboardingStorySeen
                                }
                                state={state}
                                onMsg={async (msg) => {
                                    switch (msg.type) {
                                        case 'disconnected_state_expanded':
                                            send({
                                                type: 'change_iframe_size',
                                                size: 'large_with_full_screen_takeover',
                                            })
                                            break
                                        case 'disconnected_state_minimized':
                                            send({
                                                type: 'change_iframe_size',
                                                size: 'icon',
                                            })
                                            break
                                        case 'connection_story_seen':
                                            await toLocalStorage({
                                                ...storage,
                                                isOnboardingStorySeen: true,
                                            })
                                            break
                                        case 'drag':
                                            send(msg)
                                            break
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(msg)
                                    }
                                }}
                            />
                        )
                    /* istanbul ignore next */
                    default:
                        return notReachable(state)
                }
            }

        case 'connected': {
            return (
                <Connected
                    account={account}
                    alternativeProvider={alternativeProvider}
                    currencyHiddenMap={storage.currencyHiddenMap}
                    feePresetMap={storage.feePresetMap}
                    gasCurrencyPresetMap={storage.gasCurrencyPresetMap}
                    networkMap={networkMap}
                    networkRPCMap={storage.networkRPCMap}
                    installationId={installationId}
                    encryptedPassword={storage.encryptedPassword}
                    customCurrencyMap={storage.customCurrencies}
                    connectionState={state}
                    ethNetworkChange={changeNetworkRequest}
                    interactionRequest={interactionRequest}
                    accounts={storage.accounts}
                    keystores={storage.keystoreMap}
                    portfolioMap={storage.portfolios}
                    sessionPassword={sessionPassword}
                    onMsg={async (msg) => {
                        switch (msg.type) {
                            case 'use_meta_mask_instead_clicked':
                            case 'on_continue_with_meta_mask':
                                storage.dApps[state.dApp.hostname] = {
                                    type: 'connected_to_meta_mask',
                                    dApp: state.dApp,
                                }
                                await toLocalStorage(storage)
                                send({
                                    type: 'select_meta_mask_provider',
                                    request: {
                                        id: generateRandomNumber(), // we don't really have any demand from dapp, but we also don't know if dapp is connected to MM, so we try to send eth_requestAccounts with fake id
                                        jsonrpc: '2.0',
                                        method: 'eth_requestAccounts',
                                        params: [],
                                    },
                                })
                                break

                            case 'disconnect_button_click':
                                postUserEvent({
                                    type: 'AppDisconnectedEvent',
                                    location: 'zwidget',
                                    scope: 'single',
                                    installationId,
                                })

                                send({
                                    type: 'disconnect',
                                })

                                storage.dApps[state.dApp.hostname] = {
                                    type: 'disconnected',
                                    networkHexId: state.networkHexId,
                                    dApp: state.dApp,
                                }
                                await toLocalStorage(storage)

                                break

                            case 'account_item_clicked':
                                await toLocalStorage({
                                    ...storage,
                                    selectedAddress: msg.account.address,
                                    dApps: {
                                        ...storage.dApps,
                                        [dAppUrl]: {
                                            type: 'connected',
                                            address: msg.account.address,
                                            networkHexId: state.networkHexId,
                                            dApp: state.dApp,
                                            connectedAtMs: Date.now(),
                                        },
                                    },
                                })

                                send({
                                    type: 'account_change',
                                    account: msg.account.address,
                                })

                                setAccount(msg.account)

                                break
                            case 'track_wallet_clicked':
                                openCreateContactPage()
                                break

                            case 'on_account_create_request':
                                msg.accountsWithKeystores.forEach(
                                    ({ keystore }) => {
                                        postUserEvent({
                                            type: 'WalletAddedEvent',
                                            keystoreType:
                                                keystoreToUserEventType(
                                                    keystore
                                                ),
                                            keystoreId: keystore.id,
                                            installationId,
                                        })
                                    }
                                )
                                await toLocalStorage(
                                    addAccountsWithKeystores(
                                        storage,
                                        msg.accountsWithKeystores
                                    )
                                )
                                setAccount(msg.accountsWithKeystores[0].account)
                                break

                            case 'import_keys_button_clicked':
                            case 'add_wallet_clicked':
                                openAddAccountPageTab()
                                break

                            case 'safe_wallet_clicked':
                                openCreateSafePage()
                                break

                            case 'hardware_wallet_clicked':
                                openAddFromHardwareWallet()
                                break

                            case 'on_network_item_click': {
                                switch (msg.network.type) {
                                    case 'all_networks':
                                        captureError(
                                            new ImperativeError(
                                                'All networks not possible in ZWidget'
                                            )
                                        )
                                        break

                                    case 'specific_network':
                                        setChangeNetworkRequest(
                                            msg.network.network
                                        )
                                        send({
                                            type: 'network_change',
                                            chainId:
                                                msg.network.network.hexChainId,
                                        })
                                        storage.dApps[dAppUrl] = {
                                            type: 'connected',
                                            address: state.address,
                                            networkHexId:
                                                msg.network.network.hexChainId,
                                            dApp: state.dApp,
                                            connectedAtMs: Date.now(),
                                        }
                                        await toLocalStorage(storage)
                                        break

                                    default:
                                        notReachable(msg.network)
                                }
                                break
                            }
                            case 'expanded':
                                send({
                                    type: 'change_iframe_size',
                                    size: 'large',
                                })
                                break
                            case 'minimized':
                                send({
                                    type: 'change_iframe_size',
                                    size: 'icon',
                                })
                                break
                            case 'session_password_decrypted':
                                await saveSessionPassword(msg.sessionPassword)
                                await toLocalStorage(storage)
                                break
                            case 'drag':
                                send(msg)
                                break

                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_sign_cancel_button_clicked':
                            case 'close':
                            case 'cancel_button_click':
                            case 'on_transaction_cancelled_successfully_close_clicked':
                            case 'on_safe_deployemnt_cancelled':
                            case 'on_close_transaction_status_not_found_modal':
                            case 'on_pre_sign_safe_deployment_error_popup_cancel_clicked':
                            case 'on_wrong_network_accepted':
                                setInteractionRequest(null)
                                send(
                                    failureResponse(
                                        interactionRequest!.id,
                                        userRejectedRequest()
                                    )
                                )
                                break

                            case 'transaction_failure_accepted': {
                                const { transactionRequest } = msg
                                const { account } = transactionRequest
                                await toLocalStorage({
                                    ...storage,
                                    transactionRequests: {
                                        [account.address]:
                                            removeTransactionRequest(
                                                storage.transactionRequests[
                                                    account.address
                                                ],
                                                msg.transactionRequest
                                            ),
                                    },
                                })
                                // TODO: this is trx close, ref
                                setInteractionRequest(null)
                                break
                            }

                            case 'message_signed':
                                setInteractionRequest(null)
                                send({
                                    type: 'rpc_response',
                                    // TODO: fix composition
                                    id: interactionRequest!.id,
                                    response: success(msg.signature),
                                })
                                break

                            case 'transaction_cancel_failure_accepted': {
                                setInteractionRequest(null)

                                const { transactionRequest } = msg
                                const { account } = transactionRequest
                                await toLocalStorage({
                                    ...storage,
                                    transactionRequests: {
                                        [account.address]:
                                            removeTransactionRequest(
                                                storage.transactionRequests[
                                                    account.address
                                                ],
                                                cancelSubmittedToSubmitted(
                                                    msg.transactionRequest
                                                )
                                            ),
                                    },
                                })
                                break
                            }

                            case 'on_safe_transaction_failure_accepted':
                                setInteractionRequest(null)
                                break

                            case 'on_transaction_completed_splash_animation_screen_competed':
                            case 'transaction_request_replaced':
                                const { transactionRequest } = msg
                                const { account } = transactionRequest
                                await toLocalStorage({
                                    ...storage,
                                    transactionRequests: {
                                        [account.address]:
                                            removeTransactionRequest(
                                                storage.transactionRequests[
                                                    account.address
                                                ],
                                                msg.transactionRequest
                                            ),
                                    },
                                })
                                break

                            case 'on_predefined_fee_preset_selected':
                                await toLocalStorage(
                                    saveFeePreset({
                                        storage,
                                        feePreset: msg.preset,
                                        networkHexId: msg.networkHexId,
                                    })
                                )
                                break

                            case 'on_completed_safe_transaction_close_click':
                            case 'on_completed_transaction_close_click':
                                setInteractionRequest(null)
                                break

                            case 'cancel_submitted': {
                                const address =
                                    msg.transactionRequest.account.address

                                await toLocalStorage({
                                    ...storage,
                                    transactionRequests: {
                                        ...storage.transactionRequests,
                                        [address]: removeTransactionRequest(
                                            storage.transactionRequests[
                                                address
                                            ],
                                            msg.transactionRequest
                                        ),
                                    },
                                })
                                break
                            }

                            case 'transaction_submited':
                                const existingRequests = storage
                                    .transactionRequests[state.address]
                                    ? removeTransactionRequest(
                                          storage.transactionRequests[
                                              state.address
                                          ],
                                          msg.transactionRequest
                                      )
                                    : []

                                storage.transactionRequests[state.address] = [
                                    msg.transactionRequest,
                                    ...existingRequests,
                                ]
                                await toLocalStorage(storage)
                                send({
                                    type: 'rpc_response',
                                    // TODO: fix composition
                                    id: interactionRequest!.id,
                                    response: success(
                                        msg.transactionRequest
                                            .submitedTransaction.hash
                                    ),
                                })
                                break

                            case 'on_network_add_clicked':
                                const { customNetwork } = msg

                                liveStorage.current.customNetworkMap[
                                    customNetwork.hexChainId
                                ] = customNetwork

                                await toLocalStorage(liveStorage.current)

                                setInteractionRequest(null)

                                send({
                                    type: 'rpc_response',
                                    // TODO: fix composition
                                    id: interactionRequest!.id,
                                    response: success(null),
                                })
                                break

                            case 'on_rpc_change_confirmed':
                                liveStorage.current.networkRPCMap[
                                    msg.network.hexChainId
                                ] = updateNetworkRPC({
                                    network: msg.network,
                                    initialRPCUrl: msg.initialRPCUrl,
                                    networkRPCMap:
                                        liveStorage.current.networkRPCMap,
                                    rpcUrl: msg.rpcUrl,
                                })
                                await toLocalStorage(liveStorage.current)
                                break

                            case 'on_select_rpc_click':
                                liveStorage.current.networkRPCMap[
                                    msg.network.hexChainId
                                ] = msg.networkRPC
                                await toLocalStorage(liveStorage.current)
                                break

                            case 'on_4337_gas_currency_selected':
                                await toLocalStorage(
                                    saveGasCurrencyPreset({
                                        storage: liveStorage.current,
                                        currencyId: msg.selectedGasCurrency.id,
                                        networkHexId: msg.network.hexChainId,
                                    })
                                )
                                break

                            case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                                // We don't change storage for safe transaction completeion because we don't store transaction requests for safe transactions
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        }

        case 'connected_to_meta_mask':
            return (
                <ConnectedToMetaMask
                    installationId={installationId}
                    connectionState={state}
                    initialAccount={storage.accounts[selectedAddress]}
                    portfolioMap={storage.portfolios}
                    keystores={storage.keystoreMap}
                    accounts={storage.accounts}
                    requestedNetwork={changeNetworkRequest}
                    interactionRequest={interactionRequest}
                    sessionPassword={sessionPassword}
                    encryptedPassword={storage.encryptedPassword}
                    customCurrencyMap={storage.customCurrencies}
                    networkRPCMap={storage.networkRPCMap}
                    networkMap={networkMap}
                    currencyHiddenMap={storage.currencyHiddenMap}
                    alternativeProvider={alternativeProvider}
                    dApps={storage.dApps}
                    onMsg={async (msg) => {
                        switch (msg.type) {
                            case 'expanded':
                                send({
                                    type: 'change_iframe_size',
                                    size: 'large',
                                })
                                break
                            case 'minimized':
                                send({
                                    type: 'change_iframe_size',
                                    size: 'icon',
                                })
                                break

                            case 'on_zeal_account_connection_request':
                            case 'zeal_account_connected':
                                storage.dApps[state.dApp.hostname] = {
                                    type: 'connected',
                                    dApp: state.dApp,
                                    address: msg.account.address,
                                    networkHexId: msg.network.hexChainId,
                                    connectedAtMs: Date.now(),
                                }
                                storage.selectedAddress = msg.account.address
                                setChangeNetworkRequest(msg.network)
                                setAccount(msg.account)
                                await toLocalStorage(storage)

                                send({
                                    type: 'select_zeal_provider',
                                    chainId: msg.network.hexChainId,
                                    address: msg.account.address,
                                })

                                break

                            case 'session_password_decrypted':
                                await saveSessionPassword(msg.sessionPassword)
                                await toLocalStorage(storage)
                                break
                            case 'on_select_rpc_click':
                                liveStorage.current.networkRPCMap[
                                    msg.network.hexChainId
                                ] = msg.networkRPC
                                await toLocalStorage(liveStorage.current)
                                break
                            case 'on_rpc_change_confirmed':
                                liveStorage.current.networkRPCMap[
                                    msg.network.hexChainId
                                ] = updateNetworkRPC({
                                    network: msg.network,
                                    initialRPCUrl: msg.initialRPCUrl,
                                    networkRPCMap:
                                        liveStorage.current.networkRPCMap,
                                    rpcUrl: msg.rpcUrl,
                                })
                                await toLocalStorage(liveStorage.current)
                                break

                            case 'dApp_info_loaded':
                                const newStorage = updateDAppInfo(
                                    msg.dApp,
                                    liveStorage.current,
                                    state
                                )
                                await toLocalStorage(newStorage)
                                break

                            case 'on_account_create_request':
                                msg.accountsWithKeystores.forEach(
                                    ({ keystore }) => {
                                        postUserEvent({
                                            type: 'WalletAddedEvent',
                                            keystoreType:
                                                keystoreToUserEventType(
                                                    keystore
                                                ),
                                            keystoreId: keystore.id,
                                            installationId,
                                        })
                                    }
                                )

                                await toLocalStorage(
                                    addAccountsWithKeystores(
                                        storage,
                                        msg.accountsWithKeystores
                                    )
                                )
                                break

                            case 'safe_wallet_clicked':
                                openCreateSafePage()
                                break
                            case 'track_wallet_clicked':
                                openCreateContactPage()
                                break
                            case 'add_wallet_clicked':
                                openAddAccountPageTab()
                                break
                            case 'hardware_wallet_clicked':
                                openAddFromHardwareWallet()
                                break
                            case 'drag':
                                send(msg)
                                break

                            case 'on_how_to_connect_to_meta_mask_story_show':
                                send({
                                    type: 'change_iframe_size',
                                    size: 'large_with_full_screen_takeover',
                                })
                                break

                            case 'on_how_to_connect_to_meta_mask_story_closed':
                                send({
                                    type: 'change_iframe_size',
                                    size: 'large',
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

const isRPCSupported = (network: Network | null): boolean => {
    if (!network) {
        return false
    }

    switch (network.type) {
        case 'predefined':
        case 'testnet':
            return network.isZealRPCSupported
        case 'custom':
            return true
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
