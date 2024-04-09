import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap, Safe4337 } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { SimulatedUserOperationRequest } from '@zeal/domains/TransactionRequest'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { UserOperationWithoutSignature } from '@zeal/domains/UserOperation'

import { SignUserOperationWithLocalSigner } from './SignUserOperationWithLocalSigner'
import { SignUserOperationWithPassKey } from './SignUserOperationWithPassKey'

type Props = {
    userOperationRequest: SimulatedUserOperationRequest
    userOperationWithoutSignature: UserOperationWithoutSignature
    installationId: string
    simulation: SimulateTransactionResponse
    sessionPassword: string
    keyStore: Safe4337
    network: Network
    networkRPCMap: NetworkRPCMap
    visualState: VisualState
    actionSource: ActionSource
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg =
    | MsgOf<typeof SignUserOperationWithPassKey>
    | MsgOf<typeof SignUserOperationWithLocalSigner>

export const SignUserOperation = ({
    userOperationRequest,
    userOperationWithoutSignature,
    keyStore,
    onMsg,
    network,
    networkRPCMap,
    sessionPassword,
    simulation,
    visualState,
    actionSource,
    networkMap,
    keyStoreMap,
    accountsMap,
    installationId,
}: Props) => {
    switch (userOperationRequest.type) {
        case 'simulated_safe_with_add_owner_user_operation_request':
        case 'simulated_safe_deployment_bundle_user_operation_request':
            return (
                <SignUserOperationWithPassKey
                    installationId={installationId}
                    userOperationRequest={userOperationRequest}
                    userOperationWithoutSignature={
                        userOperationWithoutSignature
                    }
                    simulation={simulation}
                    keyStore={keyStore}
                    sessionPassword={sessionPassword}
                    networkRPCMap={networkRPCMap}
                    visualState={visualState}
                    actionSource={actionSource}
                    networkMap={networkMap}
                    keyStoreMap={keyStoreMap}
                    accountsMap={accountsMap}
                    onMsg={onMsg}
                />
            )
        case 'simulated_safe_without_deployment_bundle_user_operation_request':
            return (
                <SignUserOperationWithLocalSigner
                    installationId={installationId}
                    userOperationWithoutSignature={
                        userOperationWithoutSignature
                    }
                    network={network}
                    networkRPCMap={networkRPCMap}
                    userOperationRequest={userOperationRequest}
                    simulation={simulation}
                    sessionPassword={sessionPassword}
                    keyStore={keyStore}
                    visualState={visualState}
                    actionSource={actionSource}
                    networkMap={networkMap}
                    keyStoreMap={keyStoreMap}
                    accountsMap={accountsMap}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(userOperationRequest)
    }
}
