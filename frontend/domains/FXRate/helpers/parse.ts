import { bigint, object, Result, shape, string } from '@zeal/toolkit/Result'

import { FXRate } from '@zeal/domains/FXRate'

export const parse = (input: unknown): Result<unknown, FXRate> =>
    object(input).andThen((obj) =>
        shape({
            base: string(obj.base),
            quote: string(obj.quote),
            rate: bigint(obj.rate),
        })
    )
