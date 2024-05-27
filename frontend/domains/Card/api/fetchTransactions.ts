import { get } from '@zeal/api/gnosisApi'

import { parse as parseJSON } from '@zeal/toolkit/JSON'
import {
    array,
    groupByType,
    string,
    UnexpectedResultFailureError,
} from '@zeal/toolkit/Result'

import { captureError } from '@zeal/domains/Error/helpers/captureError'

import { CardTransaction, GnosisPayLoginInfo } from '..'
import { parseCardTransaction } from '../helpers/parseCardTransaction'

export const fetchTransactions = async ({
    gnosisPayLoginInfo,
}: {
    gnosisPayLoginInfo: GnosisPayLoginInfo
}): Promise<CardTransaction[]> =>
    get('/transactions', {
        auth: { type: 'bearer_token', token: gnosisPayLoginInfo.token },
    })
        .then((response) =>
            string(response)
                .andThen(parseJSON)
                .andThen(array)
                .getSuccessResultOrThrow('Failed to parse transactions array')
        )
        .then((transactionDtos) => {
            const [errors, transactions] = groupByType(
                transactionDtos.map(parseCardTransaction)
            )

            if (errors.length > 0) {
                captureError(
                    new UnexpectedResultFailureError(
                        'Failed to parse some transactions',
                        errors
                    )
                )
            }

            return transactions
        })
