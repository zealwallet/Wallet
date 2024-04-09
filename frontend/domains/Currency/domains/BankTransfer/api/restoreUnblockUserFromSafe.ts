import { post } from '@zeal/api/request'

import {
    nullable,
    object,
    oneOf,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { Safe4337 } from '@zeal/domains/KeyStore'

type Data =
    | { type: 'user_not_found' }
    | { type: 'unblock_user_restored'; unblockUserId: string }

const parseResponse = (response: unknown): Data =>
    object(response)
        .andThen((obj) =>
            oneOf(obj, [
                shape({
                    type: success('user_not_found' as const),
                    unblockUserId: nullable(obj.unblockUserId),
                }),
                shape({
                    type: success('unblock_user_restored' as const),
                    unblockUserId: string(obj.unblockUserId),
                }),
            ])
        )
        .getSuccessResultOrThrow(
            'Unable to parse response from unblock user restore response'
        )

export const restoreUnblockUserFromSafe = async ({
    keystore,
    signal,
}: {
    keystore: Safe4337
    signal?: AbortSignal
}): Promise<Data> => {
    const {
        passkeyOwner: { recoveryId },
    } = keystore.safeDeplymentConfig

    const response = await post(
        `/wallet/smart-wallet/unblock/${recoveryId}/recover`,
        { body: {} },
        signal
    )
    return parseResponse(response)
}
