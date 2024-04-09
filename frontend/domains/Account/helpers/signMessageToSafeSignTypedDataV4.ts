import { hashMessage, hashTypedData, TypedDataDefinition } from 'viem'

import { generateRandomNumber } from '@zeal/toolkit/Number'

import { Safe4337 } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { EthSignTypedDataV4 } from '@zeal/domains/RPCRequest'

const generateSafeMessageMessage = (message: string | object): string => {
    return typeof message === 'string'
        ? hashMessage(message) // TODO @resetko-zeal this is for nontyped messages
        : hashTypedData(message as TypedDataDefinition) // TODO: @Nicvaniek parser
}

export const signMessageToSafeSignTypedDataV4 = async ({
    request,
    network,
    keyStore,
}: {
    request: EthSignTypedDataV4
    network: Network
    keyStore: Safe4337
}): Promise<EthSignTypedDataV4> => {
    const message = JSON.parse(request.params[1])

    const { localSignerKeyStore } = keyStore

    const safeMessage = {
        domain: {
            chainId: BigInt(network.hexChainId).toString(10),
            verifyingContract: keyStore.address,
        },
        types: {
            SafeMessage: [{ name: 'message', type: 'bytes' }],
            EIP712Domain: [
                {
                    name: 'chainId',
                    type: 'uint256',
                },
                {
                    name: 'verifyingContract',
                    type: 'address',
                },
            ],
        },
        primaryType: 'SafeMessage',
        message: {
            message: generateSafeMessageMessage(message),
        },
    }

    return {
        id: generateRandomNumber(),
        jsonrpc: '2.0',
        method: 'eth_signTypedData_v4',
        params: [localSignerKeyStore.address, JSON.stringify(safeMessage)],
    }
}
