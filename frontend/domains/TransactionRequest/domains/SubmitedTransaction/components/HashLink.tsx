import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { openExternalURL } from '@zeal/toolkit/Window'

import { Network } from '@zeal/domains/Network'
import { format } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/format'
import { getExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'

import { SubmitedTransaction } from '../SubmitedTransaction'
import { SubmittedSafeTransaction } from '../SubmittedSafeTransaction'

type Props = {
    variant: 'with_address' | 'no_address'
    submitedTransaction: SubmitedTransaction | SubmittedSafeTransaction
    network: Network
}

export const HashLink = ({ submitedTransaction, network, variant }: Props) => {
    switch (submitedTransaction.state) {
        case 'queued':
        case 'included_in_block':
        case 'completed':
        case 'failed':
        case 'replaced':
            const link = getExplorerLink(
                { transactionHash: submitedTransaction.hash },
                network
            )

            switch (variant) {
                case 'with_address':
                    return (
                        <Row spacing={4} alignY="center">
                            {!link ? (
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textPrimary"
                                >
                                    {format({
                                        transactionHash:
                                            submitedTransaction.hash,
                                    })}
                                </Text>
                            ) : (
                                <IconButton
                                    size="small"
                                    variant="on_light"
                                    onClick={() => openExternalURL(link)}
                                >
                                    {() => (
                                        <Row spacing={4} alignY="center">
                                            <Text
                                                variant="paragraph"
                                                weight="regular"
                                                color="textPrimary"
                                            >
                                                {format({
                                                    transactionHash:
                                                        submitedTransaction.hash,
                                                })}
                                            </Text>

                                            <ExternalLink
                                                size={14}
                                                color="textPrimary"
                                            />
                                        </Row>
                                    )}
                                </IconButton>
                            )}
                        </Row>
                    )

                case 'no_address':
                    return !link ? null : (
                        <IconButton
                            variant="on_light"
                            onClick={() => openExternalURL(link)}
                            size="small"
                        >
                            {({ color }) => (
                                <ExternalLink size={14} color={color} />
                            )}
                        </IconButton>
                    )

                default:
                    return notReachable(variant)
            }

        default:
            return notReachable(submitedTransaction)
    }
}
