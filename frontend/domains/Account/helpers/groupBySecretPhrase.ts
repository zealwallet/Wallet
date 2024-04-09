import { notReachable } from '@zeal/toolkit'
import { excludeNullValues } from '@zeal/toolkit/Array/helpers/excludeNullValues'

import { Account } from '@zeal/domains/Account'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { decryptSecretPhrase } from '@zeal/domains/KeyStore/helpers/decryptSecretPhrase'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'

export type EncryptedPhrase = string

export const groupBySecretPhrase = async (
    accounts: Account[],
    keyStoreMap: KeyStoreMap,
    sessionPassword: string
): Promise<
    Record<EncryptedPhrase, { keystore: SecretPhrase; account: Account }[]>
> => {
    const accountsWithPhrases = (
        await Promise.all(
            accounts.map(async (account) => {
                const { address } = account

                const keystore = getKeyStore({ keyStoreMap, address })

                switch (keystore.type) {
                    case 'private_key_store':
                    case 'ledger':
                    case 'trezor':
                    case 'track_only':
                    case 'safe_4337':
                        return null

                    case 'secret_phrase_key':
                        return {
                            account,
                            keystore,
                            decryptedPhrase: await decryptSecretPhrase({
                                encryptedPhrase: keystore.encryptedPhrase,
                                sessionPassword,
                            }),
                        }

                    /* istanbul ignore next */
                    default:
                        return notReachable(keystore)
                }
            })
        )
    ).filter(excludeNullValues)

    const decryptedToEncryptedMap = accountsWithPhrases.reduce(
        (acc, item) => ({
            ...acc,
            [item.decryptedPhrase]: item.keystore.encryptedPhrase,
        }),
        {} as Record<string, string>
    )

    return accountsWithPhrases.reduce(
        (map, { account, decryptedPhrase, keystore }) => {
            const key = decryptedToEncryptedMap[decryptedPhrase]

            const group = map[key] || []

            return {
                ...map,
                [key]: [...group, { account, keystore }],
            }
        },
        {} as Record<string, { keystore: SecretPhrase; account: Account }[]>
    )
}
