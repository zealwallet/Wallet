import { get, post } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import { object, string } from '@zeal/toolkit/Result'

import { Country } from '@zeal/domains/Country'
import { FiatCurrency } from '@zeal/domains/Currency'
import {
    OffRampAccount,
    UserInputForBankDetails,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { parseOffRampAccount } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseOffRampAccount'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

export type CreateOffRampAccountRequest = {
    country: Country
    currency: FiatCurrency
    bankDetails: UserInputForBankDetails
}

const fetchOffRampAccount = ({
    accountUuid,
    unblockLoginInfo,
    bankTransferInfo,
    currencies,
    signal,
}: {
    accountUuid: string
    bankTransferInfo: BankTransferUnblockUserCreated
    unblockLoginInfo: UnblockLoginInfo
    currencies: BankTransferCurrencies
    signal?: AbortSignal
}): Promise<OffRampAccount> =>
    get(
        '/wallet/smart-wallet/unblock/',
        {
            query: {
                // TODO @maxtern
                // @ts-ignore
                path: `/user/bank-account/remote/${accountUuid}`,
            },
            auth: {
                type: 'session_id',
                sessionId: unblockLoginInfo.unblockSessionId,
            },
        },
        signal
    ).then((data) =>
        parseOffRampAccount(
            data,
            currencies.fiatCurrencies
        ).getSuccessResultOrThrow('Failed to parse offramp account')
    )

export const createOffRampAccount = ({
    account,
    unblockLoginInfo,
    bankTransferInfo,
    currencies,
    signal,
}: {
    account: CreateOffRampAccountRequest
    bankTransferInfo: BankTransferUnblockUserCreated
    unblockLoginInfo: UnblockLoginInfo
    currencies: BankTransferCurrencies
    signal?: AbortSignal
}): Promise<OffRampAccount> =>
    post(
        '/wallet/smart-wallet/unblock/',
        {
            query: {
                path: `/user/bank-account/remote`,
            },
            auth: {
                type: 'session_id',
                sessionId: unblockLoginInfo.unblockSessionId,
            },
            body: {
                beneficiary_country: account.country.code,
                main_beneficiary: true,
                account_details: (() => {
                    switch (account.bankDetails.type) {
                        case 'ngn':
                            return {
                                currency: account.currency.code,
                                account_number:
                                    account.bankDetails.accountNumber,
                                bank_code: account.bankDetails.bankCode,
                            }
                        case 'uk':
                            return {
                                currency: account.currency.code,
                                account_number:
                                    account.bankDetails.accountNumber,
                                sort_code: account.bankDetails.sortCode,
                            }
                        case 'iban':
                            return {
                                currency: account.currency.code,
                                iban: account.bankDetails.iban,
                            }
                        default:
                            notReachable(account.bankDetails)
                    }
                })(),
            },
        },
        signal
    )
        .then((data) =>
            object(data)
                .andThen((obj) => string(obj.uuid))
                .getSuccessResultOrThrow(
                    'Failed to parse offramp account uuid after creation'
                )
        )
        .then((uuid) =>
            fetchOffRampAccount({
                accountUuid: uuid,
                unblockLoginInfo,
                bankTransferInfo,
                currencies,
                signal,
            })
        )
