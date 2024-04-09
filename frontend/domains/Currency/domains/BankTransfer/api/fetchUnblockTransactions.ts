import { get } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import {
    array,
    failure,
    groupByType,
    match,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
    UnexpectedResultFailureError,
} from '@zeal/toolkit/Result'

import {
    OffRampTransaction,
    OnRampTransaction,
    UnblockTransactionStatus,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

const transactionStatusMap: Record<UnblockTransactionStatus, true> = {
    AML_CHECKS_COMPLETED: true,
    AML_CHECKS_FAILED: true,
    AML_CHECKS_IN_PROGRESS: true,
    CRYPTO_TRANSFER_COMPLETED: true,
    CRYPTO_TRANSFER_FAILED: true,
    CRYPTO_TRANSFER_IN_PROGRESS: true,
    CRYPTO_TRANSFER_ISSUED: true,
    FIAT_TRANSFER_ISSUED: true,
    FINALITY_REACHED: true,
    FINALIZE_PROCESS_FAILED: true,
    IBAN_TRANSFER_COMPLETED: true,
    IBAN_TRANSFER_FAILED: true,
    IBAN_TRANSFER_IN_PROGRESS: true,
    IBAN_TRANSFER_ISSUED: true,
    INTERLEDGER_TRANSFER_COMPLETED: true,
    INTERLEDGER_TRANSFER_FAILED: true,
    INTERLEDGER_TRANSFER_IN_PROGRESS: true,
    INTERLEDGER_TRANSFER_ISSUED: true,
    ON_HOLD_KYC: true,
    OUTSIDE_TRANSFER_APPROVED: true,
    OUTSIDE_TRANSFER_IN_REVIEW: true,
    OUTSIDE_TRANSFER_RECEIVED: true,
    OUTSIDE_TRANSFER_REJECTED: true,
    PROCESS_BLOCKED: true,
    PROCESS_COMPLETED: true,
    PROCESS_INITIATION_FAILED: true,
}

type Response = {
    offRampTransactions: OffRampTransaction[]
    onRampTransactions: OnRampTransaction[]
}

const parseOnRampTransaction = (
    input: unknown
): Result<unknown, OnRampTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.direction, 'fiatToCrypto').map(
                () => 'on_ramp_transaction' as const
            ),
            id: object(obj.input).andThen((inputObj) =>
                string(inputObj.transaction_id)
            ),
            status: string(obj.status).andThen((status) =>
                // TODO: Would a best effort attempt make this less brittle? (Unblock addes statuses)
                transactionStatusMap[status as UnblockTransactionStatus]
                    ? success(status as UnblockTransactionStatus)
                    : failure(`${status} is not a valid transaction status`)
            ),
        })
    )

const parseUnblockTransaction = (
    input: unknown
): Result<unknown, OnRampTransaction | OffRampTransaction> =>
    oneOf(input, [
        parseOnRampTransaction(input),
        parseOffRampTransaction(input),
    ])

const parseOffRampTransaction = (
    input: unknown
): Result<unknown, OffRampTransaction> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.direction, 'cryptoToFiat').map(
                () => 'off_ramp_transaction' as const
            ),
            id: object(obj.input).andThen((inputObj) =>
                string(inputObj.transaction_id)
            ),
            status: string(obj.status).andThen((status) =>
                transactionStatusMap[status as UnblockTransactionStatus]
                    ? success(status as UnblockTransactionStatus)
                    : failure(`${status} is not a valid transaction status`)
            ),
        })
    )

export const fetchUnblockTransactions = ({
    unblockLoginInfo,
    bankTransferInfo,
    signal,
}: {
    bankTransferInfo: BankTransferUnblockUserCreated
    unblockLoginInfo: UnblockLoginInfo
    signal?: AbortSignal
}): Promise<Response> => {
    return get(
        '/wallet/smart-wallet/unblock/',
        {
            query: { path: `/user/transactions` },
            auth: {
                type: 'session_id',
                sessionId: unblockLoginInfo.unblockSessionId,
            },
        },
        signal
    ).then((reponse) => {
        const responseArray = array(reponse).getSuccessResultOrThrow(
            'Failed to parse unblock transactions array'
        )

        const [errors, transactions] = groupByType(
            responseArray.map(parseUnblockTransaction)
        )

        if (errors.length) {
            captureError(
                new UnexpectedResultFailureError(
                    'Failed to parse some unblock transactions',
                    errors
                )
            )
        }

        return transactions.reduce(
            (acc, item) => {
                switch (item.type) {
                    case 'off_ramp_transaction':
                        acc.offRampTransactions.push(item)
                        break

                    case 'on_ramp_transaction':
                        acc.onRampTransactions.push(item)
                        break
                    default:
                        return notReachable(item)
                }

                return acc
            },
            {
                offRampTransactions: [],
                onRampTransactions: [],
            } as Response
        )
    })
}
