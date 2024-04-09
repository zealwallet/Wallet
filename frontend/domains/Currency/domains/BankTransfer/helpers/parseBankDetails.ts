import {
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { BankAccountDetails } from '@zeal/domains/Currency/domains/BankTransfer'

export const parseBankDetails = (
    input: unknown
): Result<unknown, BankAccountDetails> =>
    object(input).andThen((obj) =>
        oneOf(obj, [
            shape({
                type: success('uk' as const),
                accountNumber: string(obj.account_number),
                sortCode: string(obj.sort_code),
            }),
            shape({
                type: success('iban' as const),
                iban: string(obj.iban),
            }),
            shape({
                type: success('ngn' as const),
                accountNumber: string(obj.account_number),
                bankCode: string(obj.bank_code),
            }),
        ])
    )
