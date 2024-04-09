import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { OutlineFingerprint } from '@zeal/uikit/Icon/OutlineFingerprint'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { AccountsMap } from '@zeal/domains/Account'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap, Safe4337 } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap } from '@zeal/domains/Network'
import { LoadingLayout } from '@zeal/domains/RPCRequest/features/SendSafe4337Transaction/Flow/LoadingLayout'
import {
    SignedUserOperationRequest,
    SimulatedWithAddOwnerUserOperationRequest,
    SimulatedWithDeploymentBundleUserOperationRequest,
} from '@zeal/domains/TransactionRequest'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import {
    UserOperationHash,
    UserOperationWithoutSignature,
    UserOperationWithSignature,
} from '@zeal/domains/UserOperation'
import { signUserOperationHashWithPassKey } from '@zeal/domains/UserOperation/helpers/signUserOperationHashWithPassKey'

type Props = {
    userOperationRequest:
        | SimulatedWithDeploymentBundleUserOperationRequest
        | SimulatedWithAddOwnerUserOperationRequest
    userOperationWithoutSignature: UserOperationWithoutSignature
    userOperationHash: UserOperationHash
    installationId: string
    simulation: SimulateTransactionResponse
    sessionPassword: string
    keyStore: Safe4337
    visualState: VisualState
    actionSource: ActionSource
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg =
    | { type: 'close' }
    | { type: 'on_minimize_click' }
    | {
          type: 'on_safe_transaction_signed'
          userOperationRequest: SignedUserOperationRequest
      }
    | { type: 'on_passkey_modal_close' }
    | MsgOf<typeof ConnectedMinimized>

const sign = async ({
    keyStore,
    userOperationRequest,
    userOperationWithoutSignature,
    userOperationHash,
    sessionPassword,
}: {
    keyStore: Safe4337
    userOperationRequest:
        | SimulatedWithDeploymentBundleUserOperationRequest
        | SimulatedWithAddOwnerUserOperationRequest
    userOperationWithoutSignature: UserOperationWithoutSignature
    userOperationHash: UserOperationHash
    sessionPassword: string
}): Promise<SignedUserOperationRequest> => {
    const signature = await signUserOperationHashWithPassKey({
        passkey: keyStore.safeDeplymentConfig.passkeyOwner,
        userOperationHash,
        sessionPassword,
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

export const Sign = ({
    userOperationRequest,
    userOperationWithoutSignature,
    simulation,
    onMsg,
    userOperationHash,
    keyStore,
    sessionPassword,
    visualState,
    actionSource,
    keyStoreMap,
    networkMap,
    accountsMap,
    installationId,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(sign, {
        type: 'loading',
        params: {
            keyStore,
            userOperationRequest,
            sessionPassword,
            userOperationHash,
            userOperationWithoutSignature,
        },
    })

    const onMsgLive = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
                break
            case 'loaded':
                onMsgLive.current({
                    type: 'on_safe_transaction_signed',
                    userOperationRequest: loadable.data,
                })
                break
            case 'error':
                const error = parseAppError(loadable.error)
                switch (error.type) {
                    case 'passkey_operation_cancelled':
                        onMsgLive.current({ type: 'on_passkey_modal_close' })
                        break
                    /* istanbul ignore next */
                    default:
                        break
                }
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable, onMsgLive])

    switch (loadable.type) {
        case 'loading':
        case 'loaded':
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
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
                case 'web':
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
                            <SignWithPasskeyPopup onMsg={onMsg} />
                        </>
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        case 'error':
            const error = parseAppError(loadable.error)

            switch (error.type) {
                case 'passkey_operation_cancelled':
                    return null
                /* istanbul ignore next */
                default:
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

                                        default:
                                            notReachable(msg)
                                    }
                                }}
                            />
                        </>
                    )
            }
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}

const SignWithPasskeyPopup = ({
    onMsg,
}: {
    onMsg: (msg: { type: 'close' }) => void
}) => (
    <Popup.Layout onMsg={onMsg}>
        <Header
            icon={({ size, color }) => (
                <OutlineFingerprint size={size} color={color} />
            )}
            title={
                <FormattedMessage
                    id="sign.passkey.title"
                    defaultMessage="Sign with passkey"
                />
            }
            subtitle={
                <FormattedMessage
                    id="sign.passkey.subtitle"
                    defaultMessage="Your browser should prompt you to sign with the passkey associated with this wallet. Please continue there."
                />
            }
        />
    </Popup.Layout>
)
