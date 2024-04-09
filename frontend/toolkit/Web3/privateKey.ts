import { mnemonicToSeed } from '@scure/bip39'
import memoize from 'lodash.memoize'
import { HDKey, hdKeyToAccount } from 'viem/accounts'
import { toHex } from 'viem/utils'

import { ImperativeError } from '@zeal/toolkit/Error'

export type PrivateKey = {
    privateKey: `0x${string}`
    address: string
}

// on mobile it is super slow, and it is deterministic so we can memo it
const mnemonicToSeedSyncMemo = memoize(mnemonicToSeed)

export const fromMnemonic = async (
    mnemonic: string,
    path: `m/44'/60'/0'/0/${string}`
): Promise<PrivateKey> => {
    const seed = await mnemonicToSeedSyncMemo(mnemonic)
    const account = hdKeyToAccount(HDKey.fromMasterSeed(seed), { path })
    const privateKey = account.getHdKey().privateKey
    if (!privateKey) {
        throw new ImperativeError('cannot extract private key from path')
    }
    return {
        privateKey: toHex(privateKey),
        address: account.address,
    }
}
