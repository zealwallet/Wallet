import { Result, string } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { fromString } from '@zeal/domains/Address/helpers/fromString'

export const parse = (input: unknown): Result<unknown, Address> =>
    string(input).andThen(fromString)
