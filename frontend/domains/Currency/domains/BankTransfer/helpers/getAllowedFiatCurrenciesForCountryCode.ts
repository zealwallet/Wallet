import { notReachable } from '@zeal/toolkit'
import { keys } from '@zeal/toolkit/Object'

import { CountryISOCode } from '@zeal/domains/Country'
import { FiatCurrency } from '@zeal/domains/Currency'
import { BankTransferFiatCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'

export const getAllowedFiatCurrenciesForCountryCode = (
    fiatCurrencies: BankTransferFiatCurrencies,
    countryCode: CountryISOCode
): FiatCurrency[] => {
    switch (countryCode) {
        case 'NG':
            return keys(fiatCurrencies)
                .filter((currencyCode) => {
                    switch (currencyCode) {
                        case 'GBP':
                        case 'EUR':
                        case 'NGN':
                            return true
                        /* istanbul ignore next */
                        default:
                            return notReachable(currencyCode)
                    }
                })
                .map((code) => fiatCurrencies[code])
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
        case 'AT':
        case 'AU':
        case 'AW':
        case 'AX':
        case 'AZ':
        case 'BA':
        case 'BB':
        case 'BD':
        case 'BE':
        case 'BF':
        case 'BG':
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
        case 'CY':
        case 'CZ':
        case 'DE':
        case 'DJ':
        case 'DK':
        case 'DM':
        case 'DO':
        case 'DZ':
        case 'EC':
        case 'EE':
        case 'EG':
        case 'ER':
        case 'ES':
        case 'ET':
        case 'FI':
        case 'FJ':
        case 'FK':
        case 'FM':
        case 'FO':
        case 'FR':
        case 'GA':
        case 'GB':
        case 'GD':
        case 'GE':
        case 'GG':
        case 'GH':
        case 'GI':
        case 'GL':
        case 'GM':
        case 'GN':
        case 'GQ':
        case 'GR':
        case 'GT':
        case 'GU':
        case 'GW':
        case 'GY':
        case 'HK':
        case 'HN':
        case 'HR':
        case 'HT':
        case 'HU':
        case 'ID':
        case 'IE':
        case 'IL':
        case 'IM':
        case 'IN':
        case 'IO':
        case 'IQ':
        case 'IR':
        case 'IS':
        case 'IT':
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
        case 'LT':
        case 'LU':
        case 'LV':
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
        case 'MT':
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
        case 'NL':
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
        case 'PL':
        case 'PN':
        case 'PR':
        case 'PS':
        case 'PT':
        case 'PW':
        case 'PY':
        case 'QA':
        case 'RO':
        case 'RS':
        case 'RU':
        case 'RW':
        case 'SA':
        case 'SB':
        case 'SC':
        case 'SD':
        case 'SE':
        case 'SG':
        case 'SI':
        case 'SK':
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
        case 'ZW': {
            return keys(fiatCurrencies)
                .filter((currencyCode) => {
                    switch (currencyCode) {
                        case 'GBP':
                        case 'EUR':
                            return true
                        case 'NGN':
                            return false
                        /* istanbul ignore next */
                        default:
                            return notReachable(currencyCode)
                    }
                })
                .map((code) => fiatCurrencies[code])
        }
        /* istanbul ignore next */
        default:
            return notReachable(countryCode)
    }
}
