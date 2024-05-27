import { useEffect, useState } from 'react'
import {
    FormatDateOptions,
    FormattedMessage,
    MessageDescriptor,
    useIntl,
} from 'react-intl'
import { SectionListData } from 'react-native'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Group, GroupHeader } from '@zeal/uikit/Group'
import { CreditCardSolidOnCircle } from '@zeal/uikit/Icon/CreditCardSolidOnCircle'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { SectionList } from '@zeal/uikit/SectionList'
import { Text } from '@zeal/uikit/Text'

import { uuid } from '@zeal/toolkit/Crypto'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { format as formatAddress } from '@zeal/domains/Address/helpers/format'
import {
    CardTransaction,
    GnosisPayAccountOnboardedState,
} from '@zeal/domains/Card'
import { CardWidget, Side } from '@zeal/domains/Card/components/CardWidget'
import { TransactionListItem } from '@zeal/domains/Card/components/TransactionListItem'
import { fetchServerPortfolio } from '@zeal/domains/Portfolio/api/fetchPortfolio'

import { Actions } from './Actions'

type Props = {
    account: Account
    side: Side
    installationId: string
    gnosisPayAccountOnboardedState: GnosisPayAccountOnboardedState
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof CardWidget> | MsgOf<typeof Actions>

export const Layout = ({
    account,
    installationId,
    gnosisPayAccountOnboardedState,
    side,
    onMsg,
}: Props) => {
    const [sectionId] = useState(uuid())
    const { formatMessage, formatDate } = useIntl()
    const transactions = gnosisPayAccountOnboardedState.transactions
    const grouped = group(transactions, formatMessage, formatDate)

    const sections: SectionListData<CardTransaction>[] = Array.from(
        grouped.entries()
    ).map(([groupKey, transactionsList], idx) => ({
        title: groupKey,
        key: `s-${idx}-${sectionId}`,
        data: transactionsList,
    }))

    useEffect(() => {
        // Needed for card safe address to be indexed on BE for push notifications
        fetchServerPortfolio({
            address: gnosisPayAccountOnboardedState.card.safeAddress,
            forceRefresh: false,
        })
    }, [gnosisPayAccountOnboardedState])

    return (
        <Screen
            padding="controller_tabs_fullscreen_scroll"
            background="light"
            onNavigateBack={null}
        >
            <UIActionBar
                left={
                    <Row spacing={8}>
                        <AccountAvatar size={24} account={account} />
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                            ellipsis
                        >
                            {account.label}
                        </Text>

                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                        >
                            {formatAddress(account.address)}
                        </Text>
                    </Row>
                }
            />
            <Column spacing={8} shrink fill>
                <CardWidget
                    side={side}
                    card={gnosisPayAccountOnboardedState.card}
                    onMsg={onMsg}
                />

                <Actions installationId={installationId} onMsg={onMsg} />

                <Group variant="default">
                    <SectionList
                        variant="default"
                        sections={sections}
                        itemSpacing={12}
                        sectionSpacing={12}
                        renderSectionHeader={({ section: { title, key } }) => (
                            <GroupHeader
                                right={null}
                                left={({ color, textVariant, textWeight }) => (
                                    <Text
                                        id={key}
                                        color={color}
                                        variant={textVariant}
                                        weight={textWeight}
                                    >
                                        {title}
                                    </Text>
                                )}
                            />
                        )}
                        emptyState={
                            <>
                                <GroupHeader
                                    left={({
                                        color,
                                        textVariant,
                                        textWeight,
                                    }) => (
                                        <Text
                                            color={color}
                                            variant={textVariant}
                                            weight={textWeight}
                                        >
                                            <FormattedMessage
                                                id="card.onboarded.transactions.empty.title"
                                                defaultMessage="Activity"
                                            />
                                        </Text>
                                    )}
                                    right={null}
                                />
                                <EmptyStateWidget
                                    size="regular"
                                    icon={({ size }) => (
                                        <CreditCardSolidOnCircle
                                            size={size}
                                            color="darkActionSecondaryDefault"
                                        />
                                    )}
                                    title={
                                        <FormattedMessage
                                            id="card.onboarded.transactions.empty.description"
                                            defaultMessage="Your payment activity will appear here"
                                        />
                                    }
                                />
                            </>
                        }
                        renderItem={({ item }) => (
                            <TransactionListItem
                                key={item.createdAt}
                                transaction={item}
                            />
                        )}
                    />
                </Group>
            </Column>
        </Screen>
    )
}

const group = (
    transactions: CardTransaction[],
    formatMessage: (x: MessageDescriptor) => string,
    formatDate: (x: Date, y: FormatDateOptions) => string
): Map<string, CardTransaction[]> => {
    return transactions.reduce((memo, currentValue) => {
        const key = getGroupLabel(
            new Date(currentValue.createdAt),
            formatMessage,
            formatDate
        )
        const values = memo.get(key) || []
        values.push(currentValue)
        memo.set(key, values)
        return memo
    }, new Map<string, CardTransaction[]>())
}

const getGroupLabel = (
    transactionDate: Date,
    formatMessage: (x: MessageDescriptor) => string,
    formatDate: (x: Date, y: FormatDateOptions) => string
): string => {
    const todayMidnight = new Date()
    todayMidnight.setHours(0, 0, 0, 0)

    const startOfWeek = new Date(todayMidnight)
    startOfWeek.setDate(todayMidnight.getDate() - todayMidnight.getDay() + 1)

    const startOfMonth = new Date(
        todayMidnight.getFullYear(),
        todayMidnight.getMonth(),
        1
    )

    const todayLabel = formatMessage({
        id: 'card.transactions.labels.today',
        defaultMessage: 'Today',
    })
    const thisWeekLabel = formatMessage({
        id: 'card.transactions.labels.this-week',
        defaultMessage: 'This week',
    })
    const thisMonthLabel = formatMessage({
        id: 'card.transactions.labels.this-month',
        defaultMessage: 'This month',
    })

    return transactionDate.getTime() >= todayMidnight.getTime()
        ? todayLabel
        : transactionDate.getTime() >= startOfWeek.getTime()
        ? thisWeekLabel
        : transactionDate.getTime() >= startOfMonth.getTime()
        ? thisMonthLabel
        : formatDate(transactionDate, {
              month: 'short',
              year: 'numeric',
              day: '2-digit',
          })
}
