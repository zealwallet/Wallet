import { FormattedMessage } from 'react-intl'

import { FeeInputButton } from '@zeal/uikit/FeeInputButton'
import { ProgressSpinner } from '@zeal/uikit/ProgressSpinner'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { FormattedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import { getEstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/helpers/getEstimatedFee'

import { Skeleton } from './Skeleton'
import { Time } from './Time'

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

type Msg = {
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
            disabled
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
                    <Time errored forecastDuration={preset.forecastDuration} />
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

                    default:
                        return notReachable(pollable)
                }
            })()}
        />
    ) : (
        <Skeleton />
    )
}
