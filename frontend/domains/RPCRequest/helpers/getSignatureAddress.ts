import { recoverPersonalSignature } from '@metamask/eth-sig-util'

import { Address } from '@zeal/domains/Address'
import { PersonalECRecover } from '@zeal/domains/RPCRequest'

export const getSignatureAddress = ({
    request,
}: {
    request: PersonalECRecover
}): Promise<Address> => {
    const [message, signature] = request.params
    return Promise.resolve(
        recoverPersonalSignature({
            data: message,
            signature,
        })
    )
}
