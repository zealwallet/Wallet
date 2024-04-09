import { NetworkHexId } from '@zeal/domains/Network'
import { Storage } from '@zeal/domains/Storage'
import { PredefinedPreset } from '@zeal/domains/Transactions/api/fetchFeeForecast'

export const saveFeePreset = ({
    feePreset,
    networkHexId,
    storage,
}: {
    storage: Storage
    feePreset: PredefinedPreset
    networkHexId: NetworkHexId
}): Storage => ({
    ...storage,
    feePresetMap: {
        ...storage.feePresetMap,
        [networkHexId]: feePreset,
    },
})
