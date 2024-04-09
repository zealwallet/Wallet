import { FormattedMessage } from 'react-intl'

import { notReachable } from '@zeal/toolkit'

import { ActivityTransaction } from '@zeal/domains/Transactions'

type Props = {
    transaction: ActivityTransaction
}

export const Title = ({ transaction }: Props) => {
    switch (transaction.type) {
        case 'SelfP2PActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.title.self-p2p"
                    defaultMessage="Send to self"
                />
            )
        case 'InboundP2PActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.title.receive"
                    defaultMessage="Receive"
                />
            )
        case 'OutboundP2PActivityTransaction':
        case 'OutboundP2PNftActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.title.send"
                    defaultMessage="Send"
                />
            )
        case 'SingleNftApprovalActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.title.approve-nft"
                    defaultMessage="Approve NFT"
                />
            )
        case 'SingleNftApprovalRevokeActivityTransaction':
        case 'NftCollectionApprovalRevokeActivityTransaction':
        case 'Erc20ApprovalRevokeActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.title.revoke"
                    defaultMessage="Revoke approval"
                />
            )
        case 'NftCollectionApprovalActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.title.approve-nft-collection"
                    defaultMessage="Approve NFT collection"
                />
            )
        case 'Erc20ApprovalActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.title.approve-erc20"
                    defaultMessage="Approve"
                />
            )

        case 'PartialTokenApprovalActivityTransaction':
            return (
                <FormattedMessage
                    id="activity.title.approve-erc20"
                    defaultMessage="Approve"
                />
            )
        case 'UnknownActivityTransaction':
        case 'FailedActivityTransaction':
            return <>{transaction.method}</>
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}
