import { FormattedMessage } from 'react-intl'

import { FeeInputButton } from '@zeal/uikit/FeeInputButton'
import { LightArrowRight2 } from '@zeal/uikit/Icon/LightArrowRight2'
import { LightDangerTriangle } from '@zeal/uikit/Icon/LightDangerTriangle'
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
    NonceRangeErrorBiggerThanCurrent,
    NonceRangeErrorLessThanCurrent,
} from '../helpers/validation'

type Props = {
    error:
        | NonceRangeErrorBiggerThanCurrent<KeyStore>
        | NonceRangeErrorLessThanCurrent
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_forecast_fee_click' }

const Message = ({
    reason,
}: {
    reason:
        | NonceRangeErrorBiggerThanCurrent<KeyStore>
        | NonceRangeErrorLessThanCurrent
}) => {
    switch (reason.type) {
        case 'nonce_range_error_less_than_current':
            return (
                <FormattedMessage
                    id="NonceRangeError.less_than_current.message"
                    defaultMessage="Transaction will fail"
                />
            )

        case 'nonce_range_error_bigger_than_current':
            return (
                <FormattedMessage
                    id="NonceRangeError.bigger_than_current.message"
                    defaultMessage="Transaction will get stuck"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(reason)
    }
}

export const NonceRangeError = ({ error, onMsg }: Props) => {
    const preset = getEstimatedFee(error.pollable)

    return preset ? (
        <FeeInputButton
            onClick={() => onMsg({ type: 'on_forecast_fee_click' })}
            errored
            left={
                <>
                    <NetworkFeeLabel />
                    <LightDangerTriangle size={20} color="iconStatusCritical" />
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
            message={<Message reason={error} />}
        />
    ) : (
        <Skeleton onMsg={onMsg} />
    )
}
