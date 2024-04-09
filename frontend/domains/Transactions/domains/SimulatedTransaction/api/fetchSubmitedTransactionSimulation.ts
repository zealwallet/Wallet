import { get } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import { object, record, Result, shape } from '@zeal/toolkit/Result'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { parse as parseCurrency } from '@zeal/domains/Currency/helpers/parse'
import { PredefinedNetwork, TestNetwork } from '@zeal/domains/Network'

import { parseSimulatedTransaction } from '../parsers/parseSimulatedTransaction'
import { SimulatedTransaction } from '../SimulatedTransaction'

export type SubmittedTransactionResultResponse = {
    transaction: SimulatedTransaction
    currencies: KnownCurrencies
}

const parseSubmitedTransactionResultResponse = (
    input: unknown
): Result<unknown, SubmittedTransactionResultResponse> =>
    object(input).andThen((dto) =>
        shape({
            transaction: parseSimulatedTransaction(
                dto.transaction,
                dto.currencies
            ),
            currencies: object(dto.currencies).andThen((curriencies) =>
                record(curriencies, parseCurrency)
            ),
        })
    )

export const fetchSimulationSubmittedSimulation = ({
    network,
    hash,
}: {
    network: PredefinedNetwork | TestNetwork
    hash: string
}): Promise<SubmittedTransactionResultResponse> => {
    switch (network.type) {
        case 'predefined':
        case 'testnet':
            return get(`/wallet/transaction/${hash}/result`, {
                query: { network: network.name },
            }).then((data) =>
                parseSubmitedTransactionResultResponse(
                    data
                ).getSuccessResultOrThrow(
                    'Failed to parse submitted transaction simulation'
                )
            )

        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
