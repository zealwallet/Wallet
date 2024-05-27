import { values } from '@zeal/toolkit/Object'

import { COUNTRIES_MAP, Country, CountryISOCode } from '@zeal/domains/Country'
import { FiatCurrency } from '@zeal/domains/Currency'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { Money } from '@zeal/domains/Money'
import { Network } from '@zeal/domains/Network'
import { POLYGON } from '@zeal/domains/Network/constants'

export const USD: FiatCurrency = {
    type: 'FiatCurrency',
    id: 'USD',
    symbol: '$',
    code: 'USD',
    fraction: 18,
    rateFraction: 18,
    icon: 'TODO',
    name: 'USD',
}
export const BANK_TRANSFER_NETWORK: Network = POLYGON

export const PRE_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY: Money = {
    amount: amountToBigint('400', USD.fraction),
    currencyId: USD.id,
}

export const POST_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY: Money = {
    amount: amountToBigint('100000', USD.fraction),
    currencyId: USD.id,
}

export const MONTHLY_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY: Money = {
    amount: amountToBigint('5000', USD.fraction),
    currencyId: USD.id,
}

export const MINIMUM_TRANSFER_AMOUNT_IN_DEFAULT_CURRENCY: Money = {
    amount: amountToBigint('2', USD.fraction),
    currencyId: USD.id,
}

export const OFF_RAMP_SERVICE_TIME_MS = 120_000

export const ON_RAMP_SERVICE_TIME_MS = 120_000
export const SUPPORT_SOFT_DEADLINE_MS = 60_000 * 60 * 24

const countriesUnsupportedByUnblock: Partial<Record<CountryISOCode, true>> = {
    AF: true, // Afghanistan
    AL: true, // Albania
    AM: true, // Armenia
    AZ: true, // Azerbaijan
    BB: true, // Barbados
    BF: true, // Burkina Faso
    BI: true, // Burundi
    BW: true, // Botswana
    BY: true, // Belarus
    CD: true, // Democratic People's Republic of Congo
    CF: true, // Central African Republic
    CU: true, // Cuba
    GH: true, // Ghana
    GN: true, // Guinea
    GW: true, // Guinea-Bissau
    HT: true, // Haiti
    IQ: true, // Iraq
    IR: true, // Iran
    JM: true, // Jamaica
    JO: true, // Jordan
    JP: true, // Japan
    KG: true, // Kyrgyzstan
    KH: true, // Cambodia
    KP: true, // North Korea
    KZ: true, // Kazakhstan
    LY: true, // Libya
    MA: true, // Morocco
    MD: true, // Moldova
    ML: true, // Mali
    MM: true, // Myanmar
    MZ: true, // Mozambique
    NI: true, // Nicaragua
    PA: true, // Panama
    PH: true, // Philippines
    PK: true, // Pakistan
    PS: true, // Palestine
    RU: true, // Russia
    SD: true, // Sudan
    SN: true, // Senegal
    SO: true, // Somalia
    SS: true, // South Sudan
    SY: true, // Syria
    TJ: true, // Tajikistan
    TM: true, // Turkmenistan
    TN: true, // Tunisia
    TR: true, // Turkey
    TT: true, // Trinidad & Tobago
    TZ: true, // Tanzania
    UA: true, // Ukraine
    UG: true, // Uganda
    US: true, // United States
    UZ: true, // Uzbekistan
    VE: true, // Venezuela
    VU: true, // Vanuatu
    YE: true, // Yemen
    ZW: true, // Zimbabwe
}

export const UNBLOCK_SUPPORTED_COUNTRIES: Country[] = values(COUNTRIES_MAP)
    .filter((country) => !countriesUnsupportedByUnblock[country.code])
    .sort((a, b) => a.name.localeCompare(b.name))
