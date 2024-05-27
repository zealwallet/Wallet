import { ImperativeError } from '@zeal/toolkit/Error'

import { Address } from '@zeal/domains/Address'
import { fromString } from '@zeal/domains/Address/helpers/fromString'
import { FIAT_CURRENCIES } from '@zeal/domains/Currency/constants'
import { FiatMoney } from '@zeal/domains/Money'

export const getCardTokenFromBalance = (fiatMoney: FiatMoney): Address => {
    const symbol = fiatMoney.currency.symbol

    switch (symbol) {
        case FIAT_CURRENCIES['GBP'].symbol:
            return fromString(
                '0x5cb9073902f2035222b9749f8fb0c9bfe5527108'
            ).getSuccessResultOrThrow(
                'Failed to parse GBPe token address on gnosis'
            )
        case FIAT_CURRENCIES['EUR'].symbol:
            return fromString(
                '0xcb444e90d8198415266c6a2724b7900fb12fc56e'
            ).getSuccessResultOrThrow(
                'Failed to parse EURe token address on gnosis'
            )
        default:
            throw new ImperativeError('Unsupported symbol', { symbol })
    }
}
