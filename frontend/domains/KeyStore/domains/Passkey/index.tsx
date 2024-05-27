import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'

import { Address } from '@zeal/domains/Address'

// TODO: @Nicvaniek replace all usages of Safe4337['safeDeplymentConfig']['passkeyOwner'] wih this type
export type Passkey = {
    encryptedCredentialId: string
    recoveryId: Hexadecimal.Hexadecimal
    publicKey: {
        xCoordinate: Hexadecimal.Hexadecimal
        yCoordinate: Hexadecimal.Hexadecimal
    }
    signerAddress: Address
}
