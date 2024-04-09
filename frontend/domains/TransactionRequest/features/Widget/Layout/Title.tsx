import { FormattedMessage } from 'react-intl'

import { notReachable } from '@zeal/toolkit'

import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

type Props = { simulationResult: SimulationResult }

export const Title = ({ simulationResult }: Props) => {
    switch (simulationResult.type) {
        case 'failed':
        case 'not_supported':
            return (
                <FormattedMessage
                    id="simulationNotAvailable.title"
                    defaultMessage="Unknown Action"
                />
            )

        case 'simulated': {
            const simulatedTransaction = simulationResult.simulation.transaction

            switch (simulatedTransaction.type) {
                case 'WithdrawalTrx':
                    return (
                        <FormattedMessage
                            id="simulatedTransaction.Withdrawal.info.title"
                            defaultMessage="Withdrawal"
                        />
                    )

                case 'BridgeTrx':
                    return (
                        <FormattedMessage
                            id="simulatedTransaction.BridgeTrx.info.title"
                            defaultMessage="Bridge"
                        />
                    )
                case 'P2PTransaction':
                case 'P2PNftTransaction':
                    return (
                        <FormattedMessage
                            id="simulatedTransaction.P2PTransaction.info.title"
                            defaultMessage="Send"
                        />
                    )
                case 'ApprovalTransaction':
                    return (
                        <FormattedMessage
                            id="simulatedTransaction.approve.info.title"
                            defaultMessage="Approve"
                        />
                    )

                case 'NftCollectionApprovalTransaction':
                    return (
                        <FormattedMessage
                            id="simulatedTransaction.NftCollectionApproval.approve"
                            defaultMessage="Approve NFT collection"
                        />
                    )

                case 'SingleNftApprovalTransaction':
                    return (
                        <FormattedMessage
                            id="simulatedTransaction.SingleNftApproval.approve"
                            defaultMessage="Approve NFT"
                        />
                    )

                case 'UnknownTransaction':
                case 'FailedTransaction':
                    return <>{simulatedTransaction.method}</>

                default:
                    return notReachable(simulatedTransaction)
            }
        }

        /* istanbul ignore next */
        default:
            return notReachable(simulationResult)
    }
}
