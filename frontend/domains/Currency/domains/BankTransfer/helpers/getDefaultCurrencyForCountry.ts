import { notReachable } from '@zeal/toolkit'

import { CountryISOCode } from '@zeal/domains/Country'
import { CurrencyId, FiatCurrency } from '@zeal/domains/Currency'

export const defaultCurrencyForCountryCode = (
    countryCode: CountryISOCode,
    fiatCurrencies: Record<CurrencyId, FiatCurrency>
): FiatCurrency => {
    switch (countryCode) {
        case 'GB':
            return fiatCurrencies.GBP

        case 'NG':
            return fiatCurrencies.NGN

        case 'AT': // Austria
        case 'BE': // Belgium
        case 'BG': // Bulgaria
        case 'CY': // Cyprus
        case 'CZ': // Czechia (Czech Republic)
        case 'DE': // Germany
        case 'DK': // Denmark
        case 'EE': // Estonia
        case 'ES': // Spain
        case 'FI': // Finland
        case 'FR': // France
        case 'GR': // Greece
        case 'HR': // Croatia
        case 'HU': // Hungary
        case 'IE': // Ireland
        case 'IT': // Italy
        case 'LT': // Lithuania
        case 'LU': // Luxembourg
        case 'LV': // Latvia
        case 'MT': // Malta
        case 'NL': // Netherlands
        case 'PL': // Poland
        case 'PT': // Portugal
        case 'RO': // Romania
        case 'SE': // Sweden
        case 'SI': // Slovenia
        case 'SK': // Slovakia
        case 'AD':
        case 'AE':
        case 'AF':
        case 'AG':
        case 'AI':
        case 'AL':
        case 'AM':
        case 'AO':
        case 'AR':
        case 'AS':
        case 'AU':
        case 'AW':
        case 'AX':
        case 'AZ':
        case 'BA':
        case 'BB':
        case 'BD':
        case 'BF':
        case 'BH':
        case 'BI':
        case 'BJ':
        case 'BL':
        case 'BM':
        case 'BN':
        case 'BO':
        case 'BQ':
        case 'BR':
        case 'BS':
        case 'BT':
        case 'BW':
        case 'BY':
        case 'BZ':
        case 'CA':
        case 'CC':
        case 'CD':
        case 'CF':
        case 'CG':
        case 'CH':
        case 'CI':
        case 'CK':
        case 'CM':
        case 'CO':
        case 'CR':
        case 'CU':
        case 'CV':
        case 'CW':
        case 'DJ':
        case 'DM':
        case 'DO':
        case 'DZ':
        case 'EC':
        case 'EG':
        case 'ER':
        case 'ET':
        case 'FJ':
        case 'FK':
        case 'FM':
        case 'FO':
        case 'GA':
        case 'GD':
        case 'GE':
        case 'GG':
        case 'GH':
        case 'GI':
        case 'GL':
        case 'GM':
        case 'GN':
        case 'GQ':
        case 'GT':
        case 'GU':
        case 'GW':
        case 'GY':
        case 'HK':
        case 'HN':
        case 'HT':
        case 'ID':
        case 'IL':
        case 'IM':
        case 'IN':
        case 'IO':
        case 'IQ':
        case 'IR':
        case 'IS':
        case 'JE':
        case 'JM':
        case 'JO':
        case 'JP':
        case 'KE':
        case 'KG':
        case 'KH':
        case 'KI':
        case 'KM':
        case 'KP':
        case 'KR':
        case 'KW':
        case 'KY':
        case 'KZ':
        case 'LA':
        case 'LB':
        case 'LC':
        case 'LI':
        case 'LK':
        case 'LR':
        case 'LS':
        case 'LY':
        case 'MA':
        case 'MC':
        case 'MD':
        case 'ME':
        case 'MG':
        case 'MH':
        case 'MK':
        case 'ML':
        case 'MM':
        case 'MN':
        case 'MO':
        case 'MP':
        case 'MQ':
        case 'MR':
        case 'MS':
        case 'MU':
        case 'MV':
        case 'MW':
        case 'MX':
        case 'MY':
        case 'MZ':
        case 'NA':
        case 'NE':
        case 'NF':
        case 'NI':
        case 'NO':
        case 'NP':
        case 'NR':
        case 'NU':
        case 'NZ':
        case 'OM':
        case 'PA':
        case 'PE':
        case 'PF':
        case 'PG':
        case 'PH':
        case 'PK':
        case 'PN':
        case 'PR':
        case 'PS':
        case 'PW':
        case 'PY':
        case 'QA':
        case 'RS':
        case 'RU':
        case 'RW':
        case 'SA':
        case 'SB':
        case 'SC':
        case 'SD':
        case 'SG':
        case 'SL':
        case 'SM':
        case 'SN':
        case 'SO':
        case 'SR':
        case 'SS':
        case 'ST':
        case 'SV':
        case 'SX':
        case 'SY':
        case 'SZ':
        case 'TC':
        case 'TD':
        case 'TG':
        case 'TH':
        case 'TJ':
        case 'TK':
        case 'TL':
        case 'TM':
        case 'TN':
        case 'TO':
        case 'TR':
        case 'TT':
        case 'TV':
        case 'TW':
        case 'TZ':
        case 'UA':
        case 'UG':
        case 'US':
        case 'UY':
        case 'UZ':
        case 'VA':
        case 'VC':
        case 'VE':
        case 'VG':
        case 'VI':
        case 'VN':
        case 'VU':
        case 'WS':
        case 'YE':
        case 'ZA':
        case 'ZM':
        case 'ZW':
            return fiatCurrencies.EUR

        default:
            return notReachable(countryCode)
    }
}
