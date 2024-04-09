import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { BannerOutline } from '@zeal/uikit/BannerOutline'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { FormattedFeeInDefaultCurrency2 } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import { TruncatedFeeInNativeTokenCurrency2 } from '@zeal/domains/Money/components/TruncatedFeeInNativeTokenCurrency'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { Submited } from '@zeal/domains/TransactionRequest'
import { SubmitedTransactionFailed } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { fetchFinalFee } from '@zeal/domains/Transactions/api/fetchFinalFee'

type Props = {
    failedTransaction: SubmitedTransactionFailed
    transactionRequest: Submited
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg = {
    type: 'transaction_failure_accepted'
    failedTransaction: SubmitedTransactionFailed
    transactionRequest: Submited
}

export const Failed = ({
    failedTransaction,
    transactionRequest,
    networkMap,
    onMsg,
}: Props) => {
    const network = findNetworkByHexChainId(
        transactionRequest.networkHexId,
        networkMap
    )
    const [loadable] = useLoadableData(fetchFinalFee, {
        type: 'loading',
        params: {
            gasInfo: failedTransaction.gasInfo,
            network,
        },
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'loaded':
                break

            case 'error':
                captureError(loadable.error)
                break

            default:
                notReachable(loadable)
        }
    }, [loadable])

    switch (loadable.type) {
        case 'error': // TODO What to render if BE fails :thinking:
        case 'loading':
            return (
                <Column spacing={12}>
                    <BannerOutline icon={null}>
                        <Row spacing={0} alignX="stretch" fullWidth>
                            <Text
                                variant="paragraph"
                                color="textPrimary"
                                weight="regular"
                            >
                                <FormattedMessage
                                    id="confirmTransaction.finalNetworkFee"
                                    defaultMessage="Final network fee"
                                />
                            </Text>
                            <Skeleton variant="default" width={80} />
                        </Row>
                    </BannerOutline>

                    <Button
                        variant="primary"
                        size="regular"
                        onClick={() =>
                            onMsg({
                                type: 'transaction_failure_accepted',
                                failedTransaction,
                                transactionRequest,
                            })
                        }
                    >
                        <FormattedMessage
                            id="action.close"
                            defaultMessage="Close"
                        />
                    </Button>
                </Column>
            )

        case 'loaded':
            return (
                <Column spacing={12}>
                    <BannerOutline icon={null}>
                        <Row spacing={0} alignX="stretch" fullWidth>
                            <Text
                                variant="paragraph"
                                color="textPrimary"
                                weight="regular"
                            >
                                <FormattedMessage
                                    id="confirmTransaction.finalNetworkFee"
                                    defaultMessage="Final network fee"
                                />
                            </Text>

                            <Text
                                variant="paragraph"
                                color="textPrimary"
                                weight="regular"
                            >
                                {loadable.data.priceInDefaultCurrency ? (
                                    <FormattedFeeInDefaultCurrency2
                                        money={
                                            loadable.data.priceInDefaultCurrency
                                        }
                                    />
                                ) : (
                                    <TruncatedFeeInNativeTokenCurrency2
                                        money={loadable.data.fee}
                                    />
                                )}
                            </Text>
                        </Row>
                    </BannerOutline>

                    <Button
                        variant="primary"
                        size="regular"
                        onClick={() =>
                            onMsg({
                                type: 'transaction_failure_accepted',
                                failedTransaction,
                                transactionRequest,
                            })
                        }
                    >
                        <FormattedMessage
                            id="action.close"
                            defaultMessage="Close"
                        />
                    </Button>
                </Column>
            )

        default:
            return notReachable(loadable)
    }
}
