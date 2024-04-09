import { get, patch, post } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import { object, string } from '@zeal/toolkit/Result'

import { CountryISOCode } from '@zeal/domains/Country'
import { UnblockUser } from '@zeal/domains/Currency/domains/BankTransfer'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import {
    BankTransferUnblockUserCreated,
    SumSubAccessToken,
} from '@zeal/domains/Storage'

export type PersonalDetails = {
    firstName: string
    lastName: string
    dateOfBirth: string
}

export type ResidenceDetails = {
    country: CountryISOCode
    address: string
    postCode: string
    city: string
}

export type PredefinedSourceOfFunds = {
    type: 'salary' | 'business_income' | 'pension'
}

export type SourceOfFundsOther = {
    type: 'other'
    description: string
}

export type KycApplication = {
    personalDetails: PersonalDetails
    residenceDetails: ResidenceDetails
    sourceOfFunds: PredefinedSourceOfFunds | SourceOfFundsOther
}
export const submitUnblockKycApplication = async ({
    loginInfo,
    bankTransferInfo,
    unblockUser,
    application,
    signal,
}: {
    loginInfo: UnblockLoginInfo
    unblockUser: UnblockUser
    application: KycApplication
    bankTransferInfo: BankTransferUnblockUserCreated
    signal?: AbortSignal
}): Promise<SumSubAccessToken> => {
    await updateUserDetails(loginInfo, application, bankTransferInfo, signal)
    const { kycStatus } = unblockUser
    switch (kycStatus.type) {
        case 'not_started':
            await createKycApplicant(loginInfo, application, bankTransferInfo)
            break
        case 'approved':
        case 'paused':
        case 'failed':
        case 'in_progress':
            break
        /* istanbul ignore next */
        default:
            return notReachable(kycStatus)
    }

    return fetchSumSubAccessToken(loginInfo, bankTransferInfo)
}

const updateUserDetails = (
    loginInfo: UnblockLoginInfo,
    application: KycApplication,
    bankTransferInfo: BankTransferUnblockUserCreated,
    signal?: AbortSignal
): Promise<void> =>
    patch(
        '/wallet/smart-wallet/unblock/',
        {
            body: {
                first_name: application.personalDetails.firstName,
                last_name: application.personalDetails.lastName,
                date_of_birth: application.personalDetails.dateOfBirth,
                address: {
                    address_line_1: application.residenceDetails.address,
                    post_code: application.residenceDetails.postCode,
                    city: application.residenceDetails.city,
                    country: application.residenceDetails.country,
                },
            },
            query: {
                path: '/user',
            },
            auth: {
                type: 'session_id',
                sessionId: loginInfo.unblockSessionId,
            },
        },
        signal
    ).then(() => undefined)

const createKycApplicant = (
    loginInfo: UnblockLoginInfo,
    application: KycApplication,
    bankTransferInfo: BankTransferUnblockUserCreated,
    signal?: AbortSignal
): Promise<void> =>
    post(
        '/wallet/smart-wallet/unblock/',
        {
            body: {
                date_of_birth: application.personalDetails.dateOfBirth,
                address: {
                    address_line_1: application.residenceDetails.address,
                    post_code: application.residenceDetails.postCode,
                    city: application.residenceDetails.city,
                    country: application.residenceDetails.country,
                },
                ...getUnblockSourceOfFunds(application.sourceOfFunds),
            },
            query: {
                path: `/user/kyc/applicant`,
            },
            auth: {
                type: 'session_id',
                sessionId: loginInfo.unblockSessionId,
            },
        },
        signal
    ).then(() => undefined)

const fetchSumSubAccessToken = (
    loginInfo: UnblockLoginInfo,
    bankTransferInfo: BankTransferUnblockUserCreated,
    signal?: AbortSignal
): Promise<SumSubAccessToken> =>
    get(
        '/wallet/smart-wallet/unblock/',
        {
            query: {
                path: '/user/kyc/applicant/token',
            },
            auth: {
                type: 'session_id',
                sessionId: loginInfo.unblockSessionId,
            },
        },
        signal
    ).then((result) =>
        object(result)
            .andThen((obj) => string(obj.token))
            .getSuccessResultOrThrow('Unable to parse SumSub access token')
    )

const getUnblockSourceOfFunds = (
    sourceOfFunds: PredefinedSourceOfFunds | SourceOfFundsOther
): {
    source_of_funds: string
    source_of_funds_description: string | null
} => {
    switch (sourceOfFunds.type) {
        case 'salary':
            return {
                source_of_funds: 'SALARY',
                source_of_funds_description: null,
            }
        case 'business_income':
            return {
                source_of_funds: 'BUSINESS_INCOME',
                source_of_funds_description: null,
            }
        case 'pension':
            return {
                source_of_funds: 'PENSION',
                source_of_funds_description: null,
            }
        case 'other':
            return {
                source_of_funds: 'OTHER',
                source_of_funds_description: sourceOfFunds.description,
            }
        /* istanbul ignore next */
        default:
            return notReachable(sourceOfFunds)
    }
}
