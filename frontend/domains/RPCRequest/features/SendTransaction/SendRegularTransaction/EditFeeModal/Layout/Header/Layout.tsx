import { FormattedMessage, useIntl } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { ProgressSpinner } from '@zeal/uikit/ProgressSpinner'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { FormattedFeeInDefaultCurrency } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import { TruncatedFeeInNativeTokenCurrency } from '@zeal/domains/Money/components/TruncatedFeeInNativeTokenCurrency'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { FormattedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import { getEstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/helpers/getEstimatedFee'

import { Skeleton } from './Skeleton'
import { Time } from './Time'

type Props = {
    pollableData: Extract<
        PollableData<FeeForecastResponse, FeeForecastRequest>,
        { type: 'loaded' | 'reloading' | 'subsequent_failed' }
    >
    message: React.ReactNode
    errored: boolean
    pollingInterval: number
    pollingStartedAt: number
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_max_fee_info_icon_click' }

export const Layout = ({
    pollingInterval,
    pollingStartedAt,
    pollableData,
    errored,
    message,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const fee = getEstimatedFee(pollableData)

    return fee ? (
        <Column
            aria-label={formatMessage({
                id: 'EditFeeModal.Layout.Header.ariaLabel',
                defaultMessage: 'Current fee',
            })}
            spacing={4}
        >
            <Text
                variant="title1"
                weight="bold"
                color={errored ? 'textError' : 'textPrimary'}
            >
                <FormattedFee
                    fee={fee}
                    knownCurrencies={pollableData.data.currencies}
                />
            </Text>

            <Row spacing={12}>
                {fee.priceInDefaultCurrency && (
                    <Row spacing={0}>
                        <Text
                            variant="paragraph"
                            weight="regular"
                            color={errored ? 'textError' : 'textSecondary'}
                        >
                            <TruncatedFeeInNativeTokenCurrency
                                money={fee.priceInNativeCurrency}
                                knownCurrencies={pollableData.data.currencies}
                            />
                        </Text>
                    </Row>
                )}

                {(() => {
                    switch (fee.type) {
                        case 'Eip1559Fee':
                            return (
                                fee.maxPriceInDefaultCurrency && (
                                    <Row spacing={4}>
                                        <Text
                                            variant="paragraph"
                                            weight="regular"
                                            color={
                                                errored
                                                    ? 'textError'
                                                    : 'textSecondary'
                                            }
                                        >
                                            <FormattedMessage
                                                id="EditFeeModal.Header.fee.maxInDefaultCurrency"
                                                defaultMessage="Max {fee}"
                                                values={{
                                                    fee: (
                                                        <FormattedFeeInDefaultCurrency
                                                            money={
                                                                fee.maxPriceInDefaultCurrency
                                                            }
                                                            knownCurrencies={
                                                                pollableData
                                                                    .data
                                                                    .currencies
                                                            }
                                                        />
                                                    ),
                                                }}
                                            />
                                        </Text>

                                        <IconButton
                                            variant="on_light"
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_max_fee_info_icon_click',
                                                })
                                            }
                                        >
                                            {({ color }) => (
                                                <InfoCircle
                                                    size={16}
                                                    color={color}
                                                />
                                            )}
                                        </IconButton>
                                    </Row>
                                )
                            )
                        case 'LegacyFee':
                            return null

                        default:
                            return notReachable(fee)
                    }
                })()}

                <Time duration={fee.forecastDuration} />

                <Spacer />

                <ProgressSpinner
                    key={pollingStartedAt}
                    durationMs={pollingInterval}
                    size={16}
                />
            </Row>

            {message && (
                <Text
                    variant="paragraph"
                    weight="regular"
                    color={errored ? 'textError' : 'textSecondary'}
                >
                    {message}
                </Text>
            )}
        </Column>
    ) : (
        <Skeleton />
    )
}
