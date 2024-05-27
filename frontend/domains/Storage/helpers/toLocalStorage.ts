import * as storage from '@zeal/toolkit/Storage'

import { Storage } from '@zeal/domains/Storage'
import { LS_KEY, PORTFOLIO_MAP_KEY } from '@zeal/domains/Storage/constants'

export const toLocalStorage = async (current: Storage): Promise<void> => {
    const { portfolios, ...rest } = current

    await storage.local.set(LS_KEY, storage.serialize(rest))

    await storage.local.setChunked(
        PORTFOLIO_MAP_KEY,
        storage.serialize(portfolios)
    )
}
