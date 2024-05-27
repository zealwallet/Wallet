import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Tokens } from '@zeal/uikit/Icon/Empty'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { SpamFolder } from '@zeal/uikit/Icon/SpamFolder'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'
import { TextButton } from '@zeal/uikit/TextButton'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { openExternalURL } from '@zeal/toolkit/Window'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActionBarAccountSelector } from '@zeal/domains/Account/components/ActionBarAccountSelector'
import { Address } from '@zeal/domains/Address'
import {
    BridgeSubmitted,
    SubmitedBridgesMap,
} from '@zeal/domains/Currency/domains/Bridge'
import { BridgeWidget } from '@zeal/domains/Currency/features/BridgeWidget'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    CustomNetwork,
    NetworkMap,
    NetworkRPCMap,
    TestNetwork,
} from '@zeal/domains/Network'
import { NetworkSelector } from '@zeal/domains/Network/components/NetworkSelector'
import { Submited } from '@zeal/domains/TransactionRequest'
import { List as TransactionRequestList } from '@zeal/domains/TransactionRequest/features/List'
import { TransactionList } from '@zeal/domains/Transactions/components/TransactionList'

type Props = {
    transactionRequests: Record<Address, Submited[]>
    networkMap: NetworkMap
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    account: Account
    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    submitedBridgesMap: SubmitedBridgesMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | {
          type:
              | 'network_filter_click'
              | 'on_hidden_activity_icon_click'
              | 'on_account_selector_click'
      }
    | MsgOf<typeof TransactionRequestList>
    | MsgOf<typeof BridgeWidget>
    | MsgOf<typeof TransactionList>

export const Layout = ({
    account,
    selectedNetwork,
    networkRPCMap,
    transactionRequests,
    accountsMap,
    keyStoreMap,
    onMsg,
    submitedBridgesMap,
    networkMap,
}: Props) => {
    // Capture array so it won't change only after remount
    const [cachedTransactionRequests] = useState<Submited[]>(
        transactionRequests[account.address] || []
    )
    const [bridges] = useState<BridgeSubmitted[]>(
        submitedBridgesMap[account.address] || []
    )

    return (
        <Screen
            padding="controller_tabs_fullscreen_scroll"
            background="light"
            onNavigateBack={null}
        >
            <ActionBar
                top={
                    <ActionBarAccountSelector
                        account={account}
                        onMsg={() => {
                            onMsg({ type: 'on_account_selector_click' })
                        }}
                    />
                }
                left={
                    <Text variant="title3" weight="medium" color="textPrimary">
                        <FormattedMessage
                            id="transactions.page.title"
                            defaultMessage="Activity"
                        />
                    </Text>
                }
                right={
                    <Row spacing={0}>
                        {(() => {
                            switch (selectedNetwork.type) {
                                case 'all_networks':
                                    return (
                                        <IconButton
                                            variant="on_light"
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_hidden_activity_icon_click',
                                                })
                                            }
                                        >
                                            {({ color }) => (
                                                <SpamFolder
                                                    size={24}
                                                    color={color}
                                                />
                                            )}
                                        </IconButton>
                                    )
                                case 'specific_network':
                                    const net = selectedNetwork.network
                                    switch (net.type) {
                                        case 'predefined':
                                            return (
                                                <IconButton
                                                    variant="on_light"
                                                    onClick={() =>
                                                        onMsg({
                                                            type: 'on_hidden_activity_icon_click',
                                                        })
                                                    }
                                                >
                                                    {({ color }) => (
                                                        <SpamFolder
                                                            size={24}
                                                            color={color}
                                                        />
                                                    )}
                                                </IconButton>
                                            )

                                        case 'custom':
                                        case 'testnet':
                                            return null

                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(net)
                                    }
                                /* istanbul ignore next */
                                default:
                                    return notReachable(selectedNetwork)
                            }
                        })()}

                        <NetworkSelector
                            variant="on_light"
                            currentNetwork={selectedNetwork}
                            size={24}
                            onClick={() => {
                                onMsg({ type: 'network_filter_click' })
                            }}
                        />
                    </Row>
                }
            />
            <Column spacing={12} shrink fill>
                {bridges.length > 0 && (
                    <Column spacing={8}>
                        {bridges.map((bridge) => (
                            <BridgeWidget
                                key={bridge.sourceTransactionHash}
                                bridgeSubmitted={bridge}
                                onMsg={onMsg}
                            />
                        ))}
                    </Column>
                )}

                {cachedTransactionRequests.length > 0 && (
                    <TransactionRequestList
                        accountsMap={accountsMap}
                        keyStoreMap={keyStoreMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        transactionRequests={cachedTransactionRequests}
                        onMsg={onMsg}
                    />
                )}

                {(() => {
                    switch (selectedNetwork.type) {
                        case 'all_networks':
                            return (
                                <TransactionList
                                    scam={false}
                                    onMsg={onMsg}
                                    account={account}
                                    accountsMap={accountsMap}
                                    networkMap={networkMap}
                                    selectedNetwork={selectedNetwork}
                                />
                            )
                        case 'specific_network':
                            const net = selectedNetwork.network
                            switch (net.type) {
                                case 'predefined':
                                    return (
                                        <TransactionList
                                            scam={false}
                                            onMsg={onMsg}
                                            account={account}
                                            accountsMap={accountsMap}
                                            networkMap={networkMap}
                                            selectedNetwork={selectedNetwork}
                                        />
                                    )

                                case 'custom':
                                case 'testnet':
                                    return <TestNetworkStub testNetwork={net} />

                                /* istanbul ignore next */
                                default:
                                    return notReachable(net)
                            }
                        /* istanbul ignore next */
                        default:
                            return notReachable(selectedNetwork)
                    }
                })()}
            </Column>
        </Screen>
    )
}

const TestNetworkStub = ({
    testNetwork,
}: {
    testNetwork: TestNetwork | CustomNetwork
}) => (
    <EmptyStateWidget
        size="regular"
        icon={({ size }) => <Tokens size={size} color="backgroundLight" />}
        title={
            !testNetwork.blockExplorerUrl ? (
                <FormattedMessage
                    id="transactions.viewTRXHistory.noTxHistoryForTestNets"
                    defaultMessage="Activity not supported for testnets"
                />
            ) : (
                <FormattedMessage
                    id="transactions.viewTRXHistory.noTxHistoryForTestNetsWithLink"
                    defaultMessage="Activity not supported for testnets{br}<link>Go to block explorer</link>"
                    values={{
                        br: '\n',
                        link: (msg) => (
                            <TextButton
                                onClick={() =>
                                    openExternalURL(
                                        testNetwork.blockExplorerUrl!
                                    )
                                }
                            >
                                {msg}
                                <ExternalLink size={14} />
                            </TextButton>
                        ),
                    }}
                />
            )
        }
    />
)
