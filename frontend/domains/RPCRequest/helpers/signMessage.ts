import { toBuffer } from '@ethereumjs/util'
import Eth from '@ledgerhq/hw-app-eth' // TODO: @resetko - ledgerhq libs fail to import on mobile
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import * as sigUtil from '@metamask/eth-sig-util'
import { signTypedData } from '@metamask/eth-sig-util'
import Web3 from 'web3'

import { notReachable } from '@zeal/toolkit'
import {
    failure,
    match,
    object,
    oneOf,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { signMessageToSafeSignTypedDataV4 } from '@zeal/domains/Account/helpers/signMessageToSafeSignTypedDataV4'
import { ImperativeError } from '@zeal/domains/Error'
import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { getPrivateKey } from '@zeal/domains/KeyStore/helpers/getPrivateKey'
import {
    ToServiceWorkerTrezorConnectSignMessage,
    ToServiceWorkerTrezorConnectSignTypedData,
} from '@zeal/domains/Main'
import { Network } from '@zeal/domains/Network'
import {
    EthSignTypedData,
    EthSignTypedDataV3,
    EthSignTypedDataV4,
    PersonalSign,
} from '@zeal/domains/RPCRequest'

type Params = {
    request:
        | PersonalSign
        | EthSignTypedDataV4
        | EthSignTypedData
        | EthSignTypedDataV3
    keyStore: SigningKeyStore
    sessionPassword: string
    network: Network
}

const trezorSignMessage = async ({
    message,
    path,
}: {
    message: string
    path: string
}): Promise<string> => {
    const msg: ToServiceWorkerTrezorConnectSignMessage = {
        type: 'to_service_worker_trezor_connect_sign_message',
        message,
        path,
    }
    const response: unknown = await chrome.runtime.sendMessage(msg)

    const parsed = object(response)
        .andThen((obj) =>
            oneOf(obj, [
                shape({
                    type: match(obj.type, 'Success'),
                    data: string(obj.data),
                }).map(({ data }) => success(data)),
                shape({
                    type: match(obj.type, 'Failure'),
                    reason: success(obj.reason),
                }).map(({ reason }) => failure(reason)),
            ])
        )
        .getSuccessResultOrThrow(
            'failed to parse response for trezor_connect_sign_message'
        )

    switch (parsed.type) {
        case 'Success':
            return parsed.data
        case 'Failure':
            throw parsed.reason
        default:
            return notReachable(parsed)
    }
}

const trezorSignTypedData = async ({
    path,
    typedData,
}: {
    path: string
    typedData: object
}): Promise<string> => {
    const msg: ToServiceWorkerTrezorConnectSignTypedData = {
        type: 'to_service_worker_trezor_connect_sign_typed_data',
        typedData,
        path,
    }
    const response: unknown = await chrome.runtime.sendMessage(msg)

    const parsed = object(response)
        .andThen((obj) =>
            oneOf(obj, [
                shape({
                    type: match(obj.type, 'Success'),
                    data: string(obj.data),
                }).map(({ data }) => success(data)),
                shape({
                    type: match(obj.type, 'Failure'),
                    reason: success(obj.reason),
                }).map(({ reason }) => failure(reason)),
            ])
        )
        .getSuccessResultOrThrow(
            'failed to parse response for trezor_connect_sign_typed_data'
        )

    switch (parsed.type) {
        case 'Success':
            return parsed.data
        case 'Failure':
            throw parsed.reason
        default:
            return notReachable(parsed)
    }
}

export const signMessage = async ({
    request,
    sessionPassword,
    keyStore,
    network,
}: Params): Promise<string> => {
    switch (keyStore.type) {
        case 'safe_4337': {
            const { pk } = await getPrivateKey({
                keyStore: keyStore.localSignerKeyStore,
                sessionPassword,
            })

            switch (request.method) {
                case 'personal_sign':
                case 'eth_signTypedData':
                case 'eth_signTypedData_v3':
                    // TODO @resetko-zeal
                    throw new Error('Not implemented')

                case 'eth_signTypedData_v4': {
                    const safeMessage = await signMessageToSafeSignTypedDataV4({
                        keyStore,
                        request,
                        network,
                    })

                    const data = JSON.parse(safeMessage.params[1])
                    return signTypedData({
                        privateKey: toBuffer(pk),
                        data,
                        version: sigUtil.SignTypedDataVersion.V4,
                    })
                }

                /* istanbul ignore next */
                default:
                    return notReachable(request)
            }
        }

        case 'secret_phrase_key':
        case 'private_key_store':
            const { pk } = await getPrivateKey({ keyStore, sessionPassword })
            const web3 = new Web3()
            switch (request.method) {
                case 'personal_sign':
                    return web3.eth.accounts.sign(request.params[0], pk)
                        .signature
                case 'eth_signTypedData': {
                    const data = JSON.parse(request.params[1])
                    return signTypedData({
                        privateKey: toBuffer(pk),
                        data,
                        version: sigUtil.SignTypedDataVersion.V1,
                    })
                }

                case 'eth_signTypedData_v3': {
                    const data = JSON.parse(request.params[1])
                    return signTypedData({
                        privateKey: toBuffer(pk),
                        data,
                        version: sigUtil.SignTypedDataVersion.V3,
                    })
                }

                case 'eth_signTypedData_v4': {
                    const data = JSON.parse(request.params[1])
                    return signTypedData({
                        privateKey: toBuffer(pk),
                        data,
                        version: sigUtil.SignTypedDataVersion.V4,
                    })
                }
                /* istanbul ignore next */
                default:
                    return notReachable(request)
            }

        case 'trezor': {
            switch (request.method) {
                case 'personal_sign': {
                    const message = request.params[0]
                    const messageToSign = message.startsWith('0x')
                        ? message.substring(2)
                        : message

                    return trezorSignMessage({
                        path: keyStore.path,
                        message: messageToSign,
                    })
                }

                case 'eth_signTypedData':
                    throw new ImperativeError(
                        'eth_signTypedData V1 not supported by Trezor'
                    )

                case 'eth_signTypedData_v3':
                case 'eth_signTypedData_v4': {
                    return trezorSignTypedData({
                        path: keyStore.path,
                        typedData: JSON.parse(request.params[1]),
                    })
                }

                /* istanbul ignore next */
                default:
                    return notReachable(request)
            }
        }

        case 'ledger':
            const transport = await TransportWebHID.create()
            try {
                const app = new Eth(transport)
                switch (request.method) {
                    case 'personal_sign':
                        const message = request.params[0]
                        const messageToSign = message.startsWith('0x')
                            ? message.substring(2)
                            : Buffer.from(message).toString('hex')

                        const signPersonalMessage =
                            await app.signPersonalMessage(
                                keyStore.path,
                                messageToSign
                            )

                        return encodeSign(signPersonalMessage)

                    case 'eth_signTypedData':
                        throw new ImperativeError(
                            'eth_signTypedData V1 not supported by Ledger'
                        )

                    case 'eth_signTypedData_v3':
                    case 'eth_signTypedData_v4': {
                        const { message, types, primaryType, domain } =
                            sigUtil.TypedDataUtils.sanitizeData(
                                JSON.parse(request.params[1])
                            )
                        const isV4 =
                            request.method === 'eth_signTypedData_v4'
                                ? sigUtil.SignTypedDataVersion.V4
                                : sigUtil.SignTypedDataVersion.V3

                        const domainSeparatorHex =
                            sigUtil.TypedDataUtils.hashStruct(
                                'EIP712Domain',
                                domain,
                                types,
                                isV4
                            ).toString('hex')
                        const hashStructMessageHex =
                            sigUtil.TypedDataUtils.hashStruct(
                                primaryType as string,
                                message,
                                types,
                                isV4
                            ).toString('hex')

                        const signPersonalMessage =
                            await app.signEIP712HashedMessage(
                                keyStore.path,
                                domainSeparatorHex,
                                hashStructMessageHex
                            )

                        return encodeSign(signPersonalMessage)
                    }
                    /* istanbul ignore next */
                    default:
                        return notReachable(request)
                }
            } finally {
                await transport.close()
            }

        /* istanbul ignore next */
        default:
            return notReachable(keyStore)
    }
}

const flatten = (a: [string, string, string]) =>
    '0x' + a.reduce((r, s) => r + s.slice(2), '')

const encodeSignature = ([v, r, s]: [string, string, string]) =>
    flatten([r, s, v])

const encodeSign = ({
    v,
    s,
    r,
}: {
    v: number
    s: string
    r: string
}): string => {
    return encodeSignature(['0x' + v.toString(16), '0x' + r, '0x' + s])
}
