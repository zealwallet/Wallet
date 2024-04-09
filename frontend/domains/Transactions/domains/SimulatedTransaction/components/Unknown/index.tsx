import { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { GroupHeader } from '@zeal/uikit/Group'
import { Group, Section } from '@zeal/uikit/Group'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { NetworkMap } from '@zeal/domains/Network'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { TransactionNft } from '@zeal/domains/Transactions'
import {
    UnknownTransaction,
    UnknownTransactionToken,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction'

import { Nft } from './Nft'
import { Token } from './Token'

type Props = {
    transaction: UnknownTransaction
    knownCurrencies: KnownCurrencies
    checks: TransactionSafetyCheck[]
    networkMap: NetworkMap
}

type GroupedTokens = {
    send: UnknownTransactionToken[]
    receive: UnknownTransactionToken[]
}

type GroupedNfts = {
    sendNft: TransactionNft[]
    receiveNft: TransactionNft[]
}

export const Unknown = ({
    transaction,
    knownCurrencies,
    checks,
    networkMap,
}: Props) => {
    const { send, receive } = useMemo(() => {
        return transaction.tokens.reduce<GroupedTokens>(
            (group, item) => {
                switch (item.direction) {
                    case 'Receive':
                        group.receive.push(item)
                        return group

                    case 'Send':
                        group.send.push(item)
                        return group

                    /* istanbul ignore next */
                    default:
                        return notReachable(item.direction)
                }
            },
            { send: [], receive: [] }
        )
    }, [transaction.tokens])

    const { sendNft, receiveNft } = useMemo(() => {
        return transaction.nfts.reduce<GroupedNfts>(
            (group, item) => {
                switch (item.direction) {
                    case 'Receive':
                        group.receiveNft.push(item)
                        return group

                    case 'Send':
                        group.sendNft.push(item)
                        return group

                    /* istanbul ignore next */
                    default:
                        return notReachable(item.direction)
                }
            },
            { sendNft: [], receiveNft: [] }
        )
    }, [transaction.nfts])

    return (
        <Column spacing={20}>
            {(send.length > 0 || sendNft.length > 0) && (
                <Section aria-labelledby="send-section-label">
                    <GroupHeader
                        left={({ color, textVariant, textWeight }) => (
                            <Text
                                id="send-section-label"
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedMessage
                                    id="simulatedTransaction.unknown.info.send"
                                    defaultMessage="Send"
                                />
                            </Text>
                        )}
                        right={null}
                    />
                    <Group variant="compressed">
                        {send.map((item) => (
                            <Token
                                networkMap={networkMap}
                                safetyChecks={checks}
                                key={item.amount.currencyId}
                                knownCurrencies={knownCurrencies}
                                token={item}
                            />
                        ))}

                        {sendNft.map((item) => (
                            <Nft
                                networkMap={networkMap}
                                checks={checks}
                                key={item.nft.tokenId}
                                transactionNft={item}
                            />
                        ))}
                    </Group>
                </Section>
            )}
            {(receive.length > 0 || receiveNft.length > 0) && (
                <Section aria-labelledby="receive-section-label">
                    <GroupHeader
                        left={({ color, textVariant, textWeight }) => (
                            <Text
                                id="receive-section-label"
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedMessage
                                    id="simulatedTransaction.unknown.info.receive"
                                    defaultMessage="Receive"
                                />
                            </Text>
                        )}
                        right={null}
                    />
                    <Group variant="compressed">
                        {receive.map((item) => (
                            <Token
                                networkMap={networkMap}
                                safetyChecks={checks}
                                key={item.amount.currencyId}
                                knownCurrencies={knownCurrencies}
                                token={item}
                            />
                        ))}

                        {receiveNft.map((item) => (
                            <Nft
                                networkMap={networkMap}
                                checks={checks}
                                key={item.nft.tokenId}
                                transactionNft={item}
                            />
                        ))}
                    </Group>
                </Section>
            )}
        </Column>
    )
}
