import { CancelSubmited, Submited } from '@zeal/domains/TransactionRequest'

export const cancelSubmittedToSubmitted = (
    request: CancelSubmited
): Submited => ({
    state: 'submited',
    account: request.account,
    dApp: request.dApp,
    networkHexId: request.networkHexId,
    rawTransaction: request.rawTransaction,
    rpcRequest: request.rpcRequest,
    selectedFee: request.selectedFee,
    simulation: request.simulation,
    submitedTransaction: request.submitedTransaction,
    selectedGas: request.selectedGas,
    selectedNonce: request.selectedNonce,
    gasEstimate: request.gasEstimate,
})
