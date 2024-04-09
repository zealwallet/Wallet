import { notReachable } from '@zeal/toolkit'
import {
    failure,
    match,
    number,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
    ValidObject,
} from '@zeal/toolkit/Result'

import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import {
    AccountsChangeMsg,
    CannotSwitchToMetaMask,
    ChangeIframeSizeMessage,
    Disconnect,
    Drag,
    MetaMaskProviderAvailable,
    NetworkChangeMsg,
    NoMetaMaskProviderDuringInit,
    NoMetaMaskWhenSwitchingToZeal,
    ProviderToZwidget,
    ReadyMsg,
    RPCRequestMsg,
    RPCResponse,
    SelectMetaMaskProvider,
    SelectZealProvider,
    ZwidgetToContentScript,
    ZwidgetToProvider,
} from '@zeal/domains/Main'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import { parseRPCRequest } from '@zeal/domains/RPCRequest/parsers/parseRPCRequest'

const parseRPCRequestMsg = (
    input: ValidObject
): Result<unknown, RPCRequestMsg> =>
    shape({
        type: match(input.type, 'rpc_request'),
        request: object(input.request).andThen((o) =>
            shape({
                id: number(o.id),
                method: success(o.method),
                params: success(o.params),
            })
        ),
    })

const parseRPCResponse = (input: ValidObject): Result<unknown, RPCResponse> =>
    shape({
        type: match(input.type, 'rpc_response'),
        id: number(input.id),
        response: object(input.response).andThen((o) =>
            oneOf(o, [
                shape({
                    type: match(o.type, 'Success'),
                    data: success(o.data),
                }).map(({ data }) => success(data)),
                shape({
                    type: match(o.type, 'Failure'),
                    reason: success(o.reason),
                }).map(({ reason }) => failure(reason)),
            ])
        ),
    })

const parseChangeIframeSizeMessage = (
    input: ValidObject
): Result<unknown, ChangeIframeSizeMessage> =>
    shape({
        type: match(input.type, 'change_iframe_size'),
        size: oneOf(input.size, [
            match(input.size, 'icon'),
            match(input.size, 'small'),
            match(input.size, 'large'),
            match(input.size, 'large_with_full_screen_takeover'),
        ]),
    })

const parseAccountsChangeMsg = (
    input: ValidObject
): Result<unknown, AccountsChangeMsg> =>
    shape({
        type: match(input.type, 'account_change'),
        account: string(input.account),
    })

const parseNetworkChangeMsg = (
    input: ValidObject
): Result<unknown, NetworkChangeMsg> =>
    shape({
        type: match(input.type, 'network_change'),
        chainId: string(input.chainId),
    })

const parseDisconnect = (input: ValidObject): Result<unknown, Disconnect> =>
    shape({
        type: match(input.type, 'disconnect'),
    })

const parseDrag = (input: ValidObject): Result<unknown, Drag> =>
    shape({
        type: match(input.type, 'drag'),
        movement: object(input.movement).andThen((mov) =>
            shape({
                x: number(mov.x),
                y: number(mov.y),
            })
        ),
    })

const parseSelectMetaMaskProvider = (
    input: ValidObject
): Result<unknown, SelectMetaMaskProvider> =>
    shape({
        type: match(input.type, 'select_meta_mask_provider'),
        request: parseRPCRequest(input.request).andThen((request) => {
            switch (request.method) {
                case 'eth_requestAccounts':
                case 'eth_accounts':
                case 'wallet_requestPermissions':
                    return success(request)

                case 'debug_traceTransaction':
                case 'eth_blockNumber':
                case 'eth_call':
                case 'eth_chainId':
                case 'eth_coinbase':
                case 'eth_estimateGas':
                case 'eth_gasPrice':
                case 'eth_getBalance':
                case 'eth_getBlockByNumber':
                case 'eth_getCode':
                case 'eth_getTransactionByHash':
                case 'eth_getTransactionCount':
                case 'eth_getTransactionReceipt':
                case 'eth_getLogs':
                case 'eth_maxPriorityFeePerGas':
                case 'eth_sendRawTransaction':
                case 'eth_sendTransaction':
                case 'eth_signTypedData':
                case 'eth_signTypedData_v3':
                case 'eth_signTypedData_v4':
                case 'net_version':
                case 'personal_ecRecover':
                case 'personal_sign':
                case 'wallet_addEthereumChain':
                case 'wallet_switchEthereumChain':
                case 'web3_clientVersion':
                case 'wallet_watchAsset':
                case 'eth_getStorageAt':
                case 'wallet_getSnaps':
                case 'wallet_requestSnaps':
                case 'wallet_invokeSnap':
                case 'net_listening':
                case 'eth_newFilter':
                case 'eth_getFilterChanges':
                case 'eth_uninstallFilter':
                case 'metamask_getProviderState':
                case 'wallet_getPermissions':
                    return failure({
                        type: 'rpc_request_should_not_be_here_for_select_metamask_provider_message',
                        request: request,
                    })

                /* istanbul ignore next */
                default:
                    return failure(request)
            }
        }),
    })

const parseSelectZealProvider = (
    input: ValidObject
): Result<unknown, SelectZealProvider> =>
    shape({
        type: match(input.type, 'select_zeal_provider'),
        address: string(input.address),
        chainId: parseNetworkHexId(input.chainId),
    })

const parseMetaMaskProviderAvailableMsg = (
    input: ValidObject
): Result<unknown, MetaMaskProviderAvailable> =>
    shape({
        type: match(input.type, 'meta_mask_provider_available'),
    })

const parseReadyMsg = (input: ValidObject): Result<unknown, ReadyMsg> => {
    return shape({
        type: match(input.type, 'ready'),
        state: object(input.state).andThen((o) =>
            oneOf(o, [
                shape({
                    type: match(o.type, 'disconnected'),
                }),
                shape({
                    type: match(o.type, 'not_interacted'),
                }),
                shape({
                    type: match(o.type, 'connected_to_meta_mask'),
                }),
                shape({
                    type: match(o.type, 'connected'),
                    networkHexId: parseNetworkHexId(o.networkHexId),
                    address: parseAddress(o.address),
                }),
            ])
        ),
    })
}

const zwidgetToContentScript: ZwidgetToContentScript = {
    type: 'change_iframe_size',
    size: 'icon',
} as ZwidgetToContentScript

switch (zwidgetToContentScript.type) {
    case 'change_iframe_size':
    case 'drag':
        // do not forget to add parser when extending ZwidgetToContentScript
        break
    /* istanbul ignore next */
    default:
        notReachable(zwidgetToContentScript)
}

export const parseZwidgetToContentScript = (
    input: unknown
): Result<unknown, ZwidgetToContentScript> =>
    object(input).andThen((obj) =>
        oneOf(obj, [parseChangeIframeSizeMessage(obj), parseDrag(obj)])
    )

const zwidgetToProvider: ZwidgetToProvider = {
    type: 'disconnect',
} as ZwidgetToProvider

switch (zwidgetToProvider.type) {
    case 'ready':
    case 'select_zeal_provider':
    case 'disconnect':
    case 'rpc_response':
    case 'account_change':
    case 'network_change':
    case 'select_meta_mask_provider':
        // don't forget to add parser
        break
    /* istanbul ignore next */
    default:
        notReachable(zwidgetToProvider)
}

export const parseZwidgetToProvider = (
    input: unknown
): Result<unknown, ZwidgetToProvider> =>
    object(input).andThen((obj) =>
        oneOf(obj, [
            parseReadyMsg(obj),
            parseSelectZealProvider(obj),
            parseDisconnect(obj),
            parseRPCResponse(obj),
            parseAccountsChangeMsg(obj),
            parseNetworkChangeMsg(obj),
            parseSelectMetaMaskProvider(obj),
        ])
    )

const providerToZwidget: ProviderToZwidget = {
    type: 'meta_mask_provider_available',
} as ProviderToZwidget

switch (providerToZwidget.type) {
    case 'rpc_request':
    case 'no_meta_mask_provider_during_init':
    case 'cannot_switch_to_meta_mask':
    case 'no_meta_mask_when_switching_to_zeal':
    case 'meta_mask_provider_available':
        // dont forget to update parsers
        break
    /* istanbul ignore next */
    default:
        notReachable(providerToZwidget)
}

export const parseProviderToZwidget = (
    input: unknown
): Result<unknown, ProviderToZwidget> =>
    object(input).andThen((obj) =>
        oneOf(obj, [
            parseRPCRequestMsg(obj),
            parseMetaMaskProviderAvailableMsg(obj),
            parseNoMetaMaskProviderDuringInit(obj),
            parseCannotSwitchToMetaMask(obj),
            parseNoMetaMaskWhenSwitchingToZeal(obj),
        ])
    )

const parseNoMetaMaskProviderDuringInit = (
    input: ValidObject
): Result<unknown, NoMetaMaskProviderDuringInit> =>
    shape({
        type: match(input.type, 'no_meta_mask_provider_during_init'),
    })

const parseCannotSwitchToMetaMask = (
    input: ValidObject
): Result<unknown, CannotSwitchToMetaMask> =>
    shape({
        type: match(input.type, 'cannot_switch_to_meta_mask'),
    })

const parseNoMetaMaskWhenSwitchingToZeal = (
    input: ValidObject
): Result<unknown, NoMetaMaskWhenSwitchingToZeal> =>
    shape({
        type: match(input.type, 'no_meta_mask_when_switching_to_zeal'),
    })
