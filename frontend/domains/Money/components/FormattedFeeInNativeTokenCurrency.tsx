import { FormattedMessage } from 'react-intl'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { CryptoMoney, Money } from '@zeal/domains/Money'

import { FormattedTokenBalances2 } from './FormattedTokenBalances'

export type Props = {
    money: Money
    knownCurrencies: KnownCurrencies
}

// TODO @resetko-zeal rename back to FormattedFeeInNativeTokenCurrency
export const FormattedFeeInNativeTokenCurrency2 = ({
    money,
}: {
    money: CryptoMoney
}) => (
    <FormattedMessage
        id="money.FormattedFeeInNativeTokenCurrency"
        defaultMessage="{amount} {code}"
        values={{
            amount: <FormattedTokenBalances2 money={money} />,
            code: money.currency.code,
        }}
    />
)
