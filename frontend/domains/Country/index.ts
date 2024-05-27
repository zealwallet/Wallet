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

export const TIMEZONES: Record<string, { codes: CountryISOCode[] }> = {
    'Africa/Abidjan': {
        codes: ['CI', 'BF', 'GH', 'GM', 'GN', 'ML', 'MR', 'SL', 'SN', 'TG'],
    },
    'Africa/Accra': {
        codes: ['GH'],
    },
    'Africa/Addis_Ababa': {
        codes: ['ET'],
    },
    'Africa/Algiers': {
        codes: ['DZ'],
    },
    'Africa/Asmara': {
        codes: ['ER'],
    },
    'Africa/Asmera': {
        codes: ['ER'],
    },
    'Africa/Bamako': {
        codes: ['ML'],
    },
    'Africa/Bangui': {
        codes: ['CF'],
    },
    'Africa/Banjul': {
        codes: ['GM'],
    },
    'Africa/Bissau': {
        codes: ['GW'],
    },
    'Africa/Blantyre': {
        codes: ['MW'],
    },
    'Africa/Brazzaville': {
        codes: ['CG'],
    },
    'Africa/Bujumbura': {
        codes: ['BI'],
    },
    'Africa/Cairo': {
        codes: ['EG'],
    },
    'Africa/Casablanca': {
        codes: ['MA'],
    },
    'Africa/Ceuta': {
        codes: ['ES'],
    },
    'Africa/Conakry': {
        codes: ['GN'],
    },
    'Africa/Dakar': {
        codes: ['SN'],
    },
    'Africa/Dar_es_Salaam': {
        codes: ['TZ'],
    },
    'Africa/Djibouti': {
        codes: ['DJ'],
    },
    'Africa/Douala': {
        codes: ['CM'],
    },

    'Africa/Freetown': {
        codes: ['SL'],
    },
    'Africa/Gaborone': {
        codes: ['BW'],
    },
    'Africa/Harare': {
        codes: ['ZW'],
    },
    'Africa/Johannesburg': {
        codes: ['ZA', 'LS', 'SZ'],
    },
    'Africa/Juba': {
        codes: ['SS'],
    },
    'Africa/Kampala': {
        codes: ['UG'],
    },
    'Africa/Khartoum': {
        codes: ['SD'],
    },
    'Africa/Kigali': {
        codes: ['RW'],
    },
    'Africa/Kinshasa': {
        codes: ['CD'],
    },
    'Africa/Lagos': {
        codes: ['NG', 'AO', 'BJ', 'CD', 'CF', 'CG', 'CM', 'GA', 'GQ', 'NE'],
    },
    'Africa/Libreville': {
        codes: ['GA'],
    },
    'Africa/Lome': {
        codes: ['TG'],
    },
    'Africa/Luanda': {
        codes: ['AO'],
    },
    'Africa/Lubumbashi': {
        codes: ['CD'],
    },
    'Africa/Lusaka': {
        codes: ['ZM'],
    },
    'Africa/Malabo': {
        codes: ['GQ'],
    },
    'Africa/Maputo': {
        codes: ['MZ', 'BI', 'BW', 'CD', 'MW', 'RW', 'ZM', 'ZW'],
    },
    'Africa/Maseru': {
        codes: ['LS'],
    },
    'Africa/Mbabane': {
        codes: ['SZ'],
    },
    'Africa/Mogadishu': {
        codes: ['SO'],
    },
    'Africa/Monrovia': {
        codes: ['LR'],
    },
    'Africa/Nairobi': {
        codes: ['KE', 'DJ', 'ER', 'ET', 'KM', 'MG', 'SO', 'TZ', 'UG'],
    },
    'Africa/Ndjamena': {
        codes: ['TD'],
    },
    'Africa/Niamey': {
        codes: ['NE'],
    },
    'Africa/Nouakchott': {
        codes: ['MR'],
    },
    'Africa/Ouagadougou': {
        codes: ['BF'],
    },
    'Africa/Porto-Novo': {
        codes: ['BJ'],
    },
    'Africa/Sao_Tome': {
        codes: ['ST'],
    },
    'Africa/Timbuktu': {
        codes: ['ML'],
    },
    'Africa/Tripoli': {
        codes: ['LY'],
    },
    'Africa/Tunis': {
        codes: ['TN'],
    },
    'Africa/Windhoek': {
        codes: ['NA'],
    },
    'America/Adak': {
        codes: ['US'],
    },
    'America/Anchorage': {
        codes: ['US'],
    },
    'America/Anguilla': {
        codes: ['AI'],
    },
    'America/Antigua': {
        codes: ['AG'],
    },
    'America/Araguaina': {
        codes: ['BR'],
    },
    'America/Argentina/Buenos_Aires': {
        codes: ['AR'],
    },
    'America/Argentina/Catamarca': {
        codes: ['AR'],
    },
    'America/Argentina/Cordoba': {
        codes: ['AR'],
    },
    'America/Argentina/Jujuy': {
        codes: ['AR'],
    },
    'America/Argentina/La_Rioja': {
        codes: ['AR'],
    },
    'America/Argentina/Mendoza': {
        codes: ['AR'],
    },
    'America/Argentina/Rio_Gallegos': {
        codes: ['AR'],
    },
    'America/Argentina/Salta': {
        codes: ['AR'],
    },
    'America/Argentina/San_Juan': {
        codes: ['AR'],
    },
    'America/Argentina/San_Luis': {
        codes: ['AR'],
    },
    'America/Argentina/Tucuman': {
        codes: ['AR'],
    },
    'America/Argentina/Ushuaia': {
        codes: ['AR'],
    },
    'America/Aruba': {
        codes: ['AW'],
    },
    'America/Asuncion': {
        codes: ['PY'],
    },
    'America/Atikokan': {
        codes: ['CA'],
    },
    'America/Bahia': {
        codes: ['BR'],
    },
    'America/Bahia_Banderas': {
        codes: ['MX'],
    },
    'America/Barbados': {
        codes: ['BB'],
    },
    'America/Belem': {
        codes: ['BR'],
    },
    'America/Belize': {
        codes: ['BZ'],
    },
    'America/Blanc-Sablon': {
        codes: ['CA'],
    },
    'America/Boa_Vista': {
        codes: ['BR'],
    },
    'America/Bogota': {
        codes: ['CO'],
    },
    'America/Boise': {
        codes: ['US'],
    },
    'America/Cambridge_Bay': {
        codes: ['CA'],
    },
    'America/Campo_Grande': {
        codes: ['BR'],
    },
    'America/Cancun': {
        codes: ['MX'],
    },
    'America/Caracas': {
        codes: ['VE'],
    },
    'America/Cayman': {
        codes: ['KY'],
    },
    'America/Chicago': {
        codes: ['US'],
    },
    'America/Chihuahua': {
        codes: ['MX'],
    },
    'America/Coral_Harbour': {
        codes: ['CA'],
    },
    'America/Costa_Rica': {
        codes: ['CR'],
    },
    'America/Creston': {
        codes: ['CA'],
    },
    'America/Cuiaba': {
        codes: ['BR'],
    },
    'America/Curacao': {
        codes: ['CW'],
    },
    'America/Danmarkshavn': {
        codes: ['GL'],
    },
    'America/Dawson': {
        codes: ['CA'],
    },
    'America/Dawson_Creek': {
        codes: ['CA'],
    },
    'America/Denver': {
        codes: ['US'],
    },
    'America/Detroit': {
        codes: ['US'],
    },
    'America/Dominica': {
        codes: ['DM'],
    },
    'America/Edmonton': {
        codes: ['CA'],
    },
    'America/Eirunepe': {
        codes: ['BR'],
    },
    'America/El_Salvador': {
        codes: ['SV'],
    },
    'America/Fort_Nelson': {
        codes: ['CA'],
    },
    'America/Fortaleza': {
        codes: ['BR'],
    },
    'America/Glace_Bay': {
        codes: ['CA'],
    },
    'America/Goose_Bay': {
        codes: ['CA'],
    },
    'America/Grand_Turk': {
        codes: ['TC'],
    },
    'America/Grenada': {
        codes: ['GD'],
    },
    'America/Guatemala': {
        codes: ['GT'],
    },
    'America/Guayaquil': {
        codes: ['EC'],
    },
    'America/Guyana': {
        codes: ['GY'],
    },
    'America/Halifax': {
        codes: ['CA'],
    },
    'America/Havana': {
        codes: ['CU'],
    },
    'America/Hermosillo': {
        codes: ['MX'],
    },
    'America/Indiana/Indianapolis': {
        codes: ['US'],
    },
    'America/Indiana/Knox': {
        codes: ['US'],
    },
    'America/Indiana/Marengo': {
        codes: ['US'],
    },
    'America/Indiana/Petersburg': {
        codes: ['US'],
    },
    'America/Indiana/Tell_City': {
        codes: ['US'],
    },
    'America/Indiana/Vevay': {
        codes: ['US'],
    },
    'America/Indiana/Vincennes': {
        codes: ['US'],
    },
    'America/Indiana/Winamac': {
        codes: ['US'],
    },
    'America/Inuvik': {
        codes: ['CA'],
    },
    'America/Iqaluit': {
        codes: ['CA'],
    },
    'America/Jamaica': {
        codes: ['JM'],
    },
    'America/Juneau': {
        codes: ['US'],
    },
    'America/Kentucky/Louisville': {
        codes: ['US'],
    },
    'America/Kentucky/Monticello': {
        codes: ['US'],
    },
    'America/Kralendijk': {
        codes: ['BQ'],
    },
    'America/La_Paz': {
        codes: ['BO'],
    },
    'America/Lima': {
        codes: ['PE'],
    },
    'America/Los_Angeles': {
        codes: ['US'],
    },
    'America/Lower_Princes': {
        codes: ['SX'],
    },
    'America/Maceio': {
        codes: ['BR'],
    },
    'America/Managua': {
        codes: ['NI'],
    },
    'America/Manaus': {
        codes: ['BR'],
    },
    'America/Martinique': {
        codes: ['MQ'],
    },
    'America/Matamoros': {
        codes: ['MX'],
    },
    'America/Mazatlan': {
        codes: ['MX'],
    },
    'America/Menominee': {
        codes: ['US'],
    },
    'America/Merida': {
        codes: ['MX'],
    },
    'America/Metlakatla': {
        codes: ['US'],
    },
    'America/Mexico_City': {
        codes: ['MX'],
    },

    'America/Moncton': {
        codes: ['CA'],
    },
    'America/Monterrey': {
        codes: ['MX'],
    },
    'America/Montevideo': {
        codes: ['UY'],
    },
    'America/Montreal': {
        codes: ['CA'],
    },
    'America/Montserrat': {
        codes: ['MS'],
    },
    'America/Nassau': {
        codes: ['BS'],
    },
    'America/New_York': {
        codes: ['US'],
    },
    'America/Nipigon': {
        codes: ['CA'],
    },
    'America/Nome': {
        codes: ['US'],
    },
    'America/Noronha': {
        codes: ['BR'],
    },
    'America/North_Dakota/Beulah': {
        codes: ['US'],
    },
    'America/North_Dakota/Center': {
        codes: ['US'],
    },
    'America/North_Dakota/New_Salem': {
        codes: ['US'],
    },
    'America/Nuuk': {
        codes: ['GL'],
    },
    'America/Ojinaga': {
        codes: ['MX'],
    },
    'America/Panama': {
        codes: ['PA', 'CA', 'KY'],
    },
    'America/Pangnirtung': {
        codes: ['CA'],
    },
    'America/Paramaribo': {
        codes: ['SR'],
    },
    'America/Phoenix': {
        codes: ['US', 'CA'],
    },
    'America/Port-au-Prince': {
        codes: ['HT'],
    },
    'America/Port_of_Spain': {
        codes: ['TT'],
    },
    'America/Porto_Velho': {
        codes: ['BR'],
    },
    'America/Puerto_Rico': {
        codes: [
            'PR',
            'AG',
            'CA',
            'AI',
            'AW',
            'BL',
            'BQ',
            'CW',
            'DM',
            'GD',
            'LC',
            'MS',
            'SX',
            'TT',
            'VC',
            'VG',
            'VI',
        ],
    },
    'America/Rainy_River': {
        codes: ['CA'],
    },
    'America/Rankin_Inlet': {
        codes: ['CA'],
    },
    'America/Recife': {
        codes: ['BR'],
    },
    'America/Regina': {
        codes: ['CA'],
    },
    'America/Resolute': {
        codes: ['CA'],
    },
    'America/Rio_Branco': {
        codes: ['BR'],
    },
    'America/Santarem': {
        codes: ['BR'],
    },

    'America/Santo_Domingo': {
        codes: ['DO'],
    },
    'America/Sao_Paulo': {
        codes: ['BR'],
    },
    'America/Scoresbysund': {
        codes: ['GL'],
    },
    'America/Sitka': {
        codes: ['US'],
    },
    'America/St_Barthelemy': {
        codes: ['BL'],
    },
    'America/St_Johns': {
        codes: ['CA'],
    },
    'America/St_Lucia': {
        codes: ['LC'],
    },
    'America/St_Thomas': {
        codes: ['VI'],
    },
    'America/St_Vincent': {
        codes: ['VC'],
    },
    'America/Swift_Current': {
        codes: ['CA'],
    },
    'America/Tegucigalpa': {
        codes: ['HN'],
    },
    'America/Thule': {
        codes: ['GL'],
    },
    'America/Thunder_Bay': {
        codes: ['CA'],
    },
    'America/Tijuana': {
        codes: ['MX'],
    },
    'America/Toronto': {
        codes: ['CA', 'BS'],
    },
    'America/Tortola': {
        codes: ['VG'],
    },
    'America/Vancouver': {
        codes: ['CA'],
    },
    'America/Virgin': {
        codes: ['VI'],
    },
    'America/Whitehorse': {
        codes: ['CA'],
    },
    'America/Winnipeg': {
        codes: ['CA'],
    },
    'America/Yakutat': {
        codes: ['US'],
    },
    'America/Yellowknife': {
        codes: ['CA'],
    },

    'Antarctica/Macquarie': {
        codes: ['AU'],
    },

    'Asia/Aden': {
        codes: ['YE'],
    },
    'Asia/Almaty': {
        codes: ['KZ'],
    },
    'Asia/Amman': {
        codes: ['JO'],
    },
    'Asia/Anadyr': {
        codes: ['RU'],
    },
    'Asia/Aqtau': {
        codes: ['KZ'],
    },
    'Asia/Aqtobe': {
        codes: ['KZ'],
    },
    'Asia/Ashgabat': {
        codes: ['TM'],
    },
    'Asia/Atyrau': {
        codes: ['KZ'],
    },
    'Asia/Baghdad': {
        codes: ['IQ'],
    },
    'Asia/Bahrain': {
        codes: ['BH'],
    },
    'Asia/Baku': {
        codes: ['AZ'],
    },
    'Asia/Bangkok': {
        codes: ['TH', 'KH', 'LA', 'VN'],
    },
    'Asia/Barnaul': {
        codes: ['RU'],
    },
    'Asia/Beirut': {
        codes: ['LB'],
    },
    'Asia/Bishkek': {
        codes: ['KG'],
    },
    'Asia/Brunei': {
        codes: ['BN'],
    },
    'Asia/Chita': {
        codes: ['RU'],
    },
    'Asia/Choibalsan': {
        codes: ['MN'],
    },
    'Asia/Colombo': {
        codes: ['LK'],
    },
    'Asia/Damascus': {
        codes: ['SY'],
    },
    'Asia/Dhaka': {
        codes: ['BD'],
    },
    'Asia/Dili': {
        codes: ['TL'],
    },
    'Asia/Dubai': {
        codes: ['AE', 'OM'],
    },
    'Asia/Dushanbe': {
        codes: ['TJ'],
    },
    'Asia/Famagusta': {
        codes: ['CY'],
    },
    'Asia/Gaza': {
        codes: ['PS'],
    },
    'Asia/Hebron': {
        codes: ['PS'],
    },
    'Asia/Ho_Chi_Minh': {
        codes: ['VN'],
    },
    'Asia/Hong_Kong': {
        codes: ['HK'],
    },
    'Asia/Hovd': {
        codes: ['MN'],
    },
    'Asia/Irkutsk': {
        codes: ['RU'],
    },
    'Asia/Jakarta': {
        codes: ['ID'],
    },
    'Asia/Jayapura': {
        codes: ['ID'],
    },
    'Asia/Jerusalem': {
        codes: ['IL'],
    },
    'Asia/Kabul': {
        codes: ['AF'],
    },
    'Asia/Kamchatka': {
        codes: ['RU'],
    },
    'Asia/Karachi': {
        codes: ['PK'],
    },
    'Asia/Kathmandu': {
        codes: ['NP'],
    },
    'Asia/Khandyga': {
        codes: ['RU'],
    },
    'Asia/Kolkata': {
        codes: ['IN'],
    },
    'Asia/Krasnoyarsk': {
        codes: ['RU'],
    },
    'Asia/Kuala_Lumpur': {
        codes: ['MY'],
    },
    'Asia/Kuching': {
        codes: ['MY'],
    },
    'Asia/Kuwait': {
        codes: ['KW'],
    },
    'Asia/Macau': {
        codes: ['MO'],
    },
    'Asia/Magadan': {
        codes: ['RU'],
    },
    'Asia/Makassar': {
        codes: ['ID'],
    },
    'Asia/Manila': {
        codes: ['PH'],
    },
    'Asia/Muscat': {
        codes: ['OM'],
    },
    'Asia/Nicosia': {
        codes: ['CY'],
    },
    'Asia/Novokuznetsk': {
        codes: ['RU'],
    },
    'Asia/Novosibirsk': {
        codes: ['RU'],
    },
    'Asia/Omsk': {
        codes: ['RU'],
    },
    'Asia/Oral': {
        codes: ['KZ'],
    },
    'Asia/Phnom_Penh': {
        codes: ['KH'],
    },
    'Asia/Pontianak': {
        codes: ['ID'],
    },
    'Asia/Pyongyang': {
        codes: ['KP'],
    },
    'Asia/Qatar': {
        codes: ['QA', 'BH'],
    },
    'Asia/Qostanay': {
        codes: ['KZ'],
    },
    'Asia/Qyzylorda': {
        codes: ['KZ'],
    },
    'Asia/Riyadh': {
        codes: ['SA', 'KW', 'YE'],
    },
    'Asia/Sakhalin': {
        codes: ['RU'],
    },
    'Asia/Samarkand': {
        codes: ['UZ'],
    },
    'Asia/Seoul': {
        codes: ['KR'],
    },

    'Asia/Singapore': {
        codes: ['SG', 'MY'],
    },
    'Asia/Srednekolymsk': {
        codes: ['RU'],
    },
    'Asia/Taipei': {
        codes: ['TW'],
    },
    'Asia/Tashkent': {
        codes: ['UZ'],
    },
    'Asia/Tbilisi': {
        codes: ['GE'],
    },
    'Asia/Tehran': {
        codes: ['IR'],
    },

    'Asia/Thimphu': {
        codes: ['BT'],
    },
    'Asia/Tokyo': {
        codes: ['JP'],
    },
    'Asia/Tomsk': {
        codes: ['RU'],
    },

    'Asia/Ulaanbaatar': {
        codes: ['MN'],
    },

    'Asia/Ust-Nera': {
        codes: ['RU'],
    },
    'Asia/Vientiane': {
        codes: ['LA'],
    },
    'Asia/Vladivostok': {
        codes: ['RU'],
    },
    'Asia/Yakutsk': {
        codes: ['RU'],
    },
    'Asia/Yangon': {
        codes: ['MM'],
    },
    'Asia/Yekaterinburg': {
        codes: ['RU'],
    },
    'Asia/Yerevan': {
        codes: ['AM'],
    },
    'Atlantic/Azores': {
        codes: ['PT'],
    },
    'Atlantic/Bermuda': {
        codes: ['BM'],
    },
    'Atlantic/Canary': {
        codes: ['ES'],
    },
    'Atlantic/Cape_Verde': {
        codes: ['CV'],
    },
    'Atlantic/Faroe': {
        codes: ['FO'],
    },

    'Atlantic/Madeira': {
        codes: ['PT'],
    },
    'Atlantic/Reykjavik': {
        codes: ['IS'],
    },

    'Atlantic/Stanley': {
        codes: ['FK'],
    },
    'Australia/Adelaide': {
        codes: ['AU'],
    },
    'Australia/Brisbane': {
        codes: ['AU'],
    },
    'Australia/Broken_Hill': {
        codes: ['AU'],
    },
    'Australia/Darwin': {
        codes: ['AU'],
    },
    'Australia/Eucla': {
        codes: ['AU'],
    },
    'Australia/Hobart': {
        codes: ['AU'],
    },
    'Australia/Lindeman': {
        codes: ['AU'],
    },
    'Australia/Lord_Howe': {
        codes: ['AU'],
    },
    'Australia/Melbourne': {
        codes: ['AU'],
    },
    'Australia/Perth': {
        codes: ['AU'],
    },
    'Australia/Sydney': {
        codes: ['AU'],
    },
    'Canada/Eastern': {
        codes: ['CA'],
    },
    'Europe/Amsterdam': {
        codes: ['NL'],
    },
    'Europe/Andorra': {
        codes: ['AD'],
    },
    'Europe/Astrakhan': {
        codes: ['RU'],
    },
    'Europe/Athens': {
        codes: ['GR'],
    },
    'Europe/Belfast': {
        codes: ['GB'],
    },
    'Europe/Belgrade': {
        codes: ['RS', 'BA', 'HR', 'ME', 'MK', 'SI'],
    },
    'Europe/Berlin': {
        codes: ['DE'],
    },
    'Europe/Bratislava': {
        codes: ['SK'],
    },
    'Europe/Brussels': {
        codes: ['BE'],
    },
    'Europe/Bucharest': {
        codes: ['RO'],
    },
    'Europe/Budapest': {
        codes: ['HU'],
    },
    'Europe/Busingen': {
        codes: ['DE'],
    },
    'Europe/Chisinau': {
        codes: ['MD'],
    },
    'Europe/Copenhagen': {
        codes: ['DK'],
    },
    'Europe/Dublin': {
        codes: ['IE'],
    },
    'Europe/Gibraltar': {
        codes: ['GI'],
    },
    'Europe/Guernsey': {
        codes: ['GG'],
    },
    'Europe/Helsinki': {
        codes: ['FI', 'AX'],
    },
    'Europe/Isle_of_Man': {
        codes: ['IM'],
    },
    'Europe/Istanbul': {
        codes: ['TR'],
    },
    'Europe/Jersey': {
        codes: ['JE'],
    },
    'Europe/Kaliningrad': {
        codes: ['RU'],
    },
    'Europe/Kiev': {
        codes: ['UA'],
    },
    'Europe/Kirov': {
        codes: ['RU'],
    },
    'Europe/Lisbon': {
        codes: ['PT'],
    },
    'Europe/Ljubljana': {
        codes: ['SI'],
    },
    'Europe/London': {
        codes: ['GB', 'GG', 'IM', 'JE'],
    },
    'Europe/Luxembourg': {
        codes: ['LU'],
    },
    'Europe/Madrid': {
        codes: ['ES'],
    },
    'Europe/Malta': {
        codes: ['MT'],
    },
    'Europe/Mariehamn': {
        codes: ['AX'],
    },
    'Europe/Minsk': {
        codes: ['BY'],
    },
    'Europe/Monaco': {
        codes: ['MC'],
    },
    'Europe/Moscow': {
        codes: ['RU'],
    },
    'Europe/Oslo': {
        codes: ['NO'],
    },
    'Europe/Paris': {
        codes: ['FR'],
    },
    'Europe/Podgorica': {
        codes: ['ME'],
    },
    'Europe/Prague': {
        codes: ['CZ', 'SK'],
    },
    'Europe/Riga': {
        codes: ['LV'],
    },
    'Europe/Rome': {
        codes: ['IT', 'SM', 'VA'],
    },
    'Europe/Samara': {
        codes: ['RU'],
    },
    'Europe/San_Marino': {
        codes: ['SM'],
    },
    'Europe/Sarajevo': {
        codes: ['BA'],
    },
    'Europe/Saratov': {
        codes: ['RU'],
    },
    'Europe/Simferopol': {
        codes: ['UA'],
    },
    'Europe/Skopje': {
        codes: ['MK'],
    },
    'Europe/Sofia': {
        codes: ['BG'],
    },
    'Europe/Stockholm': {
        codes: ['SE'],
    },
    'Europe/Tallinn': {
        codes: ['EE'],
    },
    'Europe/Tirane': {
        codes: ['AL'],
    },
    'Europe/Ulyanovsk': {
        codes: ['RU'],
    },
    'Europe/Uzhgorod': {
        codes: ['UA'],
    },
    'Europe/Vaduz': {
        codes: ['LI'],
    },
    'Europe/Vatican': {
        codes: ['VA'],
    },
    'Europe/Vienna': {
        codes: ['AT'],
    },
    'Europe/Vilnius': {
        codes: ['LT'],
    },
    'Europe/Volgograd': {
        codes: ['RU'],
    },
    'Europe/Warsaw': {
        codes: ['PL'],
    },
    'Europe/Zagreb': {
        codes: ['HR'],
    },
    'Europe/Zaporozhye': {
        codes: ['UA'],
    },
    'Europe/Zurich': {
        codes: ['CH', 'DE', 'LI'],
    },
    GB: {
        codes: ['GB'],
    },
    'GB-Eire': {
        codes: ['GB'],
    },
    'Indian/Antananarivo': {
        codes: ['MG'],
    },
    'Indian/Chagos': {
        codes: ['IO'],
    },
    'Indian/Cocos': {
        codes: ['CC'],
    },
    'Indian/Comoro': {
        codes: ['KM'],
    },
    'Indian/Mahe': {
        codes: ['SC'],
    },
    'Indian/Maldives': {
        codes: ['MV'],
    },
    'Indian/Mauritius': {
        codes: ['MU'],
    },
    NZ: {
        codes: ['NZ'],
    },
    'Pacific/Apia': {
        codes: ['WS'],
    },
    'Pacific/Auckland': {
        codes: ['NZ'],
    },
    'Pacific/Bougainville': {
        codes: ['PG'],
    },
    'Pacific/Chatham': {
        codes: ['NZ'],
    },
    'Pacific/Chuuk': {
        codes: ['FM'],
    },
    'Pacific/Efate': {
        codes: ['VU'],
    },
    'Pacific/Fakaofo': {
        codes: ['TK'],
    },
    'Pacific/Fiji': {
        codes: ['FJ'],
    },
    'Pacific/Funafuti': {
        codes: ['TV'],
    },
    'Pacific/Galapagos': {
        codes: ['EC'],
    },
    'Pacific/Gambier': {
        codes: ['PF'],
    },
    'Pacific/Guadalcanal': {
        codes: ['SB'],
    },
    'Pacific/Guam': {
        codes: ['GU', 'MP'],
    },
    'Pacific/Honolulu': {
        codes: ['US'],
    },
    'Pacific/Kanton': {
        codes: ['KI'],
    },
    'Pacific/Kiritimati': {
        codes: ['KI'],
    },
    'Pacific/Kosrae': {
        codes: ['FM'],
    },
    'Pacific/Kwajalein': {
        codes: ['MH'],
    },
    'Pacific/Majuro': {
        codes: ['MH'],
    },
    'Pacific/Marquesas': {
        codes: ['PF'],
    },
    'Pacific/Nauru': {
        codes: ['NR'],
    },
    'Pacific/Niue': {
        codes: ['NU'],
    },
    'Pacific/Norfolk': {
        codes: ['NF'],
    },
    'Pacific/Pago_Pago': {
        codes: ['AS'],
    },
    'Pacific/Palau': {
        codes: ['PW'],
    },
    'Pacific/Pitcairn': {
        codes: ['PN'],
    },
    'Pacific/Pohnpei': {
        codes: ['FM'],
    },
    'Pacific/Port_Moresby': {
        codes: ['PG'],
    },
    'Pacific/Rarotonga': {
        codes: ['CK'],
    },
    'Pacific/Saipan': {
        codes: ['MP'],
    },
    'Pacific/Samoa': {
        codes: ['WS'],
    },
    'Pacific/Tahiti': {
        codes: ['PF'],
    },
    'Pacific/Tarawa': {
        codes: ['KI'],
    },
    'Pacific/Tongatapu': {
        codes: ['TO'],
    },
    'US/Arizona': {
        codes: ['US'],
    },
    'US/Hawaii': {
        codes: ['US'],
    },
    'US/Samoa': {
        codes: ['WS'],
    },
}
