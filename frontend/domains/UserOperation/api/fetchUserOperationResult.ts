import { post } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import { object, Result, shape } from '@zeal/toolkit/Result'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { parseKnownCurrencies } from '@zeal/domains/Currency/helpers/parse'
import { ImperativeError } from '@zeal/domains/Error'
import { Network } from '@zeal/domains/Network'
import { SubmittedUserOperationCompleted } from '@zeal/domains/TransactionRequest/domains/SubmittedUserOperation'
import { SimulatedTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { parseSimulatedTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction/parsers/parseSimulatedTransaction'

type UserOperationResultResponse = {
    transaction: SimulatedTransaction
    currencies: KnownCurrencies
}

const parseUserOperationResultResponse = (
    input: unknown
): Result<unknown, UserOperationResultResponse> =>
    object(input).andThen((dto) =>
        shape({
            transaction: parseSimulatedTransaction(
                dto.transaction,
                dto.currencies
            ),
            currencies: parseKnownCurrencies(dto.currencies),
        })
    )

export const fetchUserOperationResult = async ({
    network,
    submittedUserOperation,
    signal,
}: {
    network: Network
    submittedUserOperation: SubmittedUserOperationCompleted
    signal?: AbortSignal
}): Promise<UserOperationResultResponse> => {
    switch (network.type) {
        case 'predefined':
        case 'testnet':
            return post(
                '/wallet/user-ops-transaction/result',
                {
                    body: {
                        network: network.name,
                        userOpHash: submittedUserOperation.userOperationHash,
                        transactionHash:
                            submittedUserOperation.bundleTransactionHash,
                        sender: submittedUserOperation.sender,
                    },
                },
                signal
            ).then((response) =>
                parseUserOperationResultResponse(
                    response
                ).getSuccessResultOrThrow(
                    'Failed to parse user operation result'
                )
            )
        case 'custom':
            throw new ImperativeError(
                'Cannot fetch user operation result for custom network'
            ) // TODO :: @Nicvaniek create narrowed network type for chains that support gas abstraction
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
