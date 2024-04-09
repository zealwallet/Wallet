import { post } from '@zeal/api/request'

import { FiatCurrency } from '@zeal/domains/Currency'
import { OnRampAccount } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { parseOnRampAccount } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseOnRampAccount'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

export const createOnRampAccount = ({
    currency,
    unblockLoginInfo,
    currencies,
    signal,
}: {
    currency: FiatCurrency
    bankTransfers: BankTransferUnblockUserCreated
    unblockLoginInfo: UnblockLoginInfo
    currencies: BankTransferCurrencies
    signal?: AbortSignal
}): Promise<OnRampAccount> => {
    return post(
        '/wallet/smart-wallet/unblock/',
        {
            query: {
                path: `/user/bank-account/unblock`,
            },
            auth: {
                type: 'session_id',
                sessionId: unblockLoginInfo.unblockSessionId,
            },
            body: {
                currency: currency.code,
            },
        },
        signal
    ).then((response) =>
        parseOnRampAccount(
            response,
            currencies.fiatCurrencies
        ).getSuccessResultOrThrow('Failed to parse onramp account')
    )
}
