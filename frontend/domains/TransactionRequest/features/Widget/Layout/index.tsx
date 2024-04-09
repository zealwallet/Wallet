import { useState } from 'react'
import { Pressable } from 'react-native'

import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { useCurrentTimestamp } from '@zeal/toolkit/Date/useCurrentTimestamp'

import { AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { Submited } from '@zeal/domains/TransactionRequest'

import { Avatar } from './Avatar'
import { Label } from './Label'
import { Progress } from './Progress'
import { Subtitle } from './Subtitle'
import { Timing } from './Timing'
import { Title } from './Title'

type Props = {
    transactionRequest: Submited
    networkMap: NetworkMap
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_transaction_request_widget_click'
    transactionRequest: Submited
    keyStore: SigningKeyStore
}

export const Layout = ({
    transactionRequest,
    networkMap,
    keyStoreMap,
    onMsg,
    accountsMap,
}: Props) => {
    const { account } = transactionRequest
    const keyStore = getKeyStore({ address: account.address, keyStoreMap })

    switch (keyStore.type) {
        case 'track_only':
            return (
                <WidgetLayout
                    transactionRequest={transactionRequest}
                    networkMap={networkMap}
                    accountsMap={accountsMap}
                />
            )
        case 'private_key_store':
        case 'ledger':
        case 'secret_phrase_key':
        case 'trezor':
        case 'safe_4337':
            return (
                <Pressable
                    onPress={() =>
                        onMsg({
                            type: 'on_transaction_request_widget_click',
                            transactionRequest,
                            keyStore,
                        })
                    }
                >
                    <WidgetLayout
                        transactionRequest={transactionRequest}
                        networkMap={networkMap}
                        accountsMap={accountsMap}
                    />
                </Pressable>
            )
        /* istanbul ignore next */
        default:
            return notReachable(keyStore)
    }
}

const WidgetLayout = ({
    transactionRequest,
    networkMap,
    accountsMap,
}: {
    transactionRequest: Submited
    networkMap: NetworkMap
    accountsMap: AccountsMap
}) => {
    const [labelId] = useState(uuid())
    const nowTimestampMs = useCurrentTimestamp({ refreshIntervalMs: 1000 })
    const network = findNetworkByHexChainId(
        transactionRequest.networkHexId,
        networkMap
    )
    const { submitedTransaction, simulation } = transactionRequest

    return (
        <Group variant="default" aria-labelledby={labelId}>
            <Column spacing={12}>
                <Row spacing={12}>
                    <Avatar
                        network={network}
                        simulatedTransaction={simulation}
                    />

                    <Column spacing={4} shrink>
                        <Text
                            id={labelId}
                            ellipsis
                            variant="paragraph"
                            weight="medium"
                            color="textPrimary"
                        >
                            <Title simulationResult={simulation} />
                        </Text>

                        <Row spacing={8}>
                            <Text
                                variant="footnote"
                                ellipsis
                                weight="regular"
                                color="textSecondary"
                            >
                                <Subtitle
                                    transactionRequest={transactionRequest}
                                    accountsMap={accountsMap}
                                />
                            </Text>

                            <Spacer />

                            <Label
                                submitedTransaction={submitedTransaction}
                                network={network}
                            />
                            <Timing
                                nowTimestampMs={nowTimestampMs}
                                submittedTransaction={submitedTransaction}
                            />
                        </Row>
                    </Column>
                </Row>

                <Progress submitedTransaction={submitedTransaction} />
            </Column>
        </Group>
    )
}
