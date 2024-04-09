import { useIntl } from 'react-intl'

import { Swap } from '@zeal/uikit/Icon/Swap'
import { Row } from '@zeal/uikit/Row'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { FXRate } from '@zeal/domains/FXRate'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { revert } from '@zeal/domains/FXRate/helpers/revert'
import { Money } from '@zeal/domains/Money'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { moneyToNumber } from '@zeal/domains/Money/helpers/moneyToNumber'

import { Form } from './index'

type Props = {
    form: Form
    fxRate: FXRate
    knownCurrencies: KnownCurrencies
    onClick: (amount: string) => void
}

export const SecondaryAmountButton = ({
    form,
    knownCurrencies,
    fxRate,
    onClick,
}: Props) => {
    const { formatNumber } = useIntl()

    if (!form.token.priceInDefaultCurrency) {
        return null
    }

    const defaultCurrency =
        knownCurrencies[form.token.priceInDefaultCurrency.currencyId]

    const tokenCurrency = knownCurrencies[form.token.balance.currencyId]

    switch (form.type) {
        case 'amount_in_tokens': {
            const tokenAmount: Money = {
                amount: amountToBigint(form.amount, tokenCurrency.fraction),
                currencyId: form.token.balance.currencyId,
            }

            const amountInDefaultCurrency = applyRate(
                tokenAmount,
                fxRate,
                knownCurrencies
            )

            return (
                <Tertiary
                    color="on_light"
                    size="regular"
                    onClick={() => {
                        onClick(
                            formatNumber(
                                moneyToNumber(
                                    amountInDefaultCurrency,
                                    knownCurrencies
                                ),
                                {
                                    useGrouping: false,
                                    maximumFractionDigits: 2,
                                    roundingPriority: 'morePrecision',
                                    signDisplay: 'never' as const,
                                }
                            )
                        )
                    }}
                >
                    {({ color, textVariant, textWeight }) => (
                        <Row spacing={3}>
                            <Swap size={14} color={color} />
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedTokenBalanceInDefaultCurrency
                                    money={amountInDefaultCurrency}
                                    knownCurrencies={knownCurrencies}
                                />
                            </Text>
                        </Row>
                    )}
                </Tertiary>
            )
        }
        case 'amount_in_default_currency': {
            const amountInDefaultCurrency: Money = {
                amount: amountToBigint(form.amount, defaultCurrency.fraction),
                currencyId: defaultCurrency.id,
            }

            const revertedRate = revert(fxRate, knownCurrencies)

            const tokenAmount = applyRate(
                amountInDefaultCurrency,
                revertedRate,
                knownCurrencies
            )

            return (
                <Tertiary
                    color="on_light"
                    size="regular"
                    onClick={() => {
                        onClick(
                            formatNumber(
                                moneyToNumber(tokenAmount, knownCurrencies),
                                {
                                    useGrouping: false,
                                    maximumFractionDigits: 2,
                                    signDisplay: 'never' as const,
                                }
                            )
                        )
                    }}
                >
                    {({ color, textVariant, textWeight }) => (
                        <Row spacing={3}>
                            <Swap size={14} color={color} />
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                {tokenCurrency.symbol}
                            </Text>
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedTokenBalances
                                    money={tokenAmount}
                                    knownCurrencies={knownCurrencies}
                                />
                            </Text>
                        </Row>
                    )}
                </Tertiary>
            )
        }
        /* istanbul ignore next */
        default:
            return notReachable(form)
    }
}
