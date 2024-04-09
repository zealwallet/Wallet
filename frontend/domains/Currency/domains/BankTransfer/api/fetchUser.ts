import { get } from '@zeal/api/request'

import { object } from '@zeal/toolkit/Result'

import { UnblockUser } from '@zeal/domains/Currency/domains/BankTransfer'
import { parseUser } from '@zeal/domains/Currency/domains/BankTransfer/helpers/parseUnblockUser'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

export const fetchUser = ({
    bankTransferInfo,
    signal,
}: {
    bankTransferInfo: BankTransferUnblockUserCreated
    signal?: AbortSignal
}): Promise<UnblockUser> =>
    get(
        '/wallet/smart-wallet/unblock/',
        {
            query: {
                path: `/user`,
            },
            auth: {
                type: 'unblock_user_id',
                userId: bankTransferInfo.unblockUserId,
            },
        },
        signal
    ).then((data) =>
        object(data)
            .andThen(parseUser)
            .getSuccessResultOrThrow(
                'Failed to parse kyc status during fetchUnblockKycStatus'
            )
    )
