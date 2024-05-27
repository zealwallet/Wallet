import { FormattedMessage } from 'react-intl'
import { SectionListData } from 'react-native'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { ListItem } from '@zeal/uikit/ListItem'
import { ProgressSpinner } from '@zeal/uikit/ProgressSpinner'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { SectionList } from '@zeal/uikit/SectionList'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { Result } from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { format as formatAddress } from '@zeal/domains/Address/helpers/format'
import { CryptoCurrency } from '@zeal/domains/Currency'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import { FormattedFeeInDefaultCurrency2 } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import {
    FormattedTokenBalances,
    FormattedTokenBalances2,
} from '@zeal/domains/Money/components/FormattedTokenBalances'
import { Network } from '@zeal/domains/Network'
import { Avatar as NetworkAvatar } from '@zeal/domains/Network/components/Avatar'
import { Portfolio } from '@zeal/domains/Portfolio'
import { GasAbstractionTransactionFee } from '@zeal/domains/UserOperation'

import { FeeForecastError } from '../validation'

type Props = {
    account: Account
    network: Network
    feeForecastValidation: Result<
        FeeForecastError,
        GasAbstractionTransactionFee
    >
    feeForecast: GasAbstractionTransactionFee[]
    portfolio: Portfolio | null
    pollingInterval: number
    pollingStartedAt: number
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_minimize_click' }
    | {
          type: 'on_4337_gas_currency_selected'
          selectedGasCurrency: CryptoCurrency
          network: Network
      }

const calculateFeeOptionState = (
    feeOption: GasAbstractionTransactionFee,
    feeForecastValidation: Result<
        FeeForecastError,
        GasAbstractionTransactionFee
    >
): 'error' | 'normal' => {
    switch (feeForecastValidation.type) {
        case 'Failure':
            switch (feeForecastValidation.reason.type) {
                case 'insufficient_gas_token_balance':
                    return feeForecastValidation.reason.selectedFee
                        .feeInTokenCurrency.currency.id ===
                        feeOption.feeInTokenCurrency.currency.id
                        ? 'error'
                        : 'normal'
                /* istanbul ignore next */
                default:
                    return notReachable(feeForecastValidation.reason.type)
            }
        case 'Success':
            return 'normal'
        /* istanbul ignore next */
        default:
            return notReachable(feeForecastValidation)
    }
}

export const GasCurrencySelector = ({
    portfolio,
    feeForecast,
    account,
    network,
    feeForecastValidation,
    pollingStartedAt,
    pollingInterval,
    onMsg,
}: Props) => {
    const selectedFee = (() => {
        switch (feeForecastValidation.type) {
            case 'Failure':
                return feeForecastValidation.reason.selectedFee
            case 'Success':
                return feeForecastValidation.data
            /* istanbul ignore next */
            default:
                return notReachable(feeForecastValidation)
        }
    })()

    const portfolioFees = portfolio
        ? feeForecast.filter((fee) =>
              portfolio.tokens
                  .map((t) => t.balance.currencyId)
                  .includes(fee.feeInTokenCurrency.currency.id)
          )
        : feeForecast

    const nonPortfolioFees = feeForecast.filter(
        (fee) => !portfolioFees.includes(fee)
    )

    const sections: SectionListData<GasAbstractionTransactionFee>[] = [
        {
            data: portfolioFees,
        },
        {
            data: nonPortfolioFees,
        },
    ]

    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                top={
                    <Row spacing={8}>
                        <AccountAvatar size={24} account={account} />
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                            ellipsis
                        >
                            {account.label}
                        </Text>

                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                        >
                            {formatAddress(account.address)}
                        </Text>
                    </Row>
                }
                left={
                    <Clickable onClick={() => onMsg({ type: 'close' })}>
                        <Row spacing={4}>
                            <BackIcon size={24} color="iconDefault" />
                            <Text
                                variant="title3"
                                weight="semi_bold"
                                color="textPrimary"
                            >
                                <FormattedMessage
                                    id="GasCurrencySelector.networkFee"
                                    defaultMessage="Network fee"
                                />
                            </Text>
                        </Row>
                    </Clickable>
                }
                right={
                    <NetworkAvatar
                        currentNetwork={{ type: 'specific_network', network }}
                        size={24}
                    />
                }
            />

            <Column spacing={12} fill shrink>
                <Column spacing={4} shrink>
                    <Row spacing={0}>
                        <Text
                            variant="paragraph"
                            color="textSecondary"
                            weight="regular"
                        >
                            <FormattedMessage
                                id="GasCurrencySelector.payNetworkFeesUsing"
                                defaultMessage="Pay network fees using"
                            />
                        </Text>
                        <Spacer />
                        <ProgressSpinner
                            key={pollingStartedAt}
                            size={20}
                            durationMs={pollingInterval}
                        />
                    </Row>
                    <SectionList
                        variant="grouped"
                        itemSpacing={8}
                        sectionSpacing={8}
                        sections={sections}
                        renderItem={({ item: feeOption }) => (
                            <FeeOptionListItem
                                state={calculateFeeOptionState(
                                    feeOption,
                                    feeForecastValidation
                                )}
                                portfolio={portfolio}
                                key={feeOption.feeInTokenCurrency.currency.id}
                                fee={feeOption}
                                aria-current={
                                    selectedFee.feeInTokenCurrency.currency
                                        .id ===
                                    feeOption.feeInTokenCurrency.currency.id
                                }
                                onClick={() =>
                                    onMsg({
                                        type: 'on_4337_gas_currency_selected',
                                        selectedGasCurrency:
                                            feeOption.feeInTokenCurrency
                                                .currency,
                                        network,
                                    })
                                }
                            />
                        )}
                    />
                </Column>

                <Spacer />

                <Actions>
                    <Button
                        variant="primary"
                        size="regular"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        <FormattedMessage
                            id="GasCurrencySelector.save"
                            defaultMessage="Save"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}

const FeeOptionListItem = ({
    fee,
    portfolio,
    'aria-current': ariaCurrent,
    onClick,
    state,
}: {
    'aria-current': boolean
    fee: GasAbstractionTransactionFee
    portfolio: Portfolio | null
    state: 'normal' | 'error'
    onClick: () => void
}) => {
    const portfolioTokens = portfolio ? portfolio.tokens : []
    const tokenInPortfolio =
        portfolioTokens.find(
            (token) =>
                token.balance.currencyId === fee.feeInTokenCurrency.currency.id
        ) || null

    const tokenCurrency = fee.feeInTokenCurrency.currency

    const knownCurrencies = fee.feeInDefaultCurrency
        ? {
              [fee.feeInTokenCurrency.currency.id]:
                  fee.feeInTokenCurrency.currency,
              [fee.feeInDefaultCurrency.currency.id]:
                  fee.feeInDefaultCurrency.currency,
          }
        : {
              [fee.feeInTokenCurrency.currency.id]:
                  fee.feeInTokenCurrency.currency,
          }

    const shortTextColor = (() => {
        switch (state) {
            case 'normal':
                return 'textSecondary'
            case 'error':
                return 'textError'

            default:
                return notReachable(state)
        }
    })()

    return (
        <ListItem
            size="large"
            aria-current={ariaCurrent}
            primaryText={tokenCurrency.code}
            onClick={onClick}
            avatar={({ size }) => (
                <Avatar
                    rightBadge={() => null}
                    size={size}
                    currency={tokenCurrency}
                />
            )}
            shortText={
                <Text color={shortTextColor}>
                    <FormattedMessage
                        id="GasCurrencySelector.balance"
                        defaultMessage="Balance: {balance}"
                        values={{
                            balance: tokenInPortfolio ? (
                                <FormattedTokenBalances
                                    knownCurrencies={knownCurrencies}
                                    money={tokenInPortfolio.balance}
                                />
                            ) : (
                                '0'
                            ),
                        }}
                    />
                </Text>
            }
            side={{
                title: (
                    <FormattedTokenBalances2 money={fee.feeInTokenCurrency} />
                ),
                subtitle: fee.feeInDefaultCurrency ? (
                    <FormattedFeeInDefaultCurrency2
                        money={fee.feeInDefaultCurrency}
                    />
                ) : (
                    ' ' // non-breaking-space thing to keep right side at right place
                ),
            }}
        />
    )
}
