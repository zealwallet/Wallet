import Web3 from 'web3'

import { notReachable } from '@zeal/toolkit'
import { failure, Result, success } from '@zeal/toolkit/Result'

import { SignMessageRequest } from '@zeal/domains/RPCRequest'

export const getPersonalSignMessage = (
    request: SignMessageRequest
): Result<unknown, string> => {
    try {
        switch (request.method) {
            case 'personal_sign':
                // some dapps do not hex-encode the message
                if (/^0x[0-9A-Fa-f]*$/.test(request.params[0])) {
                    return success(Web3.utils.hexToUtf8(request.params[0]))
                } else {
                    return success(request.params[0])
                }

            case 'eth_signTypedData':
                return success(
                    JSON.stringify(JSON.parse(request.params[1]), null, 4)
                )

            case 'eth_signTypedData_v4':
            case 'eth_signTypedData_v3':
                return success(
                    JSON.stringify(
                        JSON.parse(request.params[1]).message,
                        null,
                        4
                    )
                )
            /* istanbul ignore next */
            default:
                return notReachable(request)
        }
    } catch (e) {
        return failure(e)
    }
}
