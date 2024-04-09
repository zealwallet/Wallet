export type CountryISOCode =
    | 'AD'
    | 'AE'
    | 'AF'
    | 'AG'
    | 'AI'
    | 'AL'
    | 'AM'
    | 'AO'
    | 'AR'
    | 'AS'
    | 'AT'
    | 'AU'
    | 'AW'
    | 'AX'
    | 'AZ'
    | 'BA'
    | 'BB'
    | 'BD'
    | 'BE'
    | 'BF'
    | 'BG'
    | 'BH'
    | 'BI'
    | 'BJ'
    | 'BL'
    | 'BM'
    | 'BN'
    | 'BO'
    | 'BQ'
    | 'BR'
    | 'BS'
    | 'BT'
    | 'BW'
    | 'BY'
    | 'BZ'
    | 'CA'
    | 'CC'
    | 'CD'
    | 'CF'
    | 'CG'
    | 'CH'
    | 'CI'
    | 'CK'
    | 'CM'
    | 'CO'
    | 'CR'
    | 'CU'
    | 'CV'
    | 'CW'
    | 'CY'
    | 'CZ'
    | 'DE'
    | 'DJ'
    | 'DK'
    | 'DM'
    | 'DO'
    | 'DZ'
    | 'EC'
    | 'EE'
    | 'EG'
    | 'ER'
    | 'ES'
    | 'ET'
    | 'FI'
    | 'FJ'
    | 'FK'
    | 'FM'
    | 'FO'
    | 'FR'
    | 'GA'
    | 'GB'
    | 'GD'
    | 'GE'
    | 'GG'
    | 'GH'
    | 'GI'
    | 'GL'
    | 'GM'
    | 'GN'
    | 'GQ'
    | 'GR'
    | 'GT'
    | 'GU'
    | 'GW'
    | 'GY'
    | 'HK'
    | 'HN'
    | 'HR'
    | 'HT'
    | 'HU'
    | 'ID'
    | 'IE'
    | 'IL'
    | 'IM'
    | 'IN'
    | 'IO'
    | 'IQ'
    | 'IR'
    | 'IS'
    | 'IT'
    | 'JE'
    | 'JM'
    | 'JO'
    | 'JP'
    | 'KE'
    | 'KG'
    | 'KH'
    | 'KI'
    | 'KM'
    | 'KP'
    | 'KR'
    | 'KW'
    | 'KY'
    | 'KZ'
    | 'LA'
    | 'LB'
    | 'LC'
    | 'LI'
    | 'LK'
    | 'LR'
    | 'LS'
    | 'LT'
    | 'LU'
    | 'LV'
    | 'LY'
    | 'MA'
    | 'MC'
    | 'MD'
    | 'ME'
    | 'MG'
    | 'MH'
    | 'MK'
    | 'ML'
    | 'MM'
    | 'MN'
    | 'MO'
    | 'MP'
    | 'MQ'
    | 'MR'
    | 'MS'
    | 'MT'
    | 'MU'
    | 'MV'
    | 'MW'
    | 'MX'
    | 'MY'
    | 'MZ'
    | 'NA'
    | 'NE'
    | 'NF'
    | 'NG'
    | 'NI'
    | 'NL'
    | 'NO'
    | 'NP'
    | 'NR'
    | 'NU'
    | 'NZ'
    | 'OM'
    | 'PA'
    | 'PE'
    | 'PF'
    | 'PG'
    | 'PH'
    | 'PK'
    | 'PL'
    | 'PN'
    | 'PR'
    | 'PS'
    | 'PT'
    | 'PW'
    | 'PY'
    | 'QA'
    | 'RO'
    | 'RS'
    | 'RU'
    | 'RW'
    | 'SA'
    | 'SB'
    | 'SC'
    | 'SD'
    | 'SE'
    | 'SG'
    | 'SI'
    | 'SK'
    | 'SL'
    | 'SM'
    | 'SN'
    | 'SO'
    | 'SR'
    | 'SS'
    | 'ST'
    | 'SV'
    | 'SX'
    | 'SY'
    | 'SZ'
    | 'TC'
    | 'TD'
    | 'TG'
    | 'TH'
    | 'TJ'
    | 'TK'
    | 'TL'
    | 'TM'
    | 'TN'
    | 'TO'
    | 'TR'
    | 'TT'
    | 'TV'
    | 'TW'
    | 'TZ'
    | 'UA'
    | 'UG'
    | 'US'
    | 'UY'
    | 'UZ'
    | 'VA'
    | 'VC'
    | 'VE'
    | 'VG'
    | 'VI'
    | 'VN'
    | 'VU'
    | 'WS'
    | 'YE'
    | 'ZA'
    | 'ZM'
    | 'ZW'

export type Country = {
    name: string
    code: CountryISOCode
}

export const COUNTRIES_MAP: Record<CountryISOCode, Country> = {
    AD: { name: 'Andorra', code: 'AD' },
    AE: { name: 'United Arab Emirates (the)', code: 'AE' },
    AF: { name: 'Afghanistan', code: 'AF' },
    AG: { name: 'Antigua and Barbuda', code: 'AG' },
    AI: { name: 'Anguilla', code: 'AI' },
    AL: { name: 'Albania', code: 'AL' },
    AM: { name: 'Armenia', code: 'AM' },
    AO: { name: 'Angola', code: 'AO' },
    AR: { name: 'Argentina', code: 'AR' },
    AS: { name: 'American Samoa', code: 'AS' },
    AT: { name: 'Austria', code: 'AT' },
    AU: { name: 'Australia', code: 'AU' },
    AW: { name: 'Aruba', code: 'AW' },
    AX: { name: 'Åland Islands', code: 'AX' },
    AZ: { name: 'Azerbaijan', code: 'AZ' },
    BA: { name: 'Bosnia and Herzegovina', code: 'BA' },
    BB: { name: 'Barbados', code: 'BB' },
    BD: { name: 'Bangladesh', code: 'BD' },
    BE: { name: 'Belgium', code: 'BE' },
    BF: { name: 'Burkina Faso', code: 'BF' },
    BG: { name: 'Bulgaria', code: 'BG' },
    BH: { name: 'Bahrain', code: 'BH' },
    BI: { name: 'Burundi', code: 'BI' },
    BJ: { name: 'Benin', code: 'BJ' },
    BL: { name: 'Saint Barthélemy', code: 'BL' },
    BM: { name: 'Bermuda', code: 'BM' },
    BN: { name: 'Brunei Darussalam', code: 'BN' },
    BO: { name: 'Bolivia (Plurinational State of)', code: 'BO' },
    BQ: { name: 'Bonaire, Sint Eustatius and Saba', code: 'BQ' },
    BR: { name: 'Brazil', code: 'BR' },
    BS: { name: 'Bahamas (the)', code: 'BS' },
    BT: { name: 'Bhutan', code: 'BT' },
    BW: { name: 'Botswana', code: 'BW' },
    BY: { name: 'Belarus', code: 'BY' },
    BZ: { name: 'Belize', code: 'BZ' },
    CA: { name: 'Canada', code: 'CA' },
    CC: { name: 'Cocos (Keeling) Islands (the)', code: 'CC' },
    CD: { name: 'Congo (the Democratic Republic of the)', code: 'CD' },
    CF: { name: 'Central African Republic (the)', code: 'CF' },
    CG: { name: 'Congo (the)', code: 'CG' },
    CH: { name: 'Switzerland', code: 'CH' },
    CI: { name: "Côte d'Ivoire", code: 'CI' },
    CK: { name: 'Cook Islands (the)', code: 'CK' },
    CM: { name: 'Cameroon', code: 'CM' },
    CO: { name: 'Colombia', code: 'CO' },
    CR: { name: 'Costa Rica', code: 'CR' },
    CU: { name: 'Cuba', code: 'CU' },
    CV: { name: 'Cabo Verde', code: 'CV' },
    CW: { name: 'Curaçao', code: 'CW' },
    CY: { name: 'Cyprus', code: 'CY' },
    CZ: { name: 'Czechia', code: 'CZ' },
    DE: { name: 'Germany', code: 'DE' },
    DJ: { name: 'Djibouti', code: 'DJ' },
    DK: { name: 'Denmark', code: 'DK' },
    DM: { name: 'Dominica', code: 'DM' },
    DO: { name: 'Dominican Republic (the)', code: 'DO' },
    DZ: { name: 'Algeria', code: 'DZ' },
    EC: { name: 'Ecuador', code: 'EC' },
    EE: { name: 'Estonia', code: 'EE' },
    EG: { name: 'Egypt', code: 'EG' },
    ER: { name: 'Eritrea', code: 'ER' },
    ES: { name: 'Spain', code: 'ES' },
    ET: { name: 'Ethiopia', code: 'ET' },
    FI: { name: 'Finland', code: 'FI' },
    FJ: { name: 'Fiji', code: 'FJ' },
    FK: { name: 'Falkland Islands (the) [Malvinas]', code: 'FK' },
    FM: { name: 'Micronesia (Federated States of)', code: 'FM' },
    FO: { name: 'Faroe Islands (the)', code: 'FO' },
    FR: { name: 'France', code: 'FR' },
    GA: { name: 'Gabon', code: 'GA' },
    GB: { name: 'United Kingdom', code: 'GB' },
    GD: { name: 'Grenada', code: 'GD' },
    GE: { name: 'Georgia', code: 'GE' },
    GG: { name: 'Guernsey', code: 'GG' },
    GH: { name: 'Ghana', code: 'GH' },
    GI: { name: 'Gibraltar', code: 'GI' },
    GL: { name: 'Greenland', code: 'GL' },
    GM: { name: 'Gambia (the)', code: 'GM' },
    GN: { name: 'Guinea', code: 'GN' },
    GQ: { name: 'Equatorial Guinea', code: 'GQ' },
    GR: { name: 'Greece', code: 'GR' },
    GT: { name: 'Guatemala', code: 'GT' },
    GU: { name: 'Guam', code: 'GU' },
    GW: { name: 'Guinea-Bissau', code: 'GW' },
    GY: { name: 'Guyana', code: 'GY' },
    HK: { name: 'Hong Kong', code: 'HK' },
    HN: { name: 'Honduras', code: 'HN' },
    HR: { name: 'Croatia', code: 'HR' },
    HT: { name: 'Haiti', code: 'HT' },
    HU: { name: 'Hungary', code: 'HU' },
    ID: { name: 'Indonesia', code: 'ID' },
    IE: { name: 'Ireland', code: 'IE' },
    IL: { name: 'Israel', code: 'IL' },
    IM: { name: 'Isle of Man', code: 'IM' },
    IN: { name: 'India', code: 'IN' },
    IO: { name: 'British Indian Ocean Territory (the)', code: 'IO' },
    IQ: { name: 'Iraq', code: 'IQ' },
    IR: { name: 'Iran (Islamic Republic of)', code: 'IR' },
    IS: { name: 'Iceland', code: 'IS' },
    IT: { name: 'Italy', code: 'IT' },
    JE: { name: 'Jersey', code: 'JE' },
    JM: { name: 'Jamaica', code: 'JM' },
    JO: { name: 'Jordan', code: 'JO' },
    JP: { name: 'Japan', code: 'JP' },
    KE: { name: 'Kenya', code: 'KE' },
    KG: { name: 'Kyrgyzstan', code: 'KG' },
    KH: { name: 'Cambodia', code: 'KH' },
    KI: { name: 'Kiribati', code: 'KI' },
    KM: { name: 'Comoros (the)', code: 'KM' },
    KP: {
        name: "North Korea (the Democratic People's Republic of)",
        code: 'KP',
    },
    KR: { name: 'South Korea (the Republic of)', code: 'KR' },
    KW: { name: 'Kuwait', code: 'KW' },
    KY: { name: 'Cayman Islands (the)', code: 'KY' },
    KZ: { name: 'Kazakhstan', code: 'KZ' },
    LA: { name: "Lao People's Democratic Republic (the)", code: 'LA' },
    LB: { name: 'Lebanon', code: 'LB' },
    LC: { name: 'Saint Lucia', code: 'LC' },
    LI: { name: 'Liechtenstein', code: 'LI' },
    LK: { name: 'Sri Lanka', code: 'LK' },
    LR: { name: 'Liberia', code: 'LR' },
    LS: { name: 'Lesotho', code: 'LS' },
    LT: { name: 'Lithuania', code: 'LT' },
    LU: { name: 'Luxembourg', code: 'LU' },
    LV: { name: 'Latvia', code: 'LV' },
    LY: { name: 'Libya', code: 'LY' },
    MA: { name: 'Morocco', code: 'MA' },
    MC: { name: 'Monaco', code: 'MC' },
    MD: { name: 'Moldova (the Republic of)', code: 'MD' },
    ME: { name: 'Montenegro', code: 'ME' },
    MG: { name: 'Madagascar', code: 'MG' },
    MH: { name: 'Marshall Islands (the)', code: 'MH' },
    MK: { name: 'Republic of North Macedonia', code: 'MK' },
    ML: { name: 'Mali', code: 'ML' },
    MM: { name: 'Myanmar', code: 'MM' },
    MN: { name: 'Mongolia', code: 'MN' },
    MO: { name: 'Macao', code: 'MO' },
    MP: { name: 'Northern Mariana Islands (the)', code: 'MP' },
    MQ: { name: 'Martinique', code: 'MQ' },
    MR: { name: 'Mauritania', code: 'MR' },
    MS: { name: 'Montserrat', code: 'MS' },
    MT: { name: 'Malta', code: 'MT' },
    MU: { name: 'Mauritius', code: 'MU' },
    MV: { name: 'Maldives', code: 'MV' },
    MW: { name: 'Malawi', code: 'MW' },
    MX: { name: 'Mexico', code: 'MX' },
    MY: { name: 'Malaysia', code: 'MY' },
    MZ: { name: 'Mozambique', code: 'MZ' },
    NA: { name: 'Namibia', code: 'NA' },
    NE: { name: 'Niger (the)', code: 'NE' },
    NF: { name: 'Norfolk Island', code: 'NF' },
    NG: { name: 'Nigeria', code: 'NG' },
    NI: { name: 'Nicaragua', code: 'NI' },
    NL: { name: 'Netherlands (the)', code: 'NL' },
    NO: { name: 'Norway', code: 'NO' },
    NP: { name: 'Nepal', code: 'NP' },
    NR: { name: 'Nauru', code: 'NR' },
    NU: { name: 'Niue', code: 'NU' },
    NZ: { name: 'New Zealand', code: 'NZ' },
    OM: { name: 'Oman', code: 'OM' },
    PA: { name: 'Panama', code: 'PA' },
    PE: { name: 'Peru', code: 'PE' },
    PF: { name: 'French Polynesia', code: 'PF' },
    PG: { name: 'Papua New Guinea', code: 'PG' },
    PH: { name: 'Philippines (the)', code: 'PH' },
    PK: { name: 'Pakistan', code: 'PK' },
    PL: { name: 'Poland', code: 'PL' },
    PN: { name: 'Pitcairn', code: 'PN' },
    PR: { name: 'Puerto Rico', code: 'PR' },
    PS: { name: 'Palestine, State of', code: 'PS' },
    PT: { name: 'Portugal', code: 'PT' },
    PW: { name: 'Palau', code: 'PW' },
    PY: { name: 'Paraguay', code: 'PY' },
    QA: { name: 'Qatar', code: 'QA' },
    RO: { name: 'Romania', code: 'RO' },
    RS: { name: 'Serbia', code: 'RS' },
    RU: { name: 'Russian Federation (the)', code: 'RU' },
    RW: { name: 'Rwanda', code: 'RW' },
    SA: { name: 'Saudi Arabia', code: 'SA' },
    SB: { name: 'Solomon Islands', code: 'SB' },
    SC: { name: 'Seychelles', code: 'SC' },
    SD: { name: 'Sudan (the)', code: 'SD' },
    SE: { name: 'Sweden', code: 'SE' },
    SG: { name: 'Singapore', code: 'SG' },
    SI: { name: 'Slovenia', code: 'SI' },
    SK: { name: 'Slovakia', code: 'SK' },
    SL: { name: 'Sierra Leone', code: 'SL' },
    SM: { name: 'San Marino', code: 'SM' },
    SN: { name: 'Senegal', code: 'SN' },
    SO: { name: 'Somalia', code: 'SO' },
    SR: { name: 'Suriname', code: 'SR' },
    SS: { name: 'South Sudan', code: 'SS' },
    ST: { name: 'Sao Tome and Principe', code: 'ST' },
    SV: { name: 'El Salvador', code: 'SV' },
    SX: { name: 'Sint Maarten (Dutch part)', code: 'SX' },
    SY: { name: 'Syrian Arab Republic', code: 'SY' },
    SZ: { name: 'Eswatini', code: 'SZ' },
    TC: { name: 'Turks and Caicos Islands (the)', code: 'TC' },
    TD: { name: 'Chad', code: 'TD' },
    TG: { name: 'Togo', code: 'TG' },
    TH: { name: 'Thailand', code: 'TH' },
    TJ: { name: 'Tajikistan', code: 'TJ' },
    TK: { name: 'Tokelau', code: 'TK' },
    TL: { name: 'Timor-Leste', code: 'TL' },
    TM: { name: 'Turkmenistan', code: 'TM' },
    TN: { name: 'Tunisia', code: 'TN' },
    TO: { name: 'Tonga', code: 'TO' },
    TR: { name: 'Turkey', code: 'TR' },
    TT: { name: 'Trinidad and Tobago', code: 'TT' },
    TV: { name: 'Tuvalu', code: 'TV' },
    TW: { name: 'Taiwan (Province of China)', code: 'TW' },
    TZ: { name: 'Tanzania, United Republic of', code: 'TZ' },
    UA: { name: 'Ukraine', code: 'UA' },
    UG: { name: 'Uganda', code: 'UG' },
    US: { name: 'United States', code: 'US' },
    UY: { name: 'Uruguay', code: 'UY' },
    UZ: { name: 'Uzbekistan', code: 'UZ' },
    VA: { name: 'Holy See (the)', code: 'VA' },
    VC: { name: 'Saint Vincent and the Grenadines', code: 'VC' },
    VE: { name: 'Venezuela (Bolivarian Republic of)', code: 'VE' },
    VG: { name: 'Virgin Islands (British)', code: 'VG' },
    VI: { name: 'Virgin Islands (U.S.)', code: 'VI' },
    VN: { name: 'Viet Nam', code: 'VN' },
    VU: { name: 'Vanuatu', code: 'VU' },
    WS: { name: 'Samoa', code: 'WS' },
    YE: { name: 'Yemen', code: 'YE' },
    ZA: { name: 'South Africa', code: 'ZA' },
    ZM: { name: 'Zambia', code: 'ZM' },
    ZW: { name: 'Zimbabwe', code: 'ZW' },
}
