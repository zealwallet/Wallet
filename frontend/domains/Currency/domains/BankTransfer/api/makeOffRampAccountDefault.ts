import { patch } from '@zeal/api/request'

import { OffRampAccount } from '@zeal/domains/Currency/domains/BankTransfer'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

export const makeOffRampAccountDefault = ({
    unblockLoginInfo,
    bankTransferInfo,
    offRampAccount,
    signal,
}: {
    offRampAccount: OffRampAccount
    bankTransferInfo: BankTransferUnblockUserCreated
    unblockLoginInfo: UnblockLoginInfo
    signal?: AbortSignal
}): Promise<void> =>
    patch(
        '/wallet/smart-wallet/unblock/',
        {
            query: {
                path: '/user/bank-account/remote',
            },
            auth: {
                type: 'session_id',
                sessionId: unblockLoginInfo.unblockSessionId,
            },
            body: {
                remote_bank_account_uuid: offRampAccount.uuid,
            },
        },
        signal
    ).then(() => undefined)
