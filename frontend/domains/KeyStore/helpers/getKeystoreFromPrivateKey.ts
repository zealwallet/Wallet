import Web3 from 'web3'

import { encrypt, uuid } from '@zeal/toolkit/Crypto'

import { PrivateKey } from '@zeal/domains/KeyStore'

export const getKeystoreFromPrivateKey = async (
    privateKey: string,
    sessionPassword: string
): Promise<PrivateKey> => {
    const { address } = new Web3().eth.accounts.privateKeyToAccount(
        '0x' + privateKey
    )

    return {
        id: uuid(),
        type: 'private_key_store',
        address,
        encryptedPrivateKey: await encrypt(sessionPassword, privateKey),
    }
}
