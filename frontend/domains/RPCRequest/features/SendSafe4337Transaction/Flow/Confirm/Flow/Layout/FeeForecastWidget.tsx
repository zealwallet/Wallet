import { FormattedMessage } from 'react-intl'

import { FeeInputButton } from '@zeal/uikit/FeeInputButton'
import { BoldEdit } from '@zeal/uikit/Icon/BoldEdit'
import { ProgressSpinner } from '@zeal/uikit/ProgressSpinner'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { Result } from '@zeal/toolkit/Result'

import { CryptoCurrency } from '@zeal/domains/Currency'
import { FormattedFeeInDefaultCurrency2 } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import { FormattedTokenBalances2 } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { TruncatedFeeInNativeTokenCurrency2 } from '@zeal/domains/Money/components/TruncatedFeeInNativeTokenCurrency'
import { GasAbstractionTransactionFee } from '@zeal/domains/UserOperation'

import { FeeForecastError } from '../validation'

type Props = {
    feeForecast: GasAbstractionTransactionFee[]
    feeForecastValidation: Result<
        FeeForecastError,
        GasAbstractionTransactionFee
    >
    pollingInterval: number
    pollingStartedAt: number
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_fee_forecast_click' }

export const FeeForecastWidget = ({
    pollingInterval,
    pollingStartedAt,
    feeForecastValidation,
    onMsg,
}: Props) => {
    switch (feeForecastValidation.type) {
        case 'Failure':
            return (
                <EditFeeButton
                    pollingStartedAt={pollingStartedAt}
                    pollingInterval={pollingInterval}
                    selectedFee={feeForecastValidation.reason.selectedFee}
                    error={feeForecastValidation.reason}
                    onMsg={onMsg}
                />
            )
        case 'Success':
            return (
                <EditFeeButton
                    pollingStartedAt={pollingStartedAt}
                    pollingInterval={pollingInterval}
                    selectedFee={feeForecastValidation.data}
                    error={null}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(feeForecastValidation)
    }
}

const EditFeeButton = ({
    pollingStartedAt,
    pollingInterval,
    selectedFee,
    error,
    onMsg,
}: {
    selectedFee: GasAbstractionTransactionFee
    pollingInterval: number
    pollingStartedAt: number
    error: FeeForecastError | null
    onMsg: (msg: Msg) => void
}) => {
    const selectedGasCurrency = selectedFee.feeInTokenCurrency.currency

    return (
        <FeeInputButton
            errored={!!error}
            onClick={() => onMsg({ type: 'on_fee_forecast_click' })}
            left={
                <Row spacing={4}>
                    <Text
                        variant="paragraph"
                        weight="regular"
                        color="textPrimary"
                    >
                        <FormattedMessage
                            id="send-safe-transaction.network-fee-widget.title"
                            defaultMessage="Network fee"
                        />
                    </Text>
                    <ProgressSpinner
                        key={pollingStartedAt}
                        size={20}
                        durationMs={pollingInterval}
                    />
                </Row>
            }
            right={
                <Row spacing={4}>
                    <Text
                        variant="paragraph"
                        color="textSecondary"
                        weight="regular"
                    >
                        {selectedGasCurrency.symbol}
                    </Text>
                    <Text
                        variant="paragraph"
                        color="textPrimary"
                        weight="regular"
                    >
                        <FormattedFee fee={selectedFee} />
                    </Text>
                    <BoldEdit size={14} color="iconDefault" />
                </Row>
            }
            message={
                error ? (
                    <ErrorMessage
                        error={error}
                        selectedGasCurrency={selectedGasCurrency}
                    />
                ) : undefined
            }
        />
    )
}

const FormattedFee = ({ fee }: { fee: GasAbstractionTransactionFee }) =>
    fee.feeInDefaultCurrency ? (
        <FormattedFeeInDefaultCurrency2 money={fee.feeInDefaultCurrency} />
    ) : (
        <TruncatedFeeInNativeTokenCurrency2 money={fee.feeInTokenCurrency} />
    )

const ErrorMessage = ({
    error,
    selectedGasCurrency,
}: {
    error: FeeForecastError
    selectedGasCurrency: CryptoCurrency
}) => {
    switch (error.type) {
        case 'insufficient_gas_token_balance':
            return (
                <FormattedMessage
                    id="send-safe-transaction.network-fee-widget.error"
                    defaultMessage="You need {amount} {symbol} or choose another token"
                    values={{
                        amount: (
                            <FormattedTokenBalances2
                                money={error.requiredGasCurrencyAmount}
                            />
                        ),
                        symbol: selectedGasCurrency.symbol,
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(error.type)
    }
}
