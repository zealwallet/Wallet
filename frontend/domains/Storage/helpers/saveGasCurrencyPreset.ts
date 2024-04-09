import { CurrencyId } from '@zeal/domains/Currency'
import { NetworkHexId } from '@zeal/domains/Network'
import { Storage } from '@zeal/domains/Storage'

export const saveGasCurrencyPreset = ({
    currencyId,
    networkHexId,
    storage,
}: {
    storage: Storage
    currencyId: CurrencyId
    networkHexId: NetworkHexId
}): Storage => ({
    ...storage,
    gasCurrencyPresetMap: {
        ...storage.gasCurrencyPresetMap,
        [networkHexId]: currencyId,
    },
})
