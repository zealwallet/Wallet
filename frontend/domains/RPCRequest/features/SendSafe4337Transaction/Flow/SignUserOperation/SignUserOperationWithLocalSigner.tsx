import { useEffect } from 'react'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { ImperativeError } from '@zeal/domains/Error'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap, Safe4337 } from '@zeal/domains/KeyStore'
import { getSafe4337Instance } from '@zeal/domains/KeyStore/helpers/getSafe4337Instance'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { LoadingLayout } from '@zeal/domains/RPCRequest/features/SendSafe4337Transaction/Flow/LoadingLayout'
import {
    SignedUserOperationRequest,
    SimulatedWithoutDeploymentBundleUserOperationRequest,
} from '@zeal/domains/TransactionRequest'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import {
    UserOperationWithoutSignature,
    UserOperationWithSignature,
} from '@zeal/domains/UserOperation'
import { fetchUserOperationHash } from '@zeal/domains/UserOperation/api/fetchUserOperationHash'
import { signUserOperationHashWithLocalSigner } from '@zeal/domains/UserOperation/helpers/signUserOperationHashWithLocalSigner'

type Props = {
    userOperationRequest: SimulatedWithoutDeploymentBundleUserOperationRequest
    userOperationWithoutSignature: UserOperationWithoutSignature
    installationId: string
    simulation: SimulateTransactionResponse
    sessionPassword: string
    network: Network
    networkRPCMap: NetworkRPCMap
    keyStore: Safe4337
    visualState: VisualState
    actionSource: ActionSource
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg =
    | { type: 'close' }
    | { type: 'on_minimize_click' }
    | {
          type: 'on_safe_transaction_signed'
          userOperationRequest: SignedUserOperationRequest
      }
    | MsgOf<typeof ConnectedMinimized>

const sign = async ({
    keyStore,
    userOperationRequest,
    network,
    networkRPCMap,
    userOperationWithoutSignature,
    sessionPassword,
}: {
    keyStore: Safe4337
    userOperationRequest: SimulatedWithoutDeploymentBundleUserOperationRequest
    userOperationWithoutSignature: UserOperationWithoutSignature
    networkRPCMap: NetworkRPCMap
    network: Network
    sessionPassword: string
}): Promise<SignedUserOperationRequest> => {
    const { safeDeplymentConfig } = keyStore

    const safeInstance = await getSafe4337Instance({
        safeDeplymentConfig,
        network: userOperationRequest.network,
        networkRPCMap,
    })

    const safeAddress = safeInstance.safeAddress

    if (safeAddress !== keyStore.address) {
        throw new ImperativeError(
            `Safe address mismatch safeAddress vs keystore keyStore.address`,
            {
                safeAddress: safeAddress,
                keyStoreAddress: keyStore.address,
            }
        )
    }

    const userOperationHash = await fetchUserOperationHash({
        networkRPCMap,
        network: userOperationRequest.network,
        userOperation: userOperationWithoutSignature,
    })

    const signature = await signUserOperationHashWithLocalSigner({
        keyStore,
        network,
        sessionPassword,
        userOperationHash,
    })

    const userOperationWithSignature: UserOperationWithSignature = {
        type: 'user_operation_with_signature',
        callData: userOperationWithoutSignature.callData,
        callGasLimit: userOperationWithoutSignature.callGasLimit,
        initCode: userOperationWithoutSignature.initCode,
        maxFeePerGas: userOperationWithoutSignature.maxFeePerGas,
        maxPriorityFeePerGas:
            userOperationWithoutSignature.maxPriorityFeePerGas,
        nonce: userOperationWithoutSignature.nonce,
        entrypoint: userOperationWithoutSignature.entrypoint,
        paymasterAndData: userOperationWithoutSignature.paymasterAndData,
        preVerificationGas: userOperationWithoutSignature.preVerificationGas,
        sender: userOperationWithoutSignature.sender,
        verificationGasLimit:
            userOperationWithoutSignature.verificationGasLimit,
        signature,
    }

    return {
        ...userOperationRequest,
        type: 'signed_safe_user_operation_request',
        userOperationWithSignature,
    }
}

export const SignUserOperationWithLocalSigner = ({
    userOperationRequest,
    userOperationWithoutSignature,
    simulation,
    onMsg,
    network,
    networkRPCMap,
    keyStore,
    sessionPassword,
    visualState,
    actionSource,
    keyStoreMap,
    accountsMap,
    networkMap,
    installationId,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(sign, {
        type: 'loading',
        params: {
            keyStore,
            userOperationRequest,
            sessionPassword,
            network,
            networkRPCMap,
            userOperationWithoutSignature,
        },
    })

    const onMsgLive = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'error':
                break
            case 'loaded':
                onMsgLive.current({
                    type: 'on_safe_transaction_signed',
                    userOperationRequest: loadable.data,
                })
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
                    initialProgress={20}
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
            )
        case 'error':
            const error = parseAppError(loadable.error)
            return (
                <>
                    <LoadingLayout
                        initialProgress={20}
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
