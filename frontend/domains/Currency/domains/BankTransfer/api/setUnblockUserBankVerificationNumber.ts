import { patch } from '@zeal/api/request'

import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

export const setUnblockUserBankVerificationNumber = ({
    loginInfo,
    bankVerificationNumber,
    bankTransferInfo,
    signal,
}: {
    loginInfo: UnblockLoginInfo
    bankTransferInfo: BankTransferUnblockUserCreated
    bankVerificationNumber: string
    signal?: AbortSignal
}): Promise<void> =>
    patch(
        '/wallet/smart-wallet/unblock/',
        {
            body: {
                bvn: bankVerificationNumber,
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
