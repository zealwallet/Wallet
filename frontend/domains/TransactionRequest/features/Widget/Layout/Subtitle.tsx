import { FormattedMessage } from 'react-intl'

import { notReachable } from '@zeal/toolkit'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { format } from '@zeal/domains/Address/helpers/format'
import { Submited } from '@zeal/domains/TransactionRequest'

type Props = {
    transactionRequest: Submited
    accountsMap: AccountsMap
}

export const Subtitle = ({ transactionRequest, accountsMap }: Props) => {
    const { dApp, simulation, rpcRequest } = transactionRequest
    switch (simulation.type) {
        case 'failed':
        case 'not_supported':
            return null

        case 'simulated': {
            const { transaction } = simulation.simulation

            switch (transaction.type) {
                case 'BridgeTrx':
                case 'WithdrawalTrx':
                case 'FailedTransaction':
                    return null
                case 'P2PTransaction':
                case 'P2PNftTransaction': {
                    const account: Account | null =
                        accountsMap[transaction.toAddress]
                    return (
                        <FormattedMessage
                            id="transactionRequestWidget.p2p.subtitle"
                            defaultMessage="To {target}"
                            values={{
                                target: account
                                    ? account.label
                                    : format(transaction.toAddress),
                            }}
                        />
                    )
                }
                case 'ApprovalTransaction':
                case 'NftCollectionApprovalTransaction':
                case 'SingleNftApprovalTransaction':
                    return (
                        <FormattedMessage
                            id="transactionRequestWidget.approve.subtitle"
                            defaultMessage="For {target}"
                            values={{
                                target:
                                    transaction.approveTo.name ??
                                    format(transaction.approveTo.address),
                            }}
                        />
                    )
                case 'UnknownTransaction': {
                    const rpcToAddress = rpcRequest.params[0].to
                        ? format(rpcRequest.params[0].to)
                        : 'Unknown'
                    const target = dApp
                        ? dApp.title ?? dApp.hostname
                        : rpcToAddress

                    return (
                        <FormattedMessage
                            id="transactionRequestWidget.unknown.subtitle"
                            defaultMessage="Using {target}"
                            values={{
                                target,
                            }}
                        />
                    )
                }
                default:
                    return notReachable(transaction)
            }
        }

        /* istanbul ignore next */
        default:
            return notReachable(simulation)
    }
}
