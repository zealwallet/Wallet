import { useState } from 'react'

import { post as customRPCPost } from '@zeal/api/customRPCClient'

import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { object } from '@zeal/toolkit/Result'

import { ImperativeError } from '@zeal/domains/Error'
import { Network } from '@zeal/domains/Network'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import { EthChainId } from '@zeal/domains/RPCRequest'

import { CannotVerify } from './CannotVerify'
import { Form, NetworkForm } from './Form'
import { LoadingLayout } from './LoadingLayout'
import { SafetyWarning } from './SafetyWarning'

export type Props = {
    network: Network
    initialRPCUrl: string | null
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<MsgOf<typeof SafetyWarning>, { type: 'on_rpc_change_confirmed' }>

const fetch = async ({
    rpcUrl,
    network,
}: {
    network: Network
    rpcUrl: string
}): Promise<void> => {
    const chainIdRequest: EthChainId = {
        id: generateRandomNumber(),
        jsonrpc: '2.0',
        method: 'eth_chainId',
        params: [],
    }

    const response = await customRPCPost(rpcUrl, chainIdRequest)
    const chainId = object(response)
        .andThen((obj) => parseNetworkHexId(obj.result))
        .getSuccessResultOrThrow(
            'Failed to parse networkhexchain id when changing network rpc'
        )

    if (chainId !== network.hexChainId) {
        throw new ImperativeError(
            'RPC returns chain id not matching with network chain id'
        )
    }
}

export const EditNetworkRPC = ({ initialRPCUrl, network, onMsg }: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(fetch, {
        type: 'not_asked',
    })

    const [form, setForm] = useState<NetworkForm>({
        rpcUrl: initialRPCUrl || '',
    })

    switch (loadable.type) {
        case 'not_asked':
            return (
                <Form
                    form={form}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break

                            case 'on_form_change':
                                setForm(msg.form)
                                break

                            case 'on_form_submit':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        network,
                                        rpcUrl: msg.rpcUrl,
                                    },
                                })
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'loading':
            return (
                <LoadingLayout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setLoadable({ type: 'not_asked' })
                                break

                            default:
                                notReachable(msg.type)
                        }
                    }}
                />
            )

        case 'loaded':
            return (
                <SafetyWarning
                    initialRPCUrl={initialRPCUrl}
                    rpcUrl={loadable.params.rpcUrl}
                    network={network}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setLoadable({ type: 'not_asked' })
                                break
                            case 'on_rpc_change_confirmed':
                                onMsg(msg)
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'error':
            return (
                <CannotVerify
                    initialRPCUrl={initialRPCUrl}
                    rpcUrl={loadable.params.rpcUrl}
                    network={network}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setLoadable({ type: 'not_asked' })
                                break

                            case 'try_again_clicked':
                                setLoadable({
                                    type: 'loading',
                                    params: loadable.params,
                                })
                                break

                            case 'on_rpc_change_confirmed':
                                onMsg(msg)
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        default:
            return notReachable(loadable)
    }
}
