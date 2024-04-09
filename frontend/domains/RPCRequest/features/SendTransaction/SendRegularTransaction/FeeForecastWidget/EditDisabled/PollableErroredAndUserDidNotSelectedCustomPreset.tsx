import { FeeInputButton } from '@zeal/uikit/FeeInputButton'

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

type Msg = { type: 'on_forecast_fee_error_reload_click' }

export const PollableErroredAndUserDidNotSelectedCustomPreset = ({
    onMsg,
}: Props) => {
    return (
        <FeeInputButton
            disabled
            errored
            left={
                <>
                    <NetworkFeeLabel />
                </>
            }
            right={
                <>
                    <UnknownLabel />
                </>
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
