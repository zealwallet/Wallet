import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import type { SendTransactionVariables } from '@wagmi/core/query'
import { Config, useSendTransaction } from 'wagmi'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { numberString } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { format } from '@zeal/domains/Address/helpers/format'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { SubmitedTransactionQueued } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { ExternalWalletAvatar } from '../../components/ExternalWalletAvatar'
import { TopUpRequest } from '../TopUpRequest'

type Props = {
    topUpRequest: TopUpRequest
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_transaction_rejected' }
    | {
          type: 'on_transaction_submitted'
          submittedTransaction: SubmitedTransactionQueued
      }

const fetchLatestNonce = async ({
    address,
    network,
    networkRPCMap,
}: {
    address: Address
    network: Network
    networkRPCMap: NetworkRPCMap
}): Promise<number> =>
    fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_getTransactionCount',
            params: [address, 'latest'],
        },
    }).then((data) =>
        numberString(data).getSuccessResultOrThrow(
            'failed to parse latest nonce when submitting transaction'
        )
    )

const createTransactionConfig = (
    topUpRequest: TopUpRequest
): SendTransactionVariables<Config, number> => ({
    to: topUpRequest.zealAccount.address as `0x${string}`,
    value: topUpRequest.amount.amount,
})

export const SubmitTransaction = ({ topUpRequest, onMsg }: Props) => {
    const { sendTransactionAsync } = useSendTransaction()

    const sendTransaction = async (
        config: SendTransactionVariables<Config, number>
    ): Promise<{ transactionHash: string; submittedNonce: number }> => {
        const nonce = await fetchLatestNonce({
            address: topUpRequest.fromAccount.address,
            network: topUpRequest.network,
            networkRPCMap: {},
        })

        const transactionHash = await sendTransactionAsync({
            ...config,
            nonce,
        })

        return { transactionHash, submittedNonce: nonce }
    }

    const [loadable] = useLoadableData(sendTransaction, {
        type: 'loading',
        params: createTransactionConfig(topUpRequest),
    })

    const onMsgLive = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
                break
            case 'loaded':
                postUserEvent({
                    type: 'TopUpTransactionSubmittedEvent',
                    network: topUpRequest.network.hexChainId,
                    installationId: 'dapp-no-installation-id',
                })

                onMsgLive.current({
                    type: 'on_transaction_submitted',
                    submittedTransaction: {
                        state: 'queued',
                        queuedAt: Date.now(),
                        hash: loadable.data.transactionHash,
                        submittedNonce: loadable.data.submittedNonce,
                    },
                })
                break
            case 'error':
                // TODO: Analytics to see how often this happens. Might need to parse errors
                onMsgLive.current({
                    type: 'on_transaction_rejected',
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable, onMsgLive, topUpRequest.network.hexChainId])

    return (
        <Screen padding="form" background="light">
            <UIActionBar
                left={
                    <Row spacing={8}>
                        <ExternalWalletAvatar
                            fromAccount={topUpRequest.fromAccount}
                            size={24}
                        />

                        <Text
                            variant="paragraph"
                            weight="medium"
                            color="textSecondary"
                        >
                            {format(topUpRequest.fromAccount.address)}
                        </Text>
                    </Row>
                }
            />
            <Column spacing={12} fill>
                <Content
                    header={
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="topup.addFundsToZeal"
                                    defaultMessage="Add funds to Zeal"
                                />
                            }
                        />
                    }
                >
                    <Content.Splash
                        onAnimationComplete={null}
                        variant="spinner"
                        title={
                            <FormattedMessage
                                id="topup.continue-in-wallet"
                                defaultMessage="Continue in your wallet"
                            />
                        }
                    />
                </Content>

                <Actions>
                    <Button
                        variant="secondary"
                        size="regular"
                        onClick={() => {
                            onMsg({ type: 'close' })
                        }}
                    >
                        <FormattedMessage
                            id="topup.submit-transaction.close"
                            defaultMessage="Close"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}
