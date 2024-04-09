import { useEffect } from 'react'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { ImperativeError } from '@zeal/domains/Error'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap, Safe4337 } from '@zeal/domains/KeyStore'
import { getSafe4337Instance } from '@zeal/domains/KeyStore/helpers/getSafe4337Instance'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { LoadingLayout } from '@zeal/domains/RPCRequest/features/SendSafe4337Transaction/Flow/LoadingLayout'
import {
    SimulatedWithAddOwnerUserOperationRequest,
    SimulatedWithDeploymentBundleUserOperationRequest,
} from '@zeal/domains/TransactionRequest'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import {
    UserOperationHash,
    UserOperationWithoutSignature,
} from '@zeal/domains/UserOperation'
import { fetchUserOperationHash } from '@zeal/domains/UserOperation/api/fetchUserOperationHash'

import { Sign } from './Sign'

type Props = {
    userOperationRequest:
        | SimulatedWithDeploymentBundleUserOperationRequest
        | SimulatedWithAddOwnerUserOperationRequest
    userOperationWithoutSignature: UserOperationWithoutSignature
    installationId: string
    simulation: SimulateTransactionResponse
    sessionPassword: string
    networkRPCMap: NetworkRPCMap
    keyStore: Safe4337
    visualState: VisualState
    actionSource: ActionSource
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg = MsgOf<typeof Sign> | MsgOf<typeof LoadingLayout>

/*
    TODO: This data loader component exists due to the fact that the Safe SDK methods + getOperationHash take long to resolve, 
     meaning there is a lag between our passkey popup and the actual passkey flow starting in the browser (if all of this is done in the same fetcher as the signing). 
     We should rather pass the safeInstance as a prop + do the userOp hashing locally. If done, we don't need this component anymore and can probably just use ./Sign.tsx directly.
 */
const fetch = async ({
    keyStore,
    network,
    networkRPCMap,
    userOperation,
    signal,
}: {
    userOperation: UserOperationWithoutSignature
    network: Network
    signal?: AbortSignal
    networkRPCMap: NetworkRPCMap
    keyStore: Safe4337
}): Promise<UserOperationHash> => {
    const { safeDeplymentConfig } = keyStore

    const safeInstance = await getSafe4337Instance({
        safeDeplymentConfig,
        network: network,
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

    return fetchUserOperationHash({
        network,
        networkRPCMap,
        userOperation,
        signal,
    })
}

export const SignUserOperationWithPassKey = ({
    userOperationRequest,
    userOperationWithoutSignature,
    simulation,
    onMsg,
    networkRPCMap,
    keyStore,
    sessionPassword,
    visualState,
    actionSource,
    installationId,
    keyStoreMap,
    networkMap,
    accountsMap,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetch, {
        type: 'loading',
        params: {
            userOperation: userOperationWithoutSignature,
            network: userOperationRequest.network,
            networkRPCMap,
            keyStore,
        },
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'loaded':
                break
            case 'error':
                captureError(loadable.error)
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable])

    switch (loadable.type) {
        case 'loading':
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
        case 'loaded':
            return (
                <Sign
                    installationId={installationId}
                    userOperationRequest={userOperationRequest}
                    userOperationHash={loadable.data}
                    userOperationWithoutSignature={
                        userOperationWithoutSignature
                    }
                    simulation={simulation}
                    keyStore={keyStore}
                    sessionPassword={sessionPassword}
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
