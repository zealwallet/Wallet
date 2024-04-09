import { post } from '@zeal/api/request'

import { match, object } from '@zeal/toolkit/Result'

import { CountryISOCode } from '@zeal/domains/Country'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'

export type CreateUnblockUserParams = {
    lastName: string
    firstName: string
    email: string
    countryCode: CountryISOCode
    targetAddress: string
}

export const createUnblockUser = ({
    signal,
    user,
    signature,
}: {
    user: CreateUnblockUserParams
    signature: UnblockLoginSignature
    signal?: AbortSignal
}): Promise<void> =>
    post(
        '/wallet/unblock/',
        {
            body: {
                first_name: user.firstName,
                last_name: user.lastName,
                target_address: user.targetAddress,
                email: user.email,
                country: user.countryCode,
            },
            query: {
                path: '/user',
            },
            auth: {
                type: 'message_and_signature',
                message: signature.message,
                signature: signature.signature,
            },
        },
        signal
    ).then((data) =>
        object(data)
            .andThen((obj) => match(obj.status, 'CREATED'))
            .map(() => undefined)
            .getSuccessResultOrThrow('failed to parse user creation response')
    )
