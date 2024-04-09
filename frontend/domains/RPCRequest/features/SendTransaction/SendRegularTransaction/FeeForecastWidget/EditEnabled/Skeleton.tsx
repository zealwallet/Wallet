import { FeeInputButton } from '@zeal/uikit/FeeInputButton'
import { LightArrowRight2 } from '@zeal/uikit/Icon/LightArrowRight2'
import { Row } from '@zeal/uikit/Row'

import { NetworkFeeLabel } from '../components/Labels'
import { SkeletonSideBar } from '../components/SkeletonSideBar'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_forecast_fee_click' }

export const Skeleton = ({ onMsg }: Props) => (
    <FeeInputButton
        onClick={() => onMsg({ type: 'on_forecast_fee_click' })}
        left={
            <>
                <NetworkFeeLabel />
            </>
        }
        right={
            <Row spacing={4}>
                <SkeletonSideBar />
                <LightArrowRight2 size={20} color="iconDefault" />
            </Row>
        }
    />
)
