import { post } from '@zeal/api/request'

type Params = {
    unblockUserId: string
    signal?: AbortSignal
}
export const requestOTP = ({
    unblockUserId,
    signal,
}: Params): Promise<unknown> =>
    post(
        '/wallet/smart-wallet/unblock/',
        {
            body: {
                user_uuid: unblockUserId,
            },
            query: {
                path: '/auth/login',
            },
        },
        signal
    )
