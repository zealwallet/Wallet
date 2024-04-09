import { FormattedDate } from 'react-intl'

import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { Divider } from '@zeal/uikit/Divider'
import { Group } from '@zeal/uikit/Group'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { NetworkMap } from '@zeal/domains/Network'
import { ActivityTransaction } from '@zeal/domains/Transactions'

import { AssetList } from '../AssetList'
import { Label } from '../Label'
import { Subtitle } from '../Subtitle'
import { Title } from '../Title'

type Props = {
    transaction: ActivityTransaction
    accountsMap: AccountsMap
    account: Account
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_activity_transaction_click'
    transaction: ActivityTransaction
}

const getTextColour = (
    transaction: ActivityTransaction
): 'textSecondary' | 'textStatusCriticalOnColor' => {
    switch (transaction.type) {
        case 'SelfP2PActivityTransaction':
        case 'InboundP2PActivityTransaction':
        case 'OutboundP2PActivityTransaction':
        case 'OutboundP2PNftActivityTransaction':
        case 'SingleNftApprovalActivityTransaction':
        case 'SingleNftApprovalRevokeActivityTransaction':
        case 'NftCollectionApprovalActivityTransaction':
        case 'NftCollectionApprovalRevokeActivityTransaction':
        case 'Erc20ApprovalActivityTransaction':
        case 'Erc20ApprovalRevokeActivityTransaction':
        case 'PartialTokenApprovalActivityTransaction':
        case 'UnknownActivityTransaction':
            return 'textSecondary'
        case 'FailedActivityTransaction':
            return 'textStatusCriticalOnColor'
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}

export const ListItem = ({
    transaction,
    account,
    accountsMap,
    networkMap,
    onMsg,
}: Props) => {
    return (
        <Clickable
            onClick={() =>
                onMsg({
                    type: 'on_activity_transaction_click',
                    transaction,
                })
            }
        >
            <Group
                variant="default"
                aria-labelledby={`title-${transaction.hash}`}
            >
                <Column spacing={12}>
                    <Column spacing={4}>
                        <Text
                            id={`title-${transaction.hash}`}
                            ellipsis
                            variant="paragraph"
                            weight="medium"
                            color="textPrimary"
                        >
                            <Title transaction={transaction} />
                        </Text>
                        <Row spacing={8} alignX="stretch">
                            <Text
                                variant="footnote"
                                ellipsis
                                weight="regular"
                                color="textSecondary"
                            >
                                <Subtitle
                                    transaction={transaction}
                                    accountsMap={accountsMap}
                                    account={account}
                                />
                            </Text>

                            <Row spacing={8}>
                                <Label transaction={transaction} />
                                <Text
                                    variant="footnote"
                                    weight="regular"
                                    color={getTextColour(transaction)}
                                >
                                    <FormattedDate
                                        value={transaction.timestamp}
                                        month="short"
                                        day="2-digit"
                                        hour="2-digit"
                                        minute="2-digit"
                                        hour12={false}
                                    />
                                </Text>
                            </Row>
                        </Row>
                    </Column>
                    <Divider variant="secondary" />
                    <AssetList
                        displayLimit
                        transaction={transaction}
                        networkMap={networkMap}
                    />
                </Column>
            </Group>
        </Clickable>
    )
}
