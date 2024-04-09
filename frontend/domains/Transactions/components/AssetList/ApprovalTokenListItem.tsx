import { FormattedMessage } from 'react-intl'

import { ListItem } from '@zeal/uikit/ListItem'

import { notReachable } from '@zeal/toolkit'

import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import { FormattedTokenBalances2 } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { ApprovalAmount } from '@zeal/domains/Transactions'

export const ApprovalTokenListItem = ({
    approvalAmount,
    networkMap,
}: {
    approvalAmount: ApprovalAmount
    networkMap: NetworkMap
}) => {
    const currency = approvalAmount.amount.currency
    const network = findNetworkByHexChainId(
        currency.networkHexChainId,
        networkMap
    )

    return (
        <ListItem
            aria-current={false}
            size="regular"
            avatar={({ size }) => (
                <Avatar
                    currency={currency}
                    size={size}
                    rightBadge={({ size }) => (
                        <Badge size={size} network={network} />
                    )}
                />
            )}
            primaryText={currency?.symbol}
            side={{
                title: <Allowance approvalAmount={approvalAmount} />,
            }}
        />
    )
}

const Allowance = ({ approvalAmount }: { approvalAmount: ApprovalAmount }) => {
    switch (approvalAmount.type) {
        case 'Limited':
            return <FormattedTokenBalances2 money={approvalAmount.amount} />
        case 'Unlimited':
            return (
                <FormattedMessage
                    id="activity.approval-amount.unlimited"
                    defaultMessage="Unlimited"
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(approvalAmount)
    }
}
