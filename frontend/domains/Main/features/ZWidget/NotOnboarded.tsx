import { useEffect } from 'react'

import { notReachable } from '@zeal/toolkit'
import { failure } from '@zeal/toolkit/Result'

import { ProviderToZwidget } from '@zeal/domains/Main'
import { openOnboardingPageTab } from '@zeal/domains/Main/helpers/openEntrypoint'
import { parseProviderToZwidget } from '@zeal/domains/Main/parsers/parseZwidgetContentMsgs'
import { unauthorizedPRCRequest } from '@zeal/domains/RPCRequest'
import { parseRPCRequest } from '@zeal/domains/RPCRequest/parsers/parseRPCRequest'

import { send } from './ZWidget/helpers/send'

export const NotOnboarded = () => {
    useEffect(() => {
        const listener = async (message: MessageEvent<ProviderToZwidget>) => {
            const event = parseProviderToZwidget(
                message.data
            ).getSuccessResult()

            if (!event) {
                return
            }

            switch (event.type) {
                case 'rpc_request':
                    const requestResult = parseRPCRequest(
                        event.request
                    ).getSuccessResult()
                    if (!requestResult) {
                        return
                    }

                    switch (requestResult.method) {
                        case 'metamask_getProviderState':
                        case 'net_listening':
                        case 'wallet_getSnaps':
                        case 'wallet_requestSnaps':
                        case 'wallet_invokeSnap':
                        case 'eth_accounts':
                        case 'net_version':
                        case 'eth_chainId':
                        case 'eth_coinbase':
                        case 'wallet_watchAsset':
                        case 'wallet_switchEthereumChain':
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
                        case 'wallet_addEthereumChain':
                        case 'wallet_getPermissions':
                            send({
                                type: 'rpc_response',
                                id: event.request.id,
                                response: failure(unauthorizedPRCRequest()),
                            })
                            return

                        case 'eth_requestAccounts':
                        case 'wallet_requestPermissions':
                            send({
                                type: 'rpc_response',
                                id: event.request.id,
                                response: failure(unauthorizedPRCRequest()),
                            })
                            openOnboardingPageTab()
                            return

                        /* istanbul ignore next */
                        default:
                            return notReachable(requestResult)
                    }

                case 'no_meta_mask_when_switching_to_zeal':
                case 'no_meta_mask_provider_during_init':
                case 'cannot_switch_to_meta_mask':
                case 'meta_mask_provider_available':
                    return
                /* istanbul ignore next */
                default:
                    return notReachable(event)
            }
        }

        window.addEventListener('message', listener)

        send({
            type: 'ready',
            state: {
                type: 'not_interacted',
            },
        })

        return () => window.removeEventListener('message', listener)
    }, [])

    return null
}
