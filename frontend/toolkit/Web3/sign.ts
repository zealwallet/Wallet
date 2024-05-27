import { secp256k1 } from '@noble/curves/secp256k1'
import { hashMessage, hashTypedData, TypedDataDefinition } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { encodePacked, keccak256 } from 'viem/utils'

import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'

import { PrivateKey } from './privateKey'

import { parse as parseJSON } from '../JSON'
import { array, combine, object, oneOf, shape, string } from '../Result'

export const signTypedDataV1 = async (
    pk: PrivateKey,
    typedDataString: string
): Promise<Hexadecimal.Hexadecimal> => {
    const typedData = parseJSON(typedDataString)
        .andThen(array)
        .andThen((arr) =>
            combine(
                arr.map((item) =>
                    object(item).andThen((itemObj) =>
                        shape({
                            type: string(itemObj.type),
                            name: string(itemObj.name),
                            value: string(itemObj.value),
                        })
                    )
                )
            )
        )
        .getSuccessResultOrThrow('Failed to parse typedDataV1')

    const types = typedData.map(({ type }) => type)
    const datas = typedData.map(({ value }) => value)
    const schema = typedData.map(({ type, name }) => `${type} ${name}`)

    const hash = keccak256(
        encodePacked(
            ['bytes32', 'bytes32'],
            [
                keccak256(encodePacked(['string[]'], [schema])),
                keccak256(encodePacked(types, datas)),
            ]
        )
    )

    const sig = secp256k1.sign(
        Hexadecimal.remove0x(hash),
        Hexadecimal.remove0x(pk.privateKey)
    )

    const v = Hexadecimal.fromBigInt(BigInt(sig.recovery + 27))
    const r = Hexadecimal.fromBigInt(sig.r)
    const s = Hexadecimal.fromBigInt(sig.s)

    return Hexadecimal.concat(r, s, v)
}

export const signTypedData = (pk: PrivateKey, typedDataString: string) => {
    const viemAccount = privateKeyToAccount(pk.privateKey)
    const data = JSON.parse(typedDataString)
    return viemAccount.signTypedData(data)
}

export const signMessage = (pk: PrivateKey, message: string) => {
    const viemAccount = privateKeyToAccount(pk.privateKey)

    const messageHex =
        Hexadecimal.parseFromString(message).getSuccessResult() || null

    return viemAccount.signMessage({
        message: messageHex ? { raw: messageHex } : message,
    })
}

export const personalSignMessageToSafeSignTypedDataV4 = ({
    message,
    hexChainId,
    verifyingContract,
}: {
    verifyingContract: string // TODO @resetko-zeal Hexadecimal.Hexadecimal once Address is extended from it and not the string
    hexChainId: string // TODO @resetko-zeal Hexadecimal.Hexadecimal once NetworkHexId is extended from it and not the string
    message: string
}): object => {
    const messageHash = oneOf(message, [
        Hexadecimal.parseFromString(message).map((raw) => hashMessage({ raw })),
        string(message).map(hashMessage),
    ]).getSuccessResultOrThrow(
        'Failed to parse and hash the personalSign message'
    )

    return {
        domain: {
            chainId: BigInt(hexChainId).toString(10),
            verifyingContract,
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
            message: messageHash,
        },
    }
}

export const signTypedDataMessageToSafeSignTypedDataV4 = ({
    message,
    hexChainId,
    verifyingContract,
}: {
    verifyingContract: string // TODO @resetko-zeal Hexadecimal.Hexadecimal once Address is extended from it and not the string
    hexChainId: string // TODO @resetko-zeal Hexadecimal.Hexadecimal once NetworkHexId is extended from it and not the string
    message: object
}): object => ({
    domain: {
        chainId: BigInt(hexChainId).toString(10),
        verifyingContract,
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
        message: hashTypedData(message as TypedDataDefinition),
    },
})
