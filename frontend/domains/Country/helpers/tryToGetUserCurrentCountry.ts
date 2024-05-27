import { failure, Result, success } from '@zeal/toolkit/Result'

import { COUNTRIES_MAP, Country, TIMEZONES } from '@zeal/domains/Country'

export const tryToGetUserCurrentCountry = (): Result<unknown, Country> => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    if (!timezone) {
        return failure('no_timezone')
    }
    const config = TIMEZONES[timezone]
    if (!config) {
        return failure('no config for timezone')
    }
    const code = config.codes[0]
    return success(COUNTRIES_MAP[code])
}
