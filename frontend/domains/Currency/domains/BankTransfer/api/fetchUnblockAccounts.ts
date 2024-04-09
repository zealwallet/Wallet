import { get } from '@zeal/api/request'

import { array, combine } from '@zeal/toolkit/Result'

import {
    OffRampAccount,
    OnRampAccount,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { parseOffRampAccount } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseOffRampAccount'
import { parseOnRampAccount } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseOnRampAccount'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

type Params = {
    bankTransferInfo: BankTransferUnblockUserCreated
    unblockLoginInfo: UnblockLoginInfo
    currencies: BankTransferCurrencies
}

export const fetchOffRampAccounts = ({
    unblockLoginInfo,
    bankTransferInfo,
    signal,
    currencies,
}: Params & { signal?: AbortSignal }): Promise<OffRampAccount[]> => {
    return get(
        '/wallet/smart-wallet/unblock/',
        {
            query: {
                path: '/user/bank-account/remote',
            },
            auth: {
                type: 'session_id',
                sessionId: unblockLoginInfo.unblockSessionId,
            },
        },
        signal
    ).then((data) =>
        array(data)
            .andThen((arr) =>
                combine(
                    arr.map((val) =>
                        parseOffRampAccount(val, currencies.fiatCurrencies)
                    )
                )
            )
            .getSuccessResultOrThrow('Failed to parse offramp accounts')
    )
}

export const fetchOnRampAccounts = ({
    unblockLoginInfo,
    bankTransferInfo,
    signal,
    currencies,
}: Params & { signal?: AbortSignal }): Promise<OnRampAccount[]> => {
    return get(
        '/wallet/smart-wallet/unblock/',
        {
            query: {
                path: '/user/bank-account/unblock',
            },
            auth: {
                type: 'session_id',
                sessionId: unblockLoginInfo.unblockSessionId,
            },
        },
        signal
    ).then((data) =>
        array(data)
            .andThen((arr) =>
                combine(
                    arr.map((val) =>
                        parseOnRampAccount(val, currencies.fiatCurrencies)
                    )
                )
            )
            .getSuccessResultOrThrow('Failed to map onramp accounts')
    )
}
