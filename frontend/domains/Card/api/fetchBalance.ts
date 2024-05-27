import { get } from '@zeal/api/gnosisApi'

import { parse as parseJSON } from '@zeal/toolkit/JSON'
import { bigint, object, string } from '@zeal/toolkit/Result'

import { GnosisPayLoginInfo } from '..'

export const fetchBalance = async ({
    gnosisPayLoginInfo,
}: {
    gnosisPayLoginInfo: GnosisPayLoginInfo
}): Promise<bigint> => {
    const response = await get('/account-balances', {
        auth: { type: 'bearer_token', token: gnosisPayLoginInfo.token },
    })

    return string(response)
        .andThen(parseJSON)
        .andThen(object)
        .andThen((obj) => bigint(obj.spendable)) // FIXME @resetko-zeal check which one to show, spendable or total
        .getSuccessResultOrThrow('Failed to parse account balance')
}
