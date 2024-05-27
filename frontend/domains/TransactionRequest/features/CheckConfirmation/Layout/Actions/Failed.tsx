import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { BannerOutline } from '@zeal/uikit/BannerOutline'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { Submited } from '@zeal/domains/TransactionRequest'
import { SubmitedTransactionFailed } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { fetchFinalFee } from '@zeal/domains/Transactions/api/fetchFinalFee'
import { FinalFeeBanner } from '@zeal/domains/Transactions/components/FinalFeeBanner'

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
                        <Row spacing={0} alignX="stretch">
                            <Text
                                variant="paragraph"
                                color="textPrimary"
                                weight="regular"
                            >
                                <FormattedMessage
                                    id="confirmTransaction.networkFee"
                                    defaultMessage="Final network fee"
                                />
                            </Text>
                            <Skeleton variant="default" width={80} />
                        </Row>
                    </BannerOutline>

                    <Actions>
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
                    </Actions>
                </Column>
            )

        case 'loaded':
            return (
                <Column spacing={12}>
                    <FinalFeeBanner
                        fee={loadable.data.fee}
                        priceInDefaultCurrency={
                            loadable.data.priceInDefaultCurrency
                        }
                    />

                    <Actions>
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
                    </Actions>
                </Column>
            )

        default:
            return notReachable(loadable)
    }
}
