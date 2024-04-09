import { FormattedMessage } from 'react-intl'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { CryptoMoney, Money } from '@zeal/domains/Money'
import {
    isGreaterThan,
    isGreaterThan2,
} from '@zeal/domains/Money/helpers/compare'

import { FormattedFeeInNativeTokenCurrency2 } from './FormattedFeeInNativeTokenCurrency'
import {
    FormattedTokenBalances,
    FormattedTokenBalances2,
} from './FormattedTokenBalances'

export type Props = {
    money: Money
    knownCurrencies: KnownCurrencies
}

const MIN_TRUNCATE_LIMIT = '0.001'

/**
 * TODO @resetko-zeal remove this
 * @deprecated use FormattedFeeInDefaultCurrency2 instead if you can
 */
export const TruncatedFeeInNativeTokenCurrency = ({
    knownCurrencies,
    money,
}: Props) => {
    const currency = useCurrencyById(money.currencyId, knownCurrencies)

    if (!currency) {
        return null
    }

    const truncateLimit: Money = {
        currencyId: currency.id,
        amount: amountToBigint(MIN_TRUNCATE_LIMIT, currency.fraction),
    }

    return isGreaterThan(truncateLimit, money) ? (
        <FormattedMessage
            id="money.FormattedFeeInNativeTokenCurrency.truncated"
            defaultMessage="&lt; {limit} {code}"
            values={{
                limit: (
                    <FormattedTokenBalances
                        knownCurrencies={knownCurrencies}
                        money={truncateLimit}
                    />
                ),
                code: currency.code,
            }}
        />
    ) : (
        <FormattedMessage
            id="money.FormattedFeeInNativeTokenCurrency"
            defaultMessage="{amount} {code}"
            values={{
                amount: (
                    <FormattedTokenBalances
                        knownCurrencies={knownCurrencies}
                        money={money}
                    />
                ),
                code: currency.code,
            }}
        />
    )
}

export const TruncatedFeeInNativeTokenCurrency2 = ({
    money,
}: {
    money: CryptoMoney
}) => {
    const currency = money.currency

    const truncateLimit: CryptoMoney = {
        currency,
        amount: amountToBigint(MIN_TRUNCATE_LIMIT, currency.fraction),
    }

    return isGreaterThan2(truncateLimit, money) ? (
        <FormattedMessage
            id="money.FormattedFeeInNativeTokenCurrency.truncated"
            defaultMessage="&lt; {limit} {code}"
            values={{
                limit: <FormattedTokenBalances2 money={truncateLimit} />,
                code: currency.code,
            }}
        />
    ) : (
        <FormattedFeeInNativeTokenCurrency2 money={money} />
    )
}
