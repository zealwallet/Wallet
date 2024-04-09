import { post } from '@zeal/api/request'

import {
    parseUnblockLoginInfo,
    UnblockLoginInfo,
} from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'

export type CheckOTPRequest = {
    otp: string
    unblockUserId: string
}

type Params = {
    checkOtpRequest: CheckOTPRequest
    signal?: AbortSignal
}

export const submitOTP = async ({
    checkOtpRequest,
}: Params): Promise<UnblockLoginInfo> => {
    const res = await post('/wallet/smart-wallet/unblock/', {
        query: {
            path: '/auth/otp',
        },
        body: {
            one_time_password: checkOtpRequest.otp,
            user_uuid: checkOtpRequest.unblockUserId,
        },
    })

    return parseUnblockLoginInfo(res).getSuccessResultOrThrow(
        'cannot parse login with otp'
    )
}
