import {
    nullable,
    object,
    oneOf,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { fromString as parseAddressFromString } from '@zeal/domains/Address/helpers/fromString'

export const parse = (value: unknown): Result<unknown, Account> =>
    object(value).andThen((acc) =>
        shape({
            label: string(acc.label),
            address: string(acc.address).andThen(parseAddressFromString),
            avatarSrc: oneOf(acc.avatarSrc, [
                string(acc.avatarSrc),
                nullable(acc.avatarSrc),
            ]),
        })
    )
