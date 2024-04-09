import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { CurrencyId } from '@zeal/domains/Currency'

export const DEFAULT_CURRENCY_ID = 'USD' as CurrencyId

export const GELATO_NATIVE_TOKEN_ADDRESS = parseAddress(
    '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
).getSuccessResultOrThrow('Failed to parse constant Gelato native address')
