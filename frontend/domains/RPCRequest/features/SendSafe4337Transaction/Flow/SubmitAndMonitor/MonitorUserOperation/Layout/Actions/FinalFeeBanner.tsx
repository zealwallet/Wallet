import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { BannerOutline } from '@zeal/uikit/BannerOutline'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { Address } from '@zeal/domains/Address'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { FormattedFeeInDefaultCurrency2 } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import { FormattedTokenBalances2 } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { Network, PredefinedNetwork, TestNetwork } from '@zeal/domains/Network'
import {
    SubmittedUserOperationCompleted,
    SubmittedUserOperationFailed,
} from '@zeal/domains/TransactionRequest/domains/SubmittedUserOperation'
import { fetchFinalFee } from '@zeal/domains/UserOperation/api/fetchFinalFee'

type Props = {
    submittedUserOperation:
        | SubmittedUserOperationFailed
        | SubmittedUserOperationCompleted
    network: Network // TODO @resetko-zeal we can make this type better if we have a special type for networks supported by gas abstraction
    sender: Address
}

export const FeeBanner = ({
    submittedUserOperation,
    network,
    sender,
}: Props) => {
    switch (network.type) {
        case 'predefined':
        case 'testnet':
            return (
                <FeeBannerLoader
                    network={network}
                    sender={sender}
                    submittedUserOperation={submittedUserOperation}
                />
            )
        case 'custom':
            return null

        default:
            return notReachable(network)
    }
}

const FeeBannerLoader = ({
    network,
    sender,
    submittedUserOperation,
}: {
    submittedUserOperation:
        | SubmittedUserOperationFailed
        | SubmittedUserOperationCompleted
    network: PredefinedNetwork | TestNetwork
    sender: Address
}) => {
    const [loadable] = useLoadableData(fetchFinalFee, {
        type: 'loading',
        params: { submittedUserOperation, network, sender },
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
        case 'loaded':
            return (
                <BannerOutline icon={null}>
                    <Row spacing={0} alignX="stretch">
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
                            {loadable.data.feeInDefaultCurrency ? (
                                <FormattedFeeInDefaultCurrency2
                                    money={loadable.data.feeInDefaultCurrency}
                                />
                            ) : (
                                <FormattedTokenBalances2
                                    money={loadable.data.feeInTokenCurrency}
                                />
                            )}
                        </Text>
                    </Row>
                </BannerOutline>
            )

        case 'loading':
        case 'error':
            return (
                <BannerOutline icon={null}>
                    <Row spacing={0} alignX="stretch">
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
            )

        default:
            return notReachable(loadable)
    }
}
