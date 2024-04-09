import { set } from '@zeal/toolkit/Storage/localStorage'

import { Storage } from '@zeal/domains/Storage'
import { LS_KEY } from '@zeal/domains/Storage/constants'

const serialize = (storage: Storage): string =>
    JSON.stringify(storage, (_, value) => {
        switch (true) {
            case typeof value === 'bigint':
                return value.toString()
            case value instanceof Map:
                return Object.fromEntries(value)
            default:
                return value
        }
    })

export const toLocalStorage = async (storage: Storage): Promise<void> =>
    set(LS_KEY, serialize(storage))
