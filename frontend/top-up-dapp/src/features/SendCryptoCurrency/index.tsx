import { match, object, shape, string, success } from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { fromString } from '@zeal/domains/Address/helpers/fromString'

import { DataLoader } from './DataLoader'

type SendCryptoCurrencyEntrypoint = {
    type: 'send_crypto_currency'
    account: Account
}

const parseEntrypoint = (input: unknown): SendCryptoCurrencyEntrypoint =>
    object(input)
        .andThen((obj) =>
            shape({
                type: match(obj.type, 'send_crypto_currency'),
                account: shape({
                    address: string(obj.address).andThen((str) =>
                        fromString(decodeURIComponent(str))
                    ),
                    label: string(obj.label).map(decodeURIComponent),
                    avatarSrc: success(null),
                }),
            })
        )
        .getSuccessResultOrThrow('Failed to parse zeal account')

export const SendCryptoCurrency = () => {
    const params = Object.fromEntries(
        new URLSearchParams(window.location.search).entries()
    )

    const entrypoint = parseEntrypoint(params)

    return <DataLoader zealAccount={entrypoint.account} />
}
