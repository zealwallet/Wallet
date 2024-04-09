import {
    boolean,
    match,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { OffRampAccount } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferFiatCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { parseBankDetails } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseBankDetails'

export const parseOffRampAccount = (
    input: unknown,
    fiatCurrencies: BankTransferFiatCurrencies
): Result<unknown, OffRampAccount> =>
    object(input).andThen((obj) =>
        shape({
            type: success('off_ramp_account' as const),
            currency: oneOf(obj.currency, [
                match(obj.currency, 'EUR').map(() => fiatCurrencies.EUR),
                match(obj.currency, 'GBP').map(() => fiatCurrencies.GBP),
                match(obj.currency, 'NGN').map(() => fiatCurrencies.NGN),
            ]),
            mainBeneficiary: boolean(obj.main_beneficiary),
            uuid: string(obj.uuid),
            bankDetails: parseBankDetails(obj),
        })
    )
