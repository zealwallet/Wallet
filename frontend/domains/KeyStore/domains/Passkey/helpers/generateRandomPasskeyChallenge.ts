import { getRandomIntArray } from '@zeal/toolkit/Crypto'

export const generateRandomPasskeyChallenge = (): Uint8Array =>
    getRandomIntArray(new Uint8Array(32))
