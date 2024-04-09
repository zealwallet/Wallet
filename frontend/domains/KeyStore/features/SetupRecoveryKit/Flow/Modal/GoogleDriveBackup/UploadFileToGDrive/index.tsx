import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { values } from '@zeal/toolkit/Object'
import { generateUniqueLabels } from '@zeal/toolkit/String/generateUniqueLabels'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { groupBySecretPhrase } from '@zeal/domains/Account/helpers/groupBySecretPhrase'
import { ImperativeError } from '@zeal/domains/Error'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { createFile } from '@zeal/domains/GoogleDriveFile/api/createFile'
import { createFolder } from '@zeal/domains/GoogleDriveFile/api/createFolder'
import { fetchGoogleToken } from '@zeal/domains/GoogleDriveFile/api/fetchGoogleToken'
import { findFolder } from '@zeal/domains/GoogleDriveFile/api/findFolder'
import { revokeToken } from '@zeal/domains/GoogleDriveFile/api/revokeToken'
import { FailedToFetchErrorPopup } from '@zeal/domains/GoogleDriveFile/components/FailedToFetchErrorPopup'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { fetchGoogleDriveBackupFiles } from '@zeal/domains/KeyStore/api/fetchGoogleDriveBackupFiles'
import {
    ZEAL_BACKUP_FILE_EXTENSION_WITH_DOT,
    ZEAL_BACKUP_FOLDER_NAME,
} from '@zeal/domains/KeyStore/constants'
import { backup } from '@zeal/domains/KeyStore/helpers/backup'
import { PasswordCheckPopup } from '@zeal/domains/Password/features/PasswordCheckPopup'

import { Skeleton } from './Skeleton'

type Props = {
    encryptedPassword: string
    keystore: SecretPhrase
    account: Account
    accounts: AccountsMap
    keystoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_google_drive_backup_success'
          account: Account
          accountsWithKeystores: {
              account: Account
              keystore: SecretPhrase
          }[]
      }

type Params = {
    unencryptedUserPassword: string
    sessionPassword: string
    keystore: SecretPhrase
    account: Account
}

const fetch = async ({
    unencryptedUserPassword,
    sessionPassword,
    keystore,
    account,
}: Params): Promise<{ fileId: string; modifiedTime: number }> => {
    const token = await fetchGoogleToken()

    const backupContent = await backup(
        unencryptedUserPassword,
        sessionPassword,
        keystore
    )

    const existingFiles = await fetchGoogleDriveBackupFiles({ token })

    const folder =
        (await findFolder({ token, folderName: ZEAL_BACKUP_FOLDER_NAME })) ||
        (await createFolder({
            token,
            folderName: ZEAL_BACKUP_FOLDER_NAME,
            parents: [],
        }))

    const [fileName] = generateUniqueLabels(
        existingFiles.map((file) =>
            file.name.split('.').slice(0, -1).join('.')
        ),
        account.label,
        1
    )

    const file = await createFile({
        token,
        fileName: `${fileName}${ZEAL_BACKUP_FILE_EXTENSION_WITH_DOT}`,
        fileData: backupContent,
        parents: [folder.folderId],
    })
    await revokeToken({ token })

    return file
}

export const UploadFileToGDrive = ({
    encryptedPassword,
    keystore,
    account,
    accounts,
    keystoreMap,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(fetch, {
        type: 'not_asked',
    })

    switch (loadable.type) {
        case 'not_asked':
            return (
                <>
                    {/* We explicitly use password on web AND mobile (instead of pin) so user is able to recover cross-platform */}
                    <PasswordCheckPopup
                        subtitle={
                            <FormattedMessage
                                id="ViewSecretPhrase.PasswordChecker.subtitle"
                                defaultMessage="Enter your password to encrypt the Recovery File. You’ll need to remember it in the future."
                            />
                        }
                        encryptedPassword={encryptedPassword}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'lock_screen_close_click':
                                    onMsg({ type: 'close' })
                                    break
                                case 'session_password_decrypted':
                                    setLoadable({
                                        type: 'loading',
                                        params: {
                                            keystore,
                                            sessionPassword:
                                                msg.sessionPassword,
                                            unencryptedUserPassword:
                                                msg.unencryptedUserPassword,
                                            account,
                                        },
                                    })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </>
            )

        case 'loading':
            return <Skeleton onMsg={onMsg} />

        case 'loaded':
            const sessionPassword = loadable.params.sessionPassword
            const file = loadable.data
            return (
                <SuccessLayout
                    title={
                        <FormattedMessage
                            id="GoogleDriveBackup.success"
                            defaultMessage="Backup successful 🎉"
                        />
                    }
                    onAnimationComplete={async () => {
                        try {
                            const secretPhraseMap = await groupBySecretPhrase(
                                values(accounts),
                                keystoreMap,
                                sessionPassword
                            )
                            const accountsWithKeystore =
                                secretPhraseMap[keystore.encryptedPhrase]
                            onMsg({
                                type: 'on_google_drive_backup_success',
                                account,
                                accountsWithKeystores: accountsWithKeystore.map(
                                    ({ account, keystore }) => ({
                                        account,
                                        keystore: {
                                            ...keystore,
                                            googleDriveFile: {
                                                id: file.fileId,
                                                modifiedTime: file.modifiedTime,
                                            },
                                        },
                                    })
                                ),
                            })
                        } catch (e) {
                            captureError(
                                new ImperativeError(
                                    'sww when updating accounts on UploadFileToGDrive '
                                )
                            )
                        }
                    }}
                />
            )

        case 'error':
            const parsed = parseAppError(loadable.error)
            switch (parsed.type) {
                case 'failed_to_fetch_google_auth_token':
                    return <FailedToFetchErrorPopup onMsg={onMsg} />
                /* istanbul ignore next */
                default:
                    return (
                        <AppErrorPopup
                            error={parsed}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        onMsg(msg)
                                        break
                                    case 'try_again_clicked':
                                        setLoadable({
                                            type: 'loading',
                                            params: loadable.params,
                                        })
                                        break
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(msg)
                                }
                            }}
                        />
                    )
            }

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
