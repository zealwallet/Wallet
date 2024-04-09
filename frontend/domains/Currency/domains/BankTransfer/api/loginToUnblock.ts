import { post } from '@zeal/api/request'

import { object, Result, shape, string } from '@zeal/toolkit/Result'

import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'

export type UnblockLoginInfo = {
    unblockUserId: string
    unblockSessionId: string
}

export const parseUnblockLoginInfo = (
    input: unknown
): Result<unknown, UnblockLoginInfo> =>
    object(input).andThen((obj) =>
        shape({
            unblockUserId: string(obj.user_uuid),
            unblockSessionId: string(obj.unblock_session_id),
        })
    )

export const loginToUnblock = async ({
    message,
    signature,
    signal,
}: UnblockLoginSignature & {
    signal?: AbortSignal
}): Promise<UnblockLoginInfo> =>
    post(
        '/wallet/unblock/',
        {
            body: { message, signature },
            query: { path: '/auth/login' },
            auth: { type: 'message_and_signature', message, signature },
        },
        signal
    ).then((data) =>
        parseUnblockLoginInfo(data).getSuccessResultOrThrow(
            'failed to parse unblock login response'
        )
    )
