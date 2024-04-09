import { FormattedMessage } from 'react-intl'

import { FeeInputButton } from '@zeal/uikit/FeeInputButton'
import { LightArrowRight2 } from '@zeal/uikit/Icon/LightArrowRight2'
import { ProgressSpinner } from '@zeal/uikit/ProgressSpinner'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { KeyStore } from '@zeal/domains/KeyStore'
import { ForecastTime } from '@zeal/domains/Transactions/domains/ForecastDuration/components/ForecastTime'
import { FormattedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import { getEstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction/helpers/getEstimatedFee'

import { Skeleton } from './Skeleton'

import { NetworkFeeLabel } from '../components/Labels'
import {
    TrxLikelyToFail as TrxLikelyToFailType,
    TrxWillFailLessThenMinimumGas,
} from '../helpers/validation'

type Props = {
    pollingInterval: number
    pollingStartedAt: number
    error: TrxLikelyToFailType<KeyStore> | TrxWillFailLessThenMinimumGas
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_forecast_fee_click' }

const Message = ({
    error,
}: {
    error: TrxLikelyToFailType<KeyStore> | TrxWillFailLessThenMinimumGas
}) => {
    switch (error.type) {
        case 'trx_will_fail_less_then_minimum_gas':
            return (
                <FormattedMessage
                    id="TrxLikelyToFail.less_them_minimum_gas.message"
                    defaultMessage="Transaction will fail"
                />
            )
        case 'trx_likely_to_fail':
            switch (error.reason) {
                case 'less_than_estimated_gas':
                    return (
                        <FormattedMessage
                            id="TrxLikelyToFail.less_them_estimated_gas.message"
                            defaultMessage="Transaction will fail"
                        />
                    )

                case 'less_than_suggested_gas':
                    return (
                        <FormattedMessage
                            id="TrxLikelyToFail.less_than_suggested_gas.message"
                            defaultMessage="Likely to fail"
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(error.reason)
            }

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

export const TrxLikelyToFail = ({
    error,
    pollingInterval,
    pollingStartedAt,
    onMsg,
}: Props) => {
    const preset = getEstimatedFee(error.pollable)

    return preset ? (
        <FeeInputButton
            onClick={() => onMsg({ type: 'on_forecast_fee_click' })}
            errored
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
                        selectedPreset={error.pollable.params.selectedPreset}
                    />
                    <Row spacing={4}>
                        <Text
                            variant="paragraph"
                            weight="regular"
                            color="textPrimary"
                        >
                            <FormattedFee
                                knownCurrencies={error.pollable.data.currencies}
                                fee={preset}
                            />
                        </Text>
                        <LightArrowRight2 size={20} color="iconDefault" />
                    </Row>
                </>
            }
            message={<Message error={error} />}
        />
    ) : (
        <Skeleton onMsg={onMsg} />
    )
}
