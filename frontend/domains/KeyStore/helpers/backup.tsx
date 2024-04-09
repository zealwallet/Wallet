import { decrypt, encrypt, uuid } from '@zeal/toolkit/Crypto'
import { parse as parseJSON } from '@zeal/toolkit/JSON'
import { values } from '@zeal/toolkit/Object'
import {
    boolean,
    match,
    object,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'
import { tryDecodeBase64 } from '@zeal/toolkit/String/tryDecodeBase64'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { generateAccountsLabels } from '@zeal/domains/Account/helpers/generateAccountsLabel'
import { SecretPhrase } from '@zeal/domains/KeyStore'
import { decryptSecretPhrase } from '@zeal/domains/KeyStore/helpers/decryptSecretPhrase'
import { encryptSecretPhrase } from '@zeal/domains/KeyStore/helpers/encryptSecretPhrase'
import { generateSecretPhraseAddressOnPath } from '@zeal/domains/KeyStore/helpers/generateSecretPhraseAddress'

type Backup = {
    type: 'secret_phrase_key'
    version: '1'
    entropy: string
    bip44Path: string
    confirmed: boolean
}

export const backup = async (
    unencryptedUserPassword: string,
    sessionPassword: string,
    keystore: SecretPhrase
): Promise<string> => {
    const backup: Backup = {
        type: 'secret_phrase_key',
        version: '1',
        entropy: await decryptSecretPhrase({
            encryptedPhrase: keystore.encryptedPhrase,
            sessionPassword,
        }),
        bip44Path: keystore.bip44Path,
        confirmed: keystore.confirmed,
    }
    const encryptedBackUp = await encrypt(unencryptedUserPassword, backup)
    return window.btoa(encryptedBackUp)
}

type EncryptedBackupContent = string

type RestoreBackupParams = {
    unencryptedUserPassword: string
    sessionPassword: string
    file: {
        id: string
        name: string
        modifiedTime: number
        encryptedContent: EncryptedBackupContent
    }
    accounts: AccountsMap
}

export const restoreBackup = async ({
    unencryptedUserPassword,
    sessionPassword,
    file,
    accounts,
}: RestoreBackupParams): Promise<{
    keystore: SecretPhrase
    account: Account
}> => {
    // TODO :: throw can be not safe here, consider map error
    const { entropy, bip44Path, confirmed } = await decrypt(
        unencryptedUserPassword,
        file.encryptedContent,
        parseBackupContent
    )

    const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '')

    const [label] = generateAccountsLabels(
        values(accounts),
        fileNameWithoutExtension,
        1
    )

    const encryptedPhrase = await encryptSecretPhrase({
        sessionPassword,
        mnemonic: entropy,
    })

    const { address } = await generateSecretPhraseAddressOnPath({
        encryptedPhrase,
        path: bip44Path,
        sessionPassword,
    })

    const account: Account = {
        address,
        label,
        avatarSrc: null,
    }

    return {
        account,
        keystore: {
            id: uuid(),
            type: 'secret_phrase_key',
            encryptedPhrase,
            confirmed,
            bip44Path,
            googleDriveFile: { id: file.id, modifiedTime: file.modifiedTime },
        },
    }
}

export const parseEncryptedBackupContent = (
    input: unknown
): Result<unknown, EncryptedBackupContent> =>
    string(input)
        .andThen(tryDecodeBase64)
        .andThen((s) =>
            parseJSON(s)
                .andThen(object)
                .andThen((obj) =>
                    shape({
                        data: string(obj.data),
                        iv: string(obj.iv),
                        salt: string(obj.salt),
                    })
                )
                .map(() => s)
        )

const parseBackupContent = (
    decryptedBackupContent: unknown
): Result<unknown, Backup> =>
    object(decryptedBackupContent).andThen((obj) =>
        shape({
            type: match(obj.type, 'secret_phrase_key' as const),
            version: match(obj.version, '1' as const),
            entropy: string(obj.entropy),
            bip44Path: string(obj.bip44Path),
            confirmed: boolean(obj.confirmed),
        })
    )
