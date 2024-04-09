import { get } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import {
    array,
    combine,
    nullableOf,
    number,
    object,
    shape,
} from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { CurrentNetwork } from '@zeal/domains/Network'
import { TransactionActivity } from '@zeal/domains/Transactions'
import { parseActivityTransaction } from '@zeal/domains/Transactions/helpers/parseActivityTransaction'

type Request = {
    address: Address
    timestampLessThan: number
    scam: boolean
    selectedNetwork: CurrentNetwork
    signal?: AbortSignal
}

function getQuery(
    timestampLessThan: number,
    scam: boolean,
    currentNetwork: CurrentNetwork
) {
    switch (currentNetwork.type) {
        case 'all_networks':
            return {
                timestampLessThan,
                scam,
            }
        case 'specific_network':
            switch (currentNetwork.network.type) {
                case 'predefined':
                    return {
                        timestampLessThan,
                        scam,
                        network: currentNetwork.network.name,
                    }
                case 'testnet':
                case 'custom':
                    return {
                        timestampLessThan,
                        scam,
                    }
                /* istanbul ignore next */
                default:
                    return notReachable(currentNetwork.network)
            }
        /* istanbul ignore next */
        default:
            return notReachable(currentNetwork)
    }
}

export const fetchTransactionActivity = async ({
    address,
    timestampLessThan,
    selectedNetwork,
    scam,
    signal,
}: Request): Promise<TransactionActivity> => {
    const response = await get(
        `/wallet/transaction/activity/${address}/`,
        {
            query: getQuery(timestampLessThan, scam, selectedNetwork),
        },
        signal
    ).then((resp) =>
        object(resp)
            .andThen((obj) =>
                shape({
                    continueFromTimestamp: nullableOf(
                        obj.continueFromTimestamp,
                        number
                    ),
                    transactions: array(obj.transactions).andThen((arr) =>
                        combine(
                            arr.map((trx) =>
                                parseActivityTransaction(trx, obj.currencies)
                            )
                        )
                    ),
                })
            )
            .map((data) => ({
                ...data,
                transactions: data.transactions.filter((trx) => {
                    switch (selectedNetwork.type) {
                        case 'all_networks':
                            return true
                        case 'specific_network':
                            return (
                                selectedNetwork.network.hexChainId ===
                                trx.networkHexId
                            )
                        /* istanbul ignore next */
                        default:
                            return notReachable(selectedNetwork)
                    }
                }),
            }))
            .getSuccessResultOrThrow('cannot parse transaction history')
    )

    return !response.transactions.length && response.continueFromTimestamp
        ? fetchTransactionActivity({
              address,
              scam,
              signal,
              selectedNetwork,
              timestampLessThan: response.continueFromTimestamp,
          })
        : response
}
