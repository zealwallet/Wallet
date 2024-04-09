import { nullableOf, object, Result, shape, string } from '@zeal/toolkit/Result'

import { DAppSiteInfo } from '../index'

export const parseDAppSiteInfo = (
    input: unknown
): Result<unknown, DAppSiteInfo> =>
    object(input).andThen((obj) =>
        shape({
            title: nullableOf(obj.title, string),
            avatar: nullableOf(obj.avatar, string),
            hostname: string(obj.hostname),
        })
    )
