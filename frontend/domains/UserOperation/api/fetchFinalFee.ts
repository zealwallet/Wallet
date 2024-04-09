import { components } from '@zeal/api/portfolio'
import { post } from '@zeal/api/request'

import {
    bigint,
    nullableOf,
    object,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import {
    parseCryptoCurrency,
    parseFiatCurrency,
} from '@zeal/domains/Currency/helpers/parse'
import { CryptoMoney, FiatMoney } from '@zeal/domains/Money'
import { PredefinedNetwork, TestNetwork } from '@zeal/domains/Network'
import {
    SubmittedUserOperationCompleted,
    SubmittedUserOperationFailed,
} from '@zeal/domains/TransactionRequest/domains/SubmittedUserOperation'

type FeeResponse = {
    feeInTokenCurrency: CryptoMoney
    feeInDefaultCurrency: FiatMoney | null
}

const parse = (
    input: components['schemas']['UserOpsFinalFee']
): Result<unknown, FeeResponse> => {
    return shape({
        feeInTokenCurrency: shape({
            amount: bigint(input.feeInTokenCurrency.amount),
            currency: parseCryptoCurrency(
                input.currencies[input.feeInTokenCurrency.currencyId]
            ),
        }),
        feeInDefaultCurrency: nullableOf(input.feeInDefaultCurrency, (fee) =>
            object(fee).andThen((feeObj) =>
                shape({
                    amount: bigint(feeObj.amount),
                    currency: string(feeObj.currencyId).andThen((currId) =>
                        parseFiatCurrency(input.currencies[currId])
                    ),
                })
            )
        ),
    })
}

export const fetchFinalFee = async ({
    network,
    sender,
    submittedUserOperation,
}: {
    sender: Address
    submittedUserOperation:
        | SubmittedUserOperationCompleted
        | SubmittedUserOperationFailed
    network: PredefinedNetwork | TestNetwork
}): Promise<FeeResponse> =>
    post('/wallet/user-ops-transaction/fee', {
        query: { network: network.name },
        body: {
            network: network.name,
            sender,
            transactionHash: submittedUserOperation.bundleTransactionHash,
            userOpHash: submittedUserOperation.userOperationHash,
        },
    }).then((data) =>
        parse(data).getSuccessResultOrThrow(
            'Failed to parse user operation final fee'
        )
    )
