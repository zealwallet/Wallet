import { get } from '@zeal/api/request'

import {
    array,
    failure,
    object,
    Result,
    string,
    success,
} from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { fromString as parseAddressFromString } from '@zeal/domains/Address/helpers/fromString'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

type Params = {
    bankTransferInfo: BankTransferUnblockUserCreated
    unblockLoginInfo: UnblockLoginInfo
    signal?: AbortSignal
}

export const fetchUserOffRampAddress = ({
    unblockLoginInfo,
    bankTransferInfo,
    signal,
}: Params): Promise<Address> =>
    get(
        '/wallet/smart-wallet/unblock/',
        {
            query: {
                path: `/user/wallet/polygon`,
            },
            auth: {
                type: 'session_id',
                sessionId: unblockLoginInfo.unblockSessionId,
            },
        },
        signal
    ).then((response) =>
        parseUserOffRampAddress(response).getSuccessResultOrThrow(
            'Faield to parse offramp address'
        )
    )

const parseUserOffRampAddress = (input: unknown): Result<unknown, Address> =>
    array(input)
        .andThen((arr) =>
            arr.length === 0
                ? failure({ type: 'address_array_is_empty' })
                : success(arr[0])
        )
        .andThen(object)
        .andThen((obj) => string(obj.address))
        .andThen(parseAddressFromString)
