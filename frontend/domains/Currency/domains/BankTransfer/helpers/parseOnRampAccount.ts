import {
    match,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { OnRampAccount } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferFiatCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { parseBankDetails } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseBankDetails'

export const parseOnRampAccount = (
    input: unknown,
    fiatCurrencies: BankTransferFiatCurrencies
): Result<unknown, OnRampAccount> =>
    object(input).andThen((obj) =>
        shape({
            type: success('on_ramp_account' as const),
            uuid: string(obj.uuid),
            currency: oneOf(obj.currency, [
                match(obj.currency, 'EUR').map(() => fiatCurrencies.EUR),
                match(obj.currency, 'GBP').map(() => fiatCurrencies.GBP),
                match(obj.currency, 'NGN').map(() => fiatCurrencies.NGN),
            ]),
            bankDetails: parseBankDetails(obj),
        })
    )
