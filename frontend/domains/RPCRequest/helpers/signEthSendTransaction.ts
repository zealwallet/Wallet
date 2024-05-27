import Common, { Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { TransactionFactory } from '@ethereumjs/tx'
import { bufArrToArr } from '@ethereumjs/util'
import Eth, { ledgerService } from '@ledgerhq/hw-app-eth' // TODO: @resetko - ledgerhq libs fail to import on mobile
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import {
    EthereumSignedTx,
    EthereumTransaction as TrezorLegacy,
    EthereumTransactionEIP1559 as TrezorEIP1559,
} from '@trezor/connect-web'
import { components } from '@zeal/api/portfolio'
import Big from 'big.js'
import Web3 from 'web3'

import { notReachable } from '@zeal/toolkit'
import { toHex } from '@zeal/toolkit/Number'
import {
    failure,
    match,
    object,
    oneOf,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { ImperativeError } from '@zeal/domains/Error'
import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { getPrivateKey } from '@zeal/domains/KeyStore/helpers/getPrivateKey'
import { ToServiceWorkerTrezorConnectSignTransaction } from '@zeal/domains/Main'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import {
    EthSendRawTransaction,
    EthSendTransaction,
} from '@zeal/domains/RPCRequest'
import { ZealWeb3RPCProvider } from '@zeal/domains/RPCRequest/helpers/ZealWeb3RPCProvider'
import { EstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

export type SignAndSubmitRequest = {
    fee: EstimatedFee | components['schemas']['CustomPresetRequestFee']
    network: Network
    networkRPCMap: NetworkRPCMap
    nonce: number
    sendTransactionRequest: EthSendTransaction
    keyStore: SigningKeyStore
    sessionPassword: string
    gas: string
}

const signTrezorTransaction = async ({
    path,
    transaction,
}: {
    path: string
    transaction: TrezorEIP1559 | TrezorLegacy
}): Promise<EthereumSignedTx> => {
    const message: ToServiceWorkerTrezorConnectSignTransaction = {
        type: 'to_service_worker_trezor_connect_sign_transaction',
        transaction,
        path,
    }
    const response: unknown = await chrome.runtime.sendMessage(message)

    const parsed = object(response)
        .andThen((obj) =>
            oneOf(obj, [
                shape({
                    type: match(obj.type, 'Success'),
                    data: object(obj.data).andThen((dataObj) =>
                        shape({
                            v: string(dataObj.v),
                            r: string(dataObj.r),
                            s: string(dataObj.s),
                        })
                    ),
                }).map(({ data }) => success(data)),
                shape({
                    type: match(obj.type, 'Failure'),
                    reason: success(obj.reason),
                }).map(({ reason }) => failure(reason)),
            ])
        )
        .getSuccessResultOrThrow('trezor_connect_sign_transaction')

    switch (parsed.type) {
        case 'Success':
            return parsed.data
        case 'Failure':
            throw parsed.reason
        default:
            return notReachable(parsed)
    }
}

type Fee =
    | {
          gasPrice: string
      }
    | {
          type: 2
          maxFeePerGas: string
          maxPriorityFeePerGas: string
      }

const getFees = (
    fee: EstimatedFee | components['schemas']['CustomPresetRequestFee']
): Fee => {
    switch (fee.type) {
        case 'LegacyCustomPresetRequestFee':
        case 'LegacyFee':
            return { gasPrice: fee.gasPrice }

        case 'Eip1559Fee':
            return {
                type: 2,
                maxFeePerGas: fee.maxFeePerGas,
                maxPriorityFeePerGas: fee.maxPriorityFeePerGas,
            }
        case 'Eip1559CustomPresetRequestFee':
            return {
                type: 2,
                maxFeePerGas:
                    '0x' +
                    (
                        BigInt(fee.maxBaseFee) + BigInt(fee.maxPriorityFee)
                    ).toString(16),
                maxPriorityFeePerGas: fee.maxPriorityFee,
            }

        /* istanbul ignore next */
        default:
            return notReachable(fee)
    }
}

export const signEthSendTransaction = async ({
    fee,
    gas,
    sessionPassword,
    network,
    networkRPCMap,
    keyStore,
    sendTransactionRequest,
    nonce,
}: SignAndSubmitRequest): Promise<EthSendRawTransaction> => {
    const transactionConfigFee = getFees(fee)
    const chainId = parseInt(network.hexChainId, 16)

    const transactionConfig = {
        from: sendTransactionRequest.params[0].from,
        data: sendTransactionRequest.params[0].data,
        to: sendTransactionRequest.params[0].to,
        // gas?: string // string or number? Should we parse it??
        // gasPrice?: string // string or number? Should we parse it?? !!! :: no we should not ... some trx not support it and we got Error: eip-1559 transactions don't support gasPrice
        value: sendTransactionRequest.params[0].value,
        nonce,
        gas,
        gasLimit: gas,

        ...transactionConfigFee,

        chainId,
    }

    switch (keyStore.type) {
        case 'safe_4337':
            // TODO @resetko-zeal types should account for impossible state
            throw new ImperativeError(
                'Impossible state, Safe keystore reached regular transaction flow'
            )

        case 'secret_phrase_key':
        case 'private_key_store': {
            const { privateKey } = await getPrivateKey({
                keyStore,
                sessionPassword,
            })

            const w3 = new Web3(
                new ZealWeb3RPCProvider({ network, networkRPCMap })
            )
            const signed = await w3.eth.accounts.signTransaction(
                transactionConfig,
                privateKey
            )
            return {
                id: sendTransactionRequest.id,
                jsonrpc: '2.0',
                method: 'eth_sendRawTransaction',
                params: [signed.rawTransaction || ''],
            }
        }

        case 'trezor': {
            switch (fee.type) {
                case 'LegacyCustomPresetRequestFee':
                case 'LegacyFee': {
                    const transaction: TrezorLegacy = {
                        chainId,
                        nonce: toHex(nonce),
                        gasLimit: gas,
                        data: sendTransactionRequest.params[0].data,
                        to: sendTransactionRequest.params[0].to || '', // TODO :: need to check this with contract deployment
                        value: sendTransactionRequest.params[0].value || '0x0',
                        gasPrice: fee.gasPrice,
                        /**
                         * This txType is not same as type=0 for legacy or type=2 for EIP1559, it's something different, but it's not documented.
                         * The only metion is [here](https://github.com/trezor/trezor-firmware/blob/master/core/@zeal/apps/ethereum/sign_tx.py#L39),
                         * because if you set it to txType=0 you will get this error
                         */
                        txType: undefined,
                    }

                    const result = await signTrezorTransaction({
                        path: keyStore.path,
                        transaction,
                    })

                    const packed = TransactionFactory.fromTxData({
                        type: 0,
                        ...transaction,
                        ...result,
                    })
                        .serialize()
                        .toString('hex')

                    return {
                        id: sendTransactionRequest.id,
                        jsonrpc: '2.0',
                        method: 'eth_sendRawTransaction',
                        params: [`0x${packed}`],
                    }
                }

                case 'Eip1559CustomPresetRequestFee': {
                    const transaction: TrezorEIP1559 = {
                        accessList: [],
                        chainId,
                        nonce: toHex(nonce),
                        gasLimit: gas,
                        data: sendTransactionRequest.params[0].data,
                        to: sendTransactionRequest.params[0].to || '', // TODO :: need to check this with contract deployment
                        value: sendTransactionRequest.params[0].value || '0x0',
                        maxFeePerGas: toHex(
                            new Big(fee.maxBaseFee)
                                .add(fee.maxPriorityFee)
                                .toFixed(0)
                        ),
                        maxPriorityFeePerGas: fee.maxPriorityFee,
                    }

                    const result = await signTrezorTransaction({
                        path: keyStore.path,
                        transaction,
                    })

                    const packed = TransactionFactory.fromTxData({
                        /**
                         * We set type right before serialize because setting type during `ethereumSignTransaction` call will messup everything
                         */
                        type: 2,
                        ...transaction,
                        ...result,
                    })
                        .serialize()
                        .toString('hex')

                    return {
                        id: sendTransactionRequest.id,
                        jsonrpc: '2.0',
                        method: 'eth_sendRawTransaction',
                        params: [`0x${packed}`],
                    }
                }

                case 'Eip1559Fee': {
                    const transaction: TrezorEIP1559 = {
                        accessList: [],
                        chainId,
                        nonce: toHex(nonce),
                        gasLimit: gas,
                        data: sendTransactionRequest.params[0].data,
                        to: sendTransactionRequest.params[0].to || '', // TODO :: need to check this with contract deployment
                        value: sendTransactionRequest.params[0].value || '0x0',
                        maxFeePerGas: fee.maxFeePerGas,
                        maxPriorityFeePerGas: fee.maxPriorityFeePerGas,
                    }

                    const result = await signTrezorTransaction({
                        path: keyStore.path,
                        transaction,
                    })

                    const packed = TransactionFactory.fromTxData({
                        /**
                         * We set type right before serialize because setting type during `ethereumSignTransaction` call will messup everything
                         */
                        type: 2,
                        ...transaction,
                        ...result,
                    })
                        .serialize()
                        .toString('hex')

                    return {
                        id: sendTransactionRequest.id,
                        jsonrpc: '2.0',
                        method: 'eth_sendRawTransaction',
                        params: [`0x${packed}`],
                    }
                }

                /* istanbul ignore next */
                default:
                    return notReachable(fee)
            }
        }

        case 'ledger':
            const transport = await TransportWebHID.create()
            return new Promise((resolve, reject) => {
                let rejected = false
                const disconnectListener = (e: Error) => {
                    rejected = true
                    reject(e)
                }

                transport.on('disconnect', disconnectListener)
                const app = new Eth(transport)

                const unsignedTX = (() => {
                    switch (fee.type) {
                        case 'LegacyCustomPresetRequestFee':
                        case 'LegacyFee': {
                            const common = Common.custom({
                                chainId: transactionConfig.chainId,
                                defaultHardfork: Hardfork.Berlin,
                            }) as any // TODO :: possibly due to different versions this is actually not compatible, but working :fingerscrossed;
                            const options = { common }
                            const msg = TransactionFactory.fromTxData(
                                transactionConfig,
                                options
                            ).getMessageToSign(false)
                            // taken from getMessageToSign comment
                            return Buffer.from(
                                RLP.encode(bufArrToArr(msg))
                            ).toString('hex')
                        }

                        case 'Eip1559Fee':
                        case 'Eip1559CustomPresetRequestFee': {
                            return TransactionFactory.fromTxData(
                                transactionConfig
                            )
                                .getMessageToSign(false)
                                .toString('hex')
                        }
                        /* istanbul ignore next */
                        default:
                            return notReachable(fee)
                    }
                })()

                ledgerService
                    .resolveTransaction(unsignedTX, {}, {})
                    .then((resolution) => {
                        return app.signTransaction(
                            keyStore.path,
                            unsignedTX,
                            resolution
                        )
                    })
                    .then((signature) => {
                        const signedTrx =
                            '0x' +
                            TransactionFactory.fromTxData({
                                ...transactionConfig,
                                ...hexify(signature),
                            })
                                .serialize()
                                .toString('hex')

                        if (!rejected) {
                            resolve({
                                id: sendTransactionRequest.id,
                                jsonrpc: '2.0',
                                method: 'eth_sendRawTransaction',
                                params: [signedTrx || ''],
                            })
                        }
                    })
                    .catch((e) => {
                        rejected = true
                        reject(e)
                    })
                    .finally(() => {
                        transport.off('disconnect', disconnectListener)
                        transport.close()
                    })
            })

        /* istanbul ignore next */
        default:
            return notReachable(keyStore)
    }
}

const hexify = ({
    v,
    s,
    r,
}: {
    v: string
    s: string
    r: string
}): {
    v: string
    s: string
    r: string
} => {
    return {
        v: '0x' + v,
        r: '0x' + r,
        s: '0x' + s,
    }
}
