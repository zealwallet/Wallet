import { useEffect } from 'react'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { LoadingLayout } from '@zeal/domains/RPCRequest/features/SendSafe4337Transaction/Flow/LoadingLayout'
import { SimulatedUserOperationRequest } from '@zeal/domains/TransactionRequest'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import {
    GasAbstractionTransactionFee,
    UserOperationWithoutSignature,
} from '@zeal/domains/UserOperation'
import { fetchCurrentEntrypointNonce } from '@zeal/domains/UserOperation/api/fetchCurrentEntrypointNonce'
import { fetchERC20PaymasterAndData } from '@zeal/domains/UserOperation/api/fetchPaymasterAndData'

type Props = {
    selectedFee: GasAbstractionTransactionFee
    userOperationRequest: SimulatedUserOperationRequest
    simulation: SimulateTransactionResponse
    visualState: VisualState
    networkRPCMap: NetworkRPCMap
    actionSource: ActionSource
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    installationId: string
    onMsg: (msg: Msg) => void
}

type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg =
    | { type: 'close' }
    | {
          type: 'on_user_operation_constructed'
          userOperation: UserOperationWithoutSignature
      }
    | MsgOf<typeof LoadingLayout>

const fetch = async ({
    selectedFee,
    userOperationRequest,
    networkRPCMap,
    signal,
}: {
    selectedFee: GasAbstractionTransactionFee
    userOperationRequest: SimulatedUserOperationRequest
    networkRPCMap: NetworkRPCMap
    signal: AbortSignal
}): Promise<UserOperationWithoutSignature> => {
    const nonce = await fetchCurrentEntrypointNonce({
        network: userOperationRequest.network,
        address: userOperationRequest.account.address,
        entrypoint: userOperationRequest.entrypoint,
        networkRPCMap,
        signal,
    })
    switch (selectedFee.type) {
        case 'native_gas_abstraction_transaction_fee': {
            const { gasPrice, gasEstimate, callData } = selectedFee
            return {
                type: 'user_operation_without_signature',
                callData,
                sender: userOperationRequest.account.address,
                nonce,
                entrypoint: userOperationRequest.entrypoint,
                initCode: userOperationRequest.initCode,

                maxFeePerGas: gasPrice.maxFeePerGas,
                maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas,

                callGasLimit: gasEstimate.callGasLimit,
                preVerificationGas: gasEstimate.preVerificationGas,
                verificationGasLimit: gasEstimate.verificationGasLimit,

                paymasterAndData: null,
            }
        }
        case 'erc20_gas_abstraction_transaction_fee': {
            const paymasterAndData = await fetchERC20PaymasterAndData({
                nonce,
                network: userOperationRequest.network,
                signal,
                userOperationRequest,
                selectedFee: selectedFee,
            })

            return {
                type: 'user_operation_without_signature',
                callData: selectedFee.callData,
                sender: userOperationRequest.account.address,
                nonce,
                entrypoint: userOperationRequest.entrypoint,
                initCode: userOperationRequest.initCode,

                maxFeePerGas: selectedFee.gasPrice.maxFeePerGas,
                maxPriorityFeePerGas: selectedFee.gasPrice.maxPriorityFeePerGas,

                callGasLimit: selectedFee.gasEstimate.callGasLimit,
                preVerificationGas: selectedFee.gasEstimate.preVerificationGas,
                verificationGasLimit:
                    selectedFee.gasEstimate.verificationGasLimit,

                paymasterAndData,
            }
        }
        /* istanbul ignore next */
        default:
            return notReachable(selectedFee)
    }
}

export const ConstructUserOperation = ({
    userOperationRequest,
    selectedFee,
    simulation,
    visualState,
    actionSource,
    networkRPCMap,
    installationId,
    keyStoreMap,
    networkMap,
    accountsMap,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetch, {
        type: 'loading',
        params: {
            userOperationRequest,
            selectedFee,
            networkRPCMap,
        },
    })

    const onMsgLive = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
                break
            case 'loaded':
                onMsgLive.current({
                    type: 'on_user_operation_constructed',
                    userOperation: loadable.data,
                })
                break
            case 'error':
                captureError(loadable.error)
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable, onMsgLive])

    switch (loadable.type) {
        case 'loading':
        case 'loaded':
            return (
                <LoadingLayout
                    initialProgress={0}
                    userOperationRequest={userOperationRequest}
                    simulation={simulation}
                    visualState={visualState}
                    actionSource={actionSource}
                    installationId={installationId}
                    networkMap={networkMap}
                    keyStoreMap={keyStoreMap}
                    accountsMap={accountsMap}
                    onMsg={onMsg}
                />
            )
        case 'error':
            const error = parseAppError(loadable.error)
            return (
                <>
                    <LoadingLayout
                        initialProgress={0}
                        installationId={installationId}
                        simulation={simulation}
                        userOperationRequest={userOperationRequest}
                        visualState={visualState}
                        actionSource={actionSource}
                        networkMap={networkMap}
                        keyStoreMap={keyStoreMap}
                        accountsMap={accountsMap}
                        onMsg={onMsg}
                    />
                    <AppErrorPopup
                        error={error}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
                                    break

                                case 'try_again_clicked':
                                    setLoadable({
                                        type: 'loading',
                                        params: loadable.params,
                                    })
                                    break
                                /* istanbul ignore next */
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
