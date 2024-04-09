import { FormattedMessage } from 'react-intl'

import { FeeInputButton } from '@zeal/uikit/FeeInputButton'
import { LightArrowRight2 } from '@zeal/uikit/Icon/LightArrowRight2'
import { ProgressSpinner } from '@zeal/uikit/ProgressSpinner'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { ForecastTime } from '@zeal/domains/Transactions/domains/ForecastDuration/components/ForecastTime'
import { FormattedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import { getEstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/helpers/getEstimatedFee'

import { Skeleton } from './Skeleton'

import { NetworkFeeLabel } from '../components/Labels'
import { RetryButton } from '../components/RetryButton'

type Props = {
    pollingInterval: number
    pollingStartedAt: number
    pollable: Extract<
        PollableData<FeeForecastResponse, FeeForecastRequest>,
        { type: 'loaded' | 'reloading' | 'subsequent_failed' }
    >
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_forecast_fee_click' }
    | {
          type: 'on_forecast_subsequent_failed_reload_click'
          data: FeeForecastResponse
      }

export const Success = ({
    pollable,
    pollingInterval,
    pollingStartedAt,
    onMsg,
}: Props) => {
    const preset = getEstimatedFee(pollable)

    return preset ? (
        <FeeInputButton
            onClick={() => onMsg({ type: 'on_forecast_fee_click' })}
            left={
                <>
                    <NetworkFeeLabel />
                    <ProgressSpinner
                        key={pollingStartedAt}
                        size={20}
                        durationMs={pollingInterval}
                    />
                </>
            }
            right={
                <>
                    <ForecastTime
                        errored
                        forecastDuration={preset.forecastDuration}
                        selectedPreset={pollable.params.selectedPreset}
                    />
                    <Row spacing={4}>
                        <Text
                            variant="paragraph"
                            weight="regular"
                            color="textPrimary"
                        >
                            <FormattedFee
                                knownCurrencies={pollable.data.currencies}
                                fee={preset}
                            />
                        </Text>
                        <LightArrowRight2 size={20} color="iconDefault" />
                    </Row>
                </>
            }
            message={(() => {
                switch (pollable.type) {
                    case 'loaded':
                    case 'reloading':
                        return null

                    case 'subsequent_failed':
                        return (
                            <FormattedMessage
                                id="FeeForecastWiget.subsequent_failed.message"
                                defaultMessage="Estimates might be old, last refresh failed"
                            />
                        )

                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable)
                }
            })()}
            ctaButton={(() => {
                switch (pollable.type) {
                    case 'loaded':
                    case 'reloading':
                        return null

                    case 'subsequent_failed':
                        return (
                            <RetryButton
                                onClick={() =>
                                    onMsg({
                                        type: 'on_forecast_subsequent_failed_reload_click',
                                        data: pollable.data,
                                    })
                                }
                            />
                        )

                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable)
                }
            })()}
        />
    ) : (
        <Skeleton onMsg={onMsg} />
    )
}
