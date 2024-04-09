import { useEffect } from 'react'

import Web3 from 'web3'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { Hexadecimal } from '@zeal/toolkit/Hexadecimal'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { ImperativeError } from '@zeal/domains/Error'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { saveSafeKeyStore } from '@zeal/domains/KeyStore/api/saveSafeKeyStore'
import { getKeystoreFromPrivateKey } from '@zeal/domains/KeyStore/helpers/getKeystoreFromPrivateKey'
import { getSafe4337Instance } from '@zeal/domains/KeyStore/helpers/getSafe4337Instance'
import { validatePrivateKey } from '@zeal/domains/KeyStore/helpers/validatePrivateKey'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import {
    InitialUserOperation,
    MetaTransactionData,
    OperationType,
    UserOperationWithoutSignature,
} from '@zeal/domains/UserOperation'
import { fetchSponsorshipPaymasterAndData } from '@zeal/domains/UserOperation/api/fetchPaymasterAndData'
import {
    DUMMY_PASSKEY_SIGNATURE,
    PASSKEY_SIGNATURE_VERIFICATION_GAS_LIMIT_BUFFER,
} from '@zeal/domains/UserOperation/constants'
import { calculateGasEstimates } from '@zeal/domains/UserOperation/helpers/calculateGasEstimates'
import { metaTransactionDatasToUserOperationCallData } from '@zeal/domains/UserOperation/helpers/metaTransactionDatasToUserOperationCallData'

import { LoadingLayout } from './LoadingLayout'

type Props = {
    network: Network
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    passkey: Safe4337['safeDeplymentConfig']['passkeyOwner']
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_user_operation_constructed'
          userOperationWithoutSignature: UserOperationWithoutSignature
          keyStore: Safe4337
      }

const SAFE_ADD_OWNER_WITH_THRESHOLD_ABI_FRAGMENT = {
    inputs: [
        {
            internalType: 'address',
            name: 'owner',
            type: 'address',
        },
        {
            internalType: 'uint256',
            name: '_threshold',
            type: 'uint256',
        },
    ],
    name: 'addOwnerWithThreshold',
    outputs: [],
    stateMutability: 'nonpayable' as const,
    type: 'function' as const,
}

const fetch = async ({
    network,
    networkRPCMap,
    passkey,
    sessionPassword,
    signal,
}: {
    network: Network
    networkRPCMap: NetworkRPCMap
    passkey: Safe4337['safeDeplymentConfig']['passkeyOwner']
    sessionPassword: string
    signal?: AbortSignal
}): Promise<{
    userOperationWithoutSignature: UserOperationWithoutSignature
    keyStore: Safe4337
}> => {
    const safeDeplymentConfig = {
        passkeyOwner: passkey,
        saltNonce: passkey.signerAddress,
        threshold: 1,
    }
    const safeInstance = await getSafe4337Instance({
        network,
        networkRPCMap,
        safeDeplymentConfig,
    })

    switch (safeInstance.type) {
        case 'deployed':
            throw new ImperativeError('Predicted safe is already deployed', {
                signerAddress: passkey.signerAddress,
                x: passkey.publicKey.xCoordinate,
                y: passkey.publicKey.yCoordinate,
                recoveryId: passkey.recoveryId,
            })
        case 'not_deployed': {
            const localSignerKeyStore = await getKeystoreFromPrivateKey(
                validatePrivateKey(
                    new Web3().eth.accounts.create().privateKey
                ).getSuccessResultOrThrow(
                    'Failed to validate private key when creating safe'
                ),
                sessionPassword
            )

            const addOwnerMetaTransactionData: MetaTransactionData = {
                to: safeInstance.safeAddress as Hexadecimal,
                value: '0',
                data: new Web3().eth.abi.encodeFunctionCall(
                    SAFE_ADD_OWNER_WITH_THRESHOLD_ABI_FRAGMENT,
                    [localSignerKeyStore.address, 1]
                ) as Hexadecimal,
                operation: OperationType.Call,
            }

            const initialUserOperation: InitialUserOperation = {
                type: 'initial_user_operation',
                sender: safeInstance.safeAddress,
                nonce: 0n,
                entrypoint: safeInstance.entrypoint,
                initCode: safeInstance.deploymentInitCode,
                callData: metaTransactionDatasToUserOperationCallData({
                    metaTransactionDatas: [addOwnerMetaTransactionData],
                }),
            }

            const { sponsorPaymasterWithApprovalGasEstimate, gasPrice } =
                await calculateGasEstimates({
                    network,
                    networkRPCMap,
                    initialUserOperation,
                    verificationGasLimitBuffer:
                        PASSKEY_SIGNATURE_VERIFICATION_GAS_LIMIT_BUFFER,
                    dummySignature: DUMMY_PASSKEY_SIGNATURE,
                    metaTransactionDatas: [addOwnerMetaTransactionData],
                })

            const paymasterAndData = await fetchSponsorshipPaymasterAndData({
                network,
                signal,
                initialUserOperation,
                bundlerGasPrice: gasPrice,
                gasEstimate: sponsorPaymasterWithApprovalGasEstimate,
                dummySignature: DUMMY_PASSKEY_SIGNATURE,
            })

            const createdKeyStore: Safe4337 = {
                type: 'safe_4337',
                id: uuid(),
                address: safeInstance.safeAddress,
                localSignerKeyStore,
                safeDeplymentConfig,
            }

            await saveSafeKeyStore({ signal, keystore: createdKeyStore })

            return {
                keyStore: createdKeyStore,
                userOperationWithoutSignature: {
                    type: 'user_operation_without_signature',
                    sender: initialUserOperation.sender,
                    nonce: initialUserOperation.nonce,
                    entrypoint: initialUserOperation.entrypoint,
                    callData: initialUserOperation.callData,
                    initCode: initialUserOperation.initCode,
                    maxFeePerGas: gasPrice.maxFeePerGas,
                    maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas,
                    callGasLimit:
                        sponsorPaymasterWithApprovalGasEstimate.callGasLimit,
                    preVerificationGas:
                        sponsorPaymasterWithApprovalGasEstimate.preVerificationGas,
                    verificationGasLimit:
                        sponsorPaymasterWithApprovalGasEstimate.verificationGasLimit,
                    paymasterAndData,
                },
            }
        }
        /* istanbul ignore next */
        default:
            return notReachable(safeInstance)
    }
}

export const ConstructUserOperation = ({
    network,
    networkRPCMap,
    passkey,
    sessionPassword,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetch, {
        type: 'loading',
        params: {
            network,
            networkRPCMap,
            passkey,
            sessionPassword,
        },
    })

    const onMsgLive = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
                break
            case 'loaded':
                onMsgLive.current({
                    type: 'on_user_operation_constructed',
                    userOperationWithoutSignature:
                        loadable.data.userOperationWithoutSignature,
                    keyStore: loadable.data.keyStore,
                })
                break
            case 'error':
                captureError(loadable.error)
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable, onMsgLive])

    switch (loadable.type) {
        case 'loading':
        case 'loaded':
            return <LoadingLayout onMsg={onMsg} />
        case 'error':
            const error = parseAppError(loadable.error)

            return (
                <>
                    <LoadingLayout onMsg={onMsg} />
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
                                    return notReachable(msg)
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
