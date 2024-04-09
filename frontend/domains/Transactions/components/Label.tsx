import { FormattedMessage } from 'react-intl'

import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { FormattedFeeInDefaultCurrency2 } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import { TruncatedFeeInNativeTokenCurrency2 } from '@zeal/domains/Money/components/TruncatedFeeInNativeTokenCurrency'
import { ActivityTransaction } from '@zeal/domains/Transactions'

type Props = {
    transaction: ActivityTransaction
}

export const Label = ({ transaction }: Props) => {
    switch (transaction.type) {
        case 'InboundP2PActivityTransaction':
            return null
        case 'FailedActivityTransaction':
            return (
                <Text
                    variant="footnote"
                    ellipsis
                    weight="regular"
                    color="textStatusCriticalOnColor"
                >
                    <FormattedMessage
                        id="activity.failed-transaction.label"
                        defaultMessage="Failed"
                    />
                </Text>
            )
        case 'SelfP2PActivityTransaction':
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
            return transaction.paidFee ? (
                transaction.paidFee.priceInDefaultCurrency ? (
                    <Text
                        variant="footnote"
                        ellipsis
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedFeeInDefaultCurrency2
                            money={transaction.paidFee.priceInDefaultCurrency}
                        />
                    </Text>
                ) : (
                    <Text
                        variant="footnote"
                        ellipsis
                        weight="regular"
                        color="textSecondary"
                    >
                        <TruncatedFeeInNativeTokenCurrency2
                            money={transaction.paidFee.priceInNativeCurrency}
                        />
                    </Text>
                )
            ) : null
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}
