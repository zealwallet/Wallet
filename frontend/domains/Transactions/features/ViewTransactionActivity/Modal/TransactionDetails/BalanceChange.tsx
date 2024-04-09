import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Divider } from '@zeal/uikit/Divider'
import { Group } from '@zeal/uikit/Group'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { NetworkMap } from '@zeal/domains/Network'
import {
    ActivityTransaction,
    FailedActivityTransaction,
} from '@zeal/domains/Transactions'
import { AssetList } from '@zeal/domains/Transactions/components/AssetList'

type Props = {
    transaction: ActivityTransaction
    networkMap: NetworkMap
}

export const BalanceChange = ({ transaction, networkMap }: Props) => {
    switch (transaction.type) {
        case 'FailedActivityTransaction':
            return null
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
            return (
                <Group variant="default">
                    <Column spacing={12}>
                        <Text
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <Title transaction={transaction} />
                        </Text>
                        <Divider variant="secondary" />
                        <AssetList
                            displayLimit={false}
                            transaction={transaction}
                            networkMap={networkMap}
                        />
                    </Column>
                </Group>
            )
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}

const Title = ({
    transaction,
}: {
    transaction: Exclude<ActivityTransaction, FailedActivityTransaction>
}) => {
    switch (transaction.type) {
        case 'SelfP2PActivityTransaction':
        case 'UnknownActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.detail.balance-change.title.default"
                    defaultMessage="Balance change"
                />
            )
        case 'InboundP2PActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.detail.balance-change.title.received"
                    defaultMessage="Received"
                />
            )
        case 'OutboundP2PActivityTransaction':
        case 'OutboundP2PNftActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.detail.balance-change.title.sent"
                    defaultMessage="Sent"
                />
            )
        case 'Erc20ApprovalActivityTransaction':
        case 'SingleNftApprovalActivityTransaction':
        case 'NftCollectionApprovalActivityTransaction':
        case 'PartialTokenApprovalActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.detail.balance-change.title.approved"
                    defaultMessage="Spend limits approved"
                />
            )
        case 'Erc20ApprovalRevokeActivityTransaction':
        case 'SingleNftApprovalRevokeActivityTransaction':
        case 'NftCollectionApprovalRevokeActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.detail.balance-change.title.revoked"
                    defaultMessage="Spend limits revoked"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}
