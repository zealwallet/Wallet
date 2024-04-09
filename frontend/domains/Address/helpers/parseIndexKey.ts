import { keys } from '@zeal/toolkit/Object'
import {
    failure,
    groupByType,
    Result,
    success,
    ValidObject,
} from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { fromString } from '@zeal/domains/Address/helpers/fromString'

export const parseIndexKey = (
    input: ValidObject
): Result<unknown, Record<Address, unknown>> => {
    const ks = keys(input)
    const [errors, result] = groupByType(ks.map(fromString))
    if (errors.length) {
        return failure({ type: 'some_of_the_keys_are_not_addresses', errors })
    }

    return success(
        result.reduce((memo, address, currentIndex) => {
            memo[address] = input[ks[currentIndex]]
            return memo
        }, {} as Record<Address, unknown>)
    )
}
