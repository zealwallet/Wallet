import { Hexadecimal } from '@zeal/toolkit/Hexadecimal'

import { ImperativeError } from '@zeal/domains/Error'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'

import { MetaTransactionData, OperationType } from '../MetaTransactionData'

export const ethSendTransactionToMetaTransactionData = (
    request: EthSendTransaction
): MetaTransactionData => {
    const requestData = request.params[0]

    if (!requestData.to) {
        throw new ImperativeError(
            `Missing 'to' field in eth_sendTransaction request durin meta transaction conversion`
        )
    }

    return {
        data: (requestData.data as Hexadecimal) || '0x',
        to: requestData.to as Hexadecimal,
        value: requestData.value || '0x0',
        operation: OperationType.Call,
    }
}
