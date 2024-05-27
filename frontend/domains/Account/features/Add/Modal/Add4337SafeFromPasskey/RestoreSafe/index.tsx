import { FormattedMessage } from 'react-intl'

import Web3 from 'web3'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Avatar } from '@zeal/uikit/Avatar'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { IconButton } from '@zeal/uikit/IconButton'
import { Popup } from '@zeal/uikit/Popup'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { bigint, object, shape, string } from '@zeal/toolkit/Result'

import { AccountsMap } from '@zeal/domains/Account'
import { PASSKEY_4337_SIGNER_FACTORY_PROXY_ADDRESS } from '@zeal/domains/Address/constants'
import { fromString } from '@zeal/domains/Address/helpers/fromString'
import { PasskeySignerNotFoundError } from '@zeal/domains/Error'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { getKeystoreFromPrivateKey } from '@zeal/domains/KeyStore/helpers/getKeystoreFromPrivateKey'
import { getSafe4337Instance } from '@zeal/domains/KeyStore/helpers/getSafe4337Instance'
import { validatePrivateKey } from '@zeal/domains/KeyStore/helpers/validatePrivateKey'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'

import { AddSafeLabel } from './AddSafeLabel'

type Props = {
    encryptedCredentialId: Safe4337['safeDeplymentConfig']['passkeyOwner']['encryptedCredentialId']
    recoveryId: Safe4337['safeDeplymentConfig']['passkeyOwner']['recoveryId']
    networkRPCMap: NetworkRPCMap
    accountsMap: AccountsMap
    network: Network
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | MsgOf<typeof AddSafeLabel>
    | { type: 'on_try_different_passkey_click' }

const PASSKEY_SIGNER_FACTORY_PROXY_ABI_FRAGMENT = {
    inputs: [
        {
            internalType: 'bytes32',
            name: '',
            type: 'bytes32',
        },
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'recoveryData',
    outputs: [
        {
            internalType: 'uint256',
            name: 'x',
            type: 'uint256',
        },
        {
            internalType: 'uint256',
            name: 'y',
            type: 'uint256',
        },
        {
            internalType: 'address',
            name: 'signer',
            type: 'address',
        },
    ],
}

type SignerInfoResult =
    | {
          type: 'found'
          publicKeyInfo: Safe4337['safeDeplymentConfig']['passkeyOwner']['publicKey']
          signerAddress: Safe4337['safeDeplymentConfig']['passkeyOwner']['signerAddress']
      }
    | { type: 'not_found' }

const fetchSignerInfo = async ({
    networkRPCMap,
    network,
    recoveryId,
}: {
    networkRPCMap: NetworkRPCMap
    network: Network
    recoveryId: string
}): Promise<SignerInfoResult> => {
    const web3 = new Web3()

    const rpcResponse = await fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0' as const,
            method: 'eth_call' as const,
            params: [
                {
                    to: PASSKEY_4337_SIGNER_FACTORY_PROXY_ADDRESS,
                    data: web3.eth.abi.encodeFunctionCall(
                        PASSKEY_SIGNER_FACTORY_PROXY_ABI_FRAGMENT,
                        [recoveryId]
                    ),
                },
                'latest',
            ],
        },
    })

    const responseString = string(rpcResponse).getSuccessResultOrThrow(
        'Failed to parse rpc response'
    )

    if (!BigInt(responseString)) {
        return { type: 'not_found' }
    }

    const decoded = web3.eth.abi.decodeParameters(
        ['uint256', 'uint256', 'address'],
        responseString
    )

    return object(decoded)
        .andThen((validObj) =>
            shape({
                signerAddress: string(validObj[2]).andThen(fromString),
                x: bigint(validObj[0]),
                y: bigint(validObj[1]),
            }).map(({ signerAddress, x, y }) => ({
                type: 'found' as const,
                signerAddress,
                publicKeyInfo: {
                    xCoordinate: Hexadecimal.fromBigInt(x),
                    yCoordinate: Hexadecimal.fromBigInt(y),
                },
            }))
        )
        .getSuccessResultOrThrow('Failed to parse signer info')
}

const restoreSafe = async ({
    networkRPCMap,
    network,
    recoveryId,
    sessionPassword,
    encryptedCredentialId,
}: {
    encryptedCredentialId: Safe4337['safeDeplymentConfig']['passkeyOwner']['encryptedCredentialId']
    recoveryId: Safe4337['safeDeplymentConfig']['passkeyOwner']['recoveryId']
    networkRPCMap: NetworkRPCMap
    network: Network
    sessionPassword: string
}): Promise<Safe4337> => {
    const signerInfoResult = await fetchSignerInfo({
        recoveryId,
        networkRPCMap,
        network,
    })

    switch (signerInfoResult.type) {
        case 'not_found':
            throw new PasskeySignerNotFoundError(recoveryId)
        case 'found':
            const passkey: Safe4337['safeDeplymentConfig']['passkeyOwner'] = {
                encryptedCredentialId,
                recoveryId,
                signerAddress: signerInfoResult.signerAddress,
                publicKey: signerInfoResult.publicKeyInfo,
            }

            const safeDeplymentConfig: Safe4337['safeDeplymentConfig'] = {
                passkeyOwner: passkey,
                saltNonce: passkey.signerAddress,
                threshold: 1,
            }

            const safeInstance = await getSafe4337Instance({
                safeDeplymentConfig,
                network,
                networkRPCMap,
            })

            const address = safeInstance.safeAddress

            const localSignerKeyStore = await getKeystoreFromPrivateKey(
                validatePrivateKey(
                    new Web3().eth.accounts.create().privateKey
                ).getSuccessResultOrThrow(
                    'Failed to validate private key when restoring safe'
                ),
                sessionPassword
            )

            return {
                id: uuid(),
                type: 'safe_4337',
                address,
                localSignerKeyStore,
                safeDeplymentConfig,
            }
        /* istanbul ignore next */
        default:
            return notReachable(signerInfoResult)
    }
}

export const RestoreSafe = ({
    onMsg,
    accountsMap,
    networkRPCMap,
    network,
    encryptedCredentialId,
    recoveryId,
    sessionPassword,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(restoreSafe, {
        type: 'loading',
        params: {
            encryptedCredentialId,
            recoveryId,
            sessionPassword,
            network,
            networkRPCMap,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return <LoadingLayout onMsg={onMsg} />
        case 'loaded':
            return (
                <AddSafeLabel
                    keyStore={loadable.data}
                    accountsMap={accountsMap}
                    onMsg={onMsg}
                />
            )
        case 'error':
            const error = parseAppError(loadable.error)

            switch (error.type) {
                case 'passkey_signer_not_found_error':
                    return (
                        <>
                            <LoadingLayout onMsg={onMsg} />
                            <SignerNotFoundPopup onMsg={onMsg} />
                        </>
                    )
                /* istanbul ignore next */
                default:
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
            }
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}

const LoadingLayout = ({ onMsg }: { onMsg: Props['onMsg'] }) => (
    <Screen
        background="light"
        padding="form"
        onNavigateBack={() => onMsg({ type: 'close' })}
    >
        <ActionBar
            left={
                <IconButton
                    variant="on_light"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    {({ color }) => <BackIcon size={24} color={color} />}
                </IconButton>
            }
        />

        <Content>
            <Content.Splash
                onAnimationComplete={null}
                variant="spinner"
                title={
                    <FormattedMessage
                        id="passkey-recovery.recovering.loading-text"
                        defaultMessage="Recovering wallet"
                    />
                }
            />
        </Content>
    </Screen>
)

const SignerNotFoundPopup = ({ onMsg }: { onMsg: Props['onMsg'] }) => (
    <Popup.Layout onMsg={onMsg} background="surfaceDefault">
        <Column spacing={24}>
            <Header
                icon={({ size }) => (
                    <Avatar
                        size={72}
                        variant="round"
                        backgroundColor="backgroundLight"
                    >
                        <BoldDangerTriangle size={size} color="iconDefault" />
                    </Avatar>
                )}
                title={
                    <FormattedMessage
                        id="passkey-recovery.recovering.signer-not-found.title"
                        defaultMessage="No wallet found"
                    />
                }
                subtitle={
                    // TODO :: @Nicvaniek add link to discord
                    <FormattedMessage
                        id="passkey-recovery.recovering.signer-not-found.subtitle"
                        defaultMessage="We couldn’t link your passkey to an active wallet. If you have funds in your wallet, contact the Zeal team for support."
                    />
                }
            />
            <Popup.Actions>
                <Button
                    variant="primary"
                    onClick={() =>
                        onMsg({ type: 'on_try_different_passkey_click' })
                    }
                    size="regular"
                >
                    <FormattedMessage
                        id="passkey-recovery.recovering.signer-not-found.try-with-different-passkey"
                        defaultMessage="Try a different passkey"
                    />
                </Button>
            </Popup.Actions>
        </Column>
    </Popup.Layout>
)
