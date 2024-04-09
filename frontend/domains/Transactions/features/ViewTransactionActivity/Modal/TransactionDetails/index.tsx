import { FormattedDate } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { ActivityTransaction } from '@zeal/domains/Transactions'
import { Label } from '@zeal/domains/Transactions/components/Label'
import { Subtitle } from '@zeal/domains/Transactions/components/Subtitle'
import { Title } from '@zeal/domains/Transactions/components/Title'

import { BalanceChange } from './BalanceChange'
import { GeneralDetails } from './GeneralDetails'

type Props = {
    transaction: ActivityTransaction
    accountsMap: AccountsMap
    account: Account
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
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

export const TransactionDetails = ({
    transaction,
    networkMap,
    networkRPCMap,
    accountsMap,
    account,
}: Props) => (
    <Column spacing={12}>
        <Column spacing={4}>
            <Text
                ellipsis
                variant="paragraph"
                weight="medium"
                color="textPrimary"
            >
                <Title transaction={transaction} />
            </Text>
            <Row spacing={8}>
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

                <Spacer />

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
        </Column>
        <GeneralDetails
            networkMap={networkMap}
            networkRPCMap={networkRPCMap}
            account={account}
            transaction={transaction}
            accountsMap={accountsMap}
        />
        <BalanceChange transaction={transaction} networkMap={networkMap} />
    </Column>
)
