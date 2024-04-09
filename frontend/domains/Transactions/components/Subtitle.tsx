import { FormattedMessage } from 'react-intl'

import { notReachable } from '@zeal/toolkit'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { format } from '@zeal/domains/Address/helpers/format'
import { ActivityTransaction } from '@zeal/domains/Transactions'

type Props = {
    transaction: ActivityTransaction
    accountsMap: AccountsMap
    account: Account
}

export const Subtitle = ({ transaction, accountsMap, account }: Props) => {
    switch (transaction.type) {
        case 'SelfP2PActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.self-p2p.subtitle"
                    defaultMessage="To {target}"
                    values={{
                        target: account.label,
                    }}
                />
            )
        case 'InboundP2PActivityTransaction': {
            const senderAccount: Account | null =
                accountsMap[transaction.sender]
            return (
                <FormattedMessage
                    id="activity.inbound-p2p.subtitle"
                    defaultMessage="From {target}"
                    values={{
                        target: senderAccount
                            ? senderAccount.label
                            : format(transaction.sender),
                    }}
                />
            )
        }
        case 'OutboundP2PNftActivityTransaction':
        case 'OutboundP2PActivityTransaction': {
            const receiverAccount: Account | null =
                accountsMap[transaction.receiver]
            return (
                <FormattedMessage
                    id="activity.outbound.subtitle"
                    defaultMessage="To {target}"
                    values={{
                        target: receiverAccount
                            ? receiverAccount.label
                            : format(transaction.receiver),
                    }}
                />
            )
        }
        case 'NftCollectionApprovalActivityTransaction':
        case 'Erc20ApprovalActivityTransaction':
        case 'PartialTokenApprovalActivityTransaction':
        case 'SingleNftApprovalActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.approval.subtitle"
                    defaultMessage="For {target}"
                    values={{
                        target:
                            transaction.approveTo.name ??
                            format(transaction.approveTo.address),
                    }}
                />
            )
        case 'SingleNftApprovalRevokeActivityTransaction':
        case 'Erc20ApprovalRevokeActivityTransaction':
        case 'NftCollectionApprovalRevokeActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.revoke.subtitle"
                    defaultMessage="From {target}"
                    values={{
                        target:
                            transaction.revokeFrom.name ??
                            format(transaction.revokeFrom.address),
                    }}
                />
            )
        case 'FailedActivityTransaction':
        case 'UnknownActivityTransaction': {
            const { name, website, address } = transaction.smartContract
            return (
                <FormattedMessage
                    id="transactionRequestWidget.unknown.subtitle"
                    defaultMessage="Using {target}"
                    values={{
                        target: name || website || format(address),
                    }}
                />
            )
        }
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}
