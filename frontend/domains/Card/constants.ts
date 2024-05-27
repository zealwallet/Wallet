import { COUNTRIES_MAP, Country, CountryISOCode } from '@zeal/domains/Country'
import { GNOSIS } from '@zeal/domains/Network/constants'

export const countriesSupportedByGnosisPay: Set<CountryISOCode> = new Set([
    'AT',
    'BE',
    'BG',
    'HR',
    'CY',
    'CZ',
    'DK',
    'EE',
    'FI',
    'FR',
    'DE',
    'GR',
    'HU',
    'IS',
    'IE',
    'IT',
    'LV',
    'LI',
    'LT',
    'LU',
    'MT',
    'NL',
    'NO',
    'PL',
    'PT',
    'RO',
    'SK',
    'SI',
    'ES',
    'SE',
    'CH',
    'GB',
])
export const GNOSIS_PAY_SUPPORTED_COUNTRIES: Country[] = Array.from(
    countriesSupportedByGnosisPay
)
    .map((code) => COUNTRIES_MAP[code])
    .sort((a, b) => a.name.localeCompare(b.name))

export const CARD_NETWORK = GNOSIS

export const SENSITIVE_SECRET_VIEW_TIMEOUT_SECONDS = 15
