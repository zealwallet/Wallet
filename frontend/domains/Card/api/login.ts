import { post } from '@zeal/api/gnosisApi'

import { parse as parseJSON } from '@zeal/toolkit/JSON'
import { object, string } from '@zeal/toolkit/Result'

import { GnosisPayLoginInfo, GnosisPayLoginSignature } from '..'

export const login = async ({
    gnosisPayLoginSignature,
}: {
    gnosisPayLoginSignature: GnosisPayLoginSignature
}): Promise<GnosisPayLoginInfo> => {
    const response = await post('/auth/verify', {
        body: {
            message: gnosisPayLoginSignature.message,
            signature: gnosisPayLoginSignature.signature,
        },
    })

    const token = string(response)
        .andThen(parseJSON)
        .andThen(object)
        .andThen((json) => string(json.token))
        .getSuccessResultOrThrow('Failed to parse gnosis pay login token')

    return { type: 'gnosis_pay_login_info', token }
}
