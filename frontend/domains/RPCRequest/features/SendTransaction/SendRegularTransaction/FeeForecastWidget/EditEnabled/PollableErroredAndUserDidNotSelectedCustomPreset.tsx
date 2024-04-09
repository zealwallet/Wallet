import { FeeInputButton } from '@zeal/uikit/FeeInputButton'
import { LightArrowRight2 } from '@zeal/uikit/Icon/LightArrowRight2'
import { Row } from '@zeal/uikit/Row'

import {
    CannotCalculateNetworkFeeLabel,
    NetworkFeeLabel,
    UnknownLabel,
} from '../components/Labels'
import { RetryButton } from '../components/RetryButton'
import { PollableErrored } from '../helpers/validation'

type Props = {
    error: PollableErrored
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_forecast_fee_click' }
    | { type: 'on_forecast_fee_error_reload_click' }

export const PollableErroredAndUserDidNotSelectedCustomPreset = ({
    onMsg,
}: Props) => {
    return (
        <FeeInputButton
            onClick={() => onMsg({ type: 'on_forecast_fee_click' })}
            errored
            left={
                <>
                    <NetworkFeeLabel />
                </>
            }
            right={
                <Row spacing={4}>
                    <UnknownLabel />
                    <LightArrowRight2 size={20} color="iconDefault" />
                </Row>
            }
            ctaButton={
                <RetryButton
                    onClick={() => {
                        onMsg({
                            type: 'on_forecast_fee_error_reload_click',
                        })
                    }}
                />
            }
            message={<CannotCalculateNetworkFeeLabel />}
        />
    )
}
