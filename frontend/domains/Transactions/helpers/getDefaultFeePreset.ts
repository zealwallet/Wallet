import { NetworkHexId } from '@zeal/domains/Network'
import {
    FeePresetMap,
    PredefinedPreset,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { DEFAULT_FEE_PRESET } from '@zeal/domains/Transactions/constants'

export const getDefaultFeePreset = ({
    networkHexId,
    feePresetMap,
}: {
    feePresetMap: FeePresetMap
    networkHexId: NetworkHexId
}): PredefinedPreset => feePresetMap[networkHexId] || DEFAULT_FEE_PRESET
