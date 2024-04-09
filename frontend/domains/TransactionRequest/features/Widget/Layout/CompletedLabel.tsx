import { Skeleton } from '@zeal/uikit/Skeleton'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { FormattedFeeInDefaultCurrency2 } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import { Network } from '@zeal/domains/Network'
import { SubmitedTransactionCompleted } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { fetchFinalFee } from '@zeal/domains/Transactions/api/fetchFinalFee'

type Props = {
    completedTransaction: SubmitedTransactionCompleted
    network: Network
}

export const CompletedLabel = ({ completedTransaction, network }: Props) => {
    const [loadable] = useLoadableData(fetchFinalFee, {
        type: 'loading',
        params: {
            gasInfo: completedTransaction.gasInfo,
            network,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return <Skeleton variant="default" width={40} height={16} />
        case 'loaded':
            const { priceInDefaultCurrency } = loadable.data
            return priceInDefaultCurrency ? (
                <Text
                    variant="footnote"
                    weight="regular"
                    color="textStatusSuccessOnColor"
                >
                    <FormattedFeeInDefaultCurrency2
                        money={priceInDefaultCurrency}
                    />
                </Text>
            ) : null
        case 'error':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
