import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { RangeInt } from '@zeal/toolkit/Range'

import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { ListItem } from '@zeal/domains/SmartContract/components/ListItem'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { ProgressStatusBar } from './ProgressStatusBar'

import { SubmitedTransaction } from '../SubmitedTransaction'
import { SubmittedSafeTransaction } from '../SubmittedSafeTransaction'

type Props = {
    submitedTransaction: SubmitedTransaction | SubmittedSafeTransaction
    simulationResult: SimulationResult
    network: Network
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    queuedInitialProgress: RangeInt<0, 100> | null
}

export const ContentFooter = ({
    simulationResult,
    submitedTransaction,
    network,
    networkMap,
    networkRPCMap,
    queuedInitialProgress,
}: Props) => {
    switch (simulationResult.type) {
        case 'failed':
        case 'not_supported':
            return (
                <ProgressStatusBar
                    submitedTransaction={submitedTransaction}
                    network={network}
                    networkRPCMap={networkRPCMap}
                    queuedInitialProgress={queuedInitialProgress}
                />
            )
        case 'simulated': {
            const { transaction, checks } = simulationResult.simulation

            switch (transaction.type) {
                case 'BridgeTrx':
                case 'UnknownTransaction':
                case 'FailedTransaction':
                case 'P2PTransaction':
                case 'P2PNftTransaction':
                case 'WithdrawalTrx':
                    return (
                        <ProgressStatusBar
                            submitedTransaction={submitedTransaction}
                            network={network}
                            networkRPCMap={networkRPCMap}
                            queuedInitialProgress={queuedInitialProgress}
                        />
                    )
                case 'ApprovalTransaction':
                case 'SingleNftApprovalTransaction':
                case 'NftCollectionApprovalTransaction':
                    return (
                        <Column spacing={0}>
                            <Group variant="default">
                                <Column spacing={0}>
                                    <Text
                                        variant="paragraph"
                                        weight="regular"
                                        color="textSecondary"
                                    >
                                        <FormattedMessage
                                            id="check-confirmation.approve.footer.for"
                                            defaultMessage="For"
                                        />
                                    </Text>
                                    <ListItem
                                        safetyChecks={(() => {
                                            switch (submitedTransaction.state) {
                                                case 'queued':
                                                case 'included_in_block':
                                                case 'replaced':
                                                    return checks
                                                case 'completed':
                                                case 'failed':
                                                    return null
                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(
                                                        submitedTransaction
                                                    )
                                            }
                                        })()}
                                        smartContract={transaction.approveTo}
                                        networkMap={networkMap}
                                    />
                                </Column>
                            </Group>

                            <ProgressStatusBar
                                submitedTransaction={submitedTransaction}
                                network={network}
                                networkRPCMap={networkRPCMap}
                                queuedInitialProgress={queuedInitialProgress}
                            />
                        </Column>
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(transaction)
            }
        }
        /* istanbul ignore next */
        default:
            return notReachable(simulationResult)
    }
}
