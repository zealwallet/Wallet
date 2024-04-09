import equal from 'fast-deep-equal'

import { CustomCurrencyMap } from '@zeal/domains/Storage'

export const isEqual = (
    a: CustomCurrencyMap,
    b: CustomCurrencyMap
): boolean => {
    return equal(a, b)
}
