import { FeeInputButton } from '@zeal/uikit/FeeInputButton'

import { NetworkFeeLabel } from '../components/Labels'
import { SkeletonSideBar } from '../components/SkeletonSideBar'

export const Skeleton = () => (
    <FeeInputButton
        disabled
        left={<NetworkFeeLabel />}
        right={<SkeletonSideBar />}
    />
)
