import { FormattedMessage } from 'react-intl'

import { components } from '@zeal/api/portfolio'

import { Actions as UIActions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'

import { notReachable } from '@zeal/toolkit'

import { KeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Submited } from '@zeal/domains/TransactionRequest'

import { Completed, Msg as CompletedMsg } from './Completed'
import { Failed, Msg as FailedMsg } from './Failed'
import { AddedToQueue, Msg as AddedToQueueMsg } from './Queued'

type Props = {
    transactionRequest: Submited
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    keyStore: KeyStore
    installationId: string
    source: components['schemas']['TransactionEventSource']
    onMsg: (msg: Msg) => void
}

export type Msg = AddedToQueueMsg | CompletedMsg | FailedMsg

export const Actions = ({
    transactionRequest,
    networkMap,
    networkRPCMap,
    onMsg,
    keyStore,
    source,
    installationId,
}: Props) => {
    const { submitedTransaction } = transactionRequest

    switch (submitedTransaction.state) {
        case 'queued':
            return (
                <AddedToQueue
                    source={source}
                    keyStore={keyStore}
                    installationId={installationId}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    transactionRequest={{
                        ...transactionRequest,
                        submitedTransaction,
                    }}
                    onMsg={onMsg}
                />
            )

        case 'included_in_block':
        case 'replaced':
            return (
                <UIActions>
                    <Button size="regular" variant="secondary" disabled>
                        <FormattedMessage
                            id="submitTransaction.stop"
                            defaultMessage="Stop"
                        />
                    </Button>

                    <Button size="regular" variant="secondary" disabled>
                        <FormattedMessage
                            id="submitTransaction.speedUp"
                            defaultMessage="Speed up"
                        />
                    </Button>
                </UIActions>
            )

        case 'completed':
            return (
                <Completed
                    networkMap={networkMap}
                    completedTransaction={submitedTransaction}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />
            )

        case 'failed':
            return (
                <Failed
                    networkMap={networkMap}
                    failedTransaction={submitedTransaction}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(submitedTransaction)
    }
}
