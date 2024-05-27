import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { openExternalURL } from '@zeal/toolkit/Window'

import { Network } from '@zeal/domains/Network'
import { format } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/format'
import { getExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'

import { SubmittedUserOperation } from '../SubmittedUserOperation'

type Props = {
    variant: 'with_address' | 'no_address'
    submittedUserOperation: SubmittedUserOperation
    network: Network
}

export const HashLink = ({
    submittedUserOperation,
    network,
    variant,
}: Props) => {
    switch (submittedUserOperation.state) {
        case 'pending':
        case 'rejected':
            return null
        case 'bundled':
        case 'completed':
        case 'failed':
            return (
                <Link
                    hash={submittedUserOperation.bundleTransactionHash}
                    network={network}
                    variant={variant}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(submittedUserOperation)
    }
}

const Link = ({
    hash,
    network,
    variant,
}: {
    hash: string
    network: Network
    variant: Props['variant']
}) => {
    const link = getExplorerLink({ transactionHash: hash }, network)

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
                                transactionHash: hash,
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
                                            transactionHash: hash,
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
                    size="small"
                    variant="on_light"
                    onClick={() => openExternalURL(link)}
                >
                    {() => <ExternalLink size={14} color="textPrimary" />}
                </IconButton>
            )

        default:
            return notReachable(variant)
    }
}
