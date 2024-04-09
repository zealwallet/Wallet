import { FormattedMessage } from 'react-intl'

import { CheckMarkCircle } from '@zeal/uikit/Icon/CheckMarkCircle'
import { Logo } from '@zeal/uikit/Icon/Logo'
import { Progress } from '@zeal/uikit/Progress'
import { Row } from '@zeal/uikit/Row'

import { notReachable } from '@zeal/toolkit'

import { CryptoCurrency } from '@zeal/domains/Currency'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { HashLink } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/components/HashLink'
import { ProgressStatusBar } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/components/ProgressStatusBar'

type Props = {
    currency: CryptoCurrency
    submitedTransaction: SubmitedTransaction
    network: Network
    networkRPCMap: NetworkRPCMap
}

export const TransactionProgress = ({
    submitedTransaction,
    currency,
    network,
    networkRPCMap,
}: Props) => {
    switch (submitedTransaction.state) {
        case 'queued':
        case 'included_in_block':
        case 'failed':
        case 'replaced':
            return (
                <ProgressStatusBar
                    submitedTransaction={submitedTransaction}
                    network={network}
                    networkRPCMap={networkRPCMap}
                    queuedInitialProgress={null}
                />
            )
        case 'completed':
            return (
                <Progress
                    variant="success"
                    title={
                        <FormattedMessage
                            id="submitTransaction.state.complete"
                            defaultMessage="{currencyCode} added to Zeal"
                            values={{ currencyCode: currency.code }}
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="submitTransaction.state.complete.subtitle"
                            defaultMessage="Open your Zeal wallet and continue there. Click {logo} in your browser to open Zeal."
                            values={{
                                logo: <Logo color="textPrimary" size={12} />,
                            }}
                        />
                    }
                    right={
                        <Row spacing={4}>
                            <CheckMarkCircle
                                size={16}
                                color="iconStatusSuccessOnColor"
                            />
                            <HashLink
                                variant="with_address"
                                submitedTransaction={submitedTransaction}
                                network={network}
                            />
                        </Row>
                    }
                    initialProgress={null}
                    progress={100}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(submitedTransaction)
    }
}
