import { getRandomIntArray } from '@zeal/toolkit/Crypto'

export const generatePasskeyRecoveryId = (): Uint8Array =>
    getRandomIntArray(new Uint8Array(32))
