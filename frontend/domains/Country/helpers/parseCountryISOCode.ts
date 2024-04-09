import { failure, Result, string, success } from '@zeal/toolkit/Result'

import { COUNTRIES_MAP, CountryISOCode } from '@zeal/domains/Country'

export const parseCountryISOCode = (
    input: unknown
): Result<unknown, CountryISOCode> =>
    string(input).andThen((str) =>
        COUNTRIES_MAP[str as CountryISOCode]
            ? success(str as CountryISOCode)
            : failure('Invalid country code')
    )
