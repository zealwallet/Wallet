import { KnownCurrencies } from '@zeal/domains/Currency'
import { USD } from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { Money } from '@zeal/domains/Money'

export const getCryptoAmountInDefaultCurrency = (
    crypto: Money,
    knownCurrencies: KnownCurrencies
): Money =>
    applyRate(
        crypto,
        {
            base: crypto.currencyId,
            quote: USD.id,
            rate: amountToBigint('1', USD.rateFraction),
        },
        knownCurrencies
    )
