import {
    SignedUserOperationRequest,
    SubmittedToBundlerUserOperationRequest,
} from '@zeal/domains/TransactionRequest'
import { submitUserOperationToBundler } from '@zeal/domains/UserOperation/api/submitUserOperationToBundler'

export const submitUserOperationRequest = async ({
    userOperationRequest,
}: {
    userOperationRequest: SignedUserOperationRequest
}): Promise<SubmittedToBundlerUserOperationRequest> => {
    const { network, userOperationWithSignature } = userOperationRequest

    const userOperationHash = await submitUserOperationToBundler({
        network,
        userOperationWithSignature,
    })

    return {
        type: 'submitted_safe_user_operation_request',
        network: userOperationRequest.network,
        simulationResult: userOperationRequest.simulationResult,
        account: userOperationRequest.account,
        dApp: userOperationRequest.dApp,
        rpcRequest: userOperationRequest.rpcRequest,
        submittedUserOperation: {
            state: 'pending',
            sender: userOperationWithSignature.sender,
            queuedAt: Date.now(),
            userOperationHash,
        },
    }
}
