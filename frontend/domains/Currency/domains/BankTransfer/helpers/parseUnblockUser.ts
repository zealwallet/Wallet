import { notReachable } from '@zeal/toolkit'
import {
    failure,
    nullableOf,
    object,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import {
    KycStatus,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'

type UnblockUserStatus =
    | 'CREATED'
    | 'KYC_NEEDED'
    | 'PENDING_KYC_DATA'
    | 'KYC_PENDING'
    | 'SOFT_KYC_FAILED'
    | 'HARD_KYC_FAILED'
    | 'FULL_USER'
    | 'SUSPENDED'

const unblockUserStatusMap: Record<UnblockUserStatus, true> = {
    CREATED: true,
    KYC_NEEDED: true,
    PENDING_KYC_DATA: true,
    KYC_PENDING: true,
    SOFT_KYC_FAILED: true,
    HARD_KYC_FAILED: true,
    FULL_USER: true,
    SUSPENDED: true,
}

export const parseUser = (input: unknown): Result<unknown, UnblockUser> =>
    object(input).andThen((obj) =>
        shape({
            firstName: string(obj.first_name),
            lastName: string(obj.last_name),
            bankVerificationNumber: nullableOf(obj.bvn, string),
            kycStatus: parseKycStatus(obj.status),
        })
    )

export const parseKycStatus = (input: unknown): Result<unknown, KycStatus> =>
    string(input)
        .andThen((str) =>
            unblockUserStatusMap[str as UnblockUserStatus]
                ? success(str as UnblockUserStatus)
                : failure(`${str} is not a valid Unblock user status`)
        )
        .map((status) => {
            switch (status) {
                case 'CREATED': // Newly created user on Unblock
                case 'KYC_NEEDED': // User has done both an onramp + offramp without KYC - account locked on Unblocked
                case 'PENDING_KYC_DATA': // KYC applicant has been created on Unblock (awaiting document upload)
                    return { type: 'not_started' as const }
                case 'KYC_PENDING': // KYC in progress
                case 'SUSPENDED': // Previous FULL_USER where something needs to be verified again - same as KYC_PENDING
                    return { type: 'in_progress' as const }
                case 'SOFT_KYC_FAILED': // Small data issue (e.g. DOB off by one)
                    return { type: 'paused' as const }
                case 'HARD_KYC_FAILED': // Huge data issue (e.g. nothing matches passport) - manual intervention needed
                    return { type: 'failed' as const }
                case 'FULL_USER': // KYC passed and user can transact without trial limits
                    return { type: 'approved' as const }
                /* istanbul ignore next */
                default:
                    return notReachable(status)
            }
        })
