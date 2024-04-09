import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { fetchFileContent } from '@zeal/domains/GoogleDriveFile/api/fetchFileContent'
import { fetchGoogleToken } from '@zeal/domains/GoogleDriveFile/api/fetchGoogleToken'
import { revokeToken } from '@zeal/domains/GoogleDriveFile/api/revokeToken'
import { FailedToFetchErrorPopup } from '@zeal/domains/GoogleDriveFile/components/FailedToFetchErrorPopup'
import { fetchGoogleDriveBackupFiles } from '@zeal/domains/KeyStore/api/fetchGoogleDriveBackupFiles'
import { parseEncryptedBackupContent } from '@zeal/domains/KeyStore/helpers/backup'

import { FileCorrupted } from './FileCorrupted'
import { FileNotFound } from './FileNotFound'
import { SelectFile } from './SelectFile'
import { Skeleton } from './Skeleton'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'recovery_file_found'
          file: {
              id: string
              name: string
              modifiedTime: number
              encryptedContent: string
          }
      }

type File = {
    id: string
    name: string
    modifiedTime: number
    encryptedContent: unknown
}

const fetch = async (): Promise<File[]> => {
    const token = await fetchGoogleToken()

    const files = await fetchGoogleDriveBackupFiles({ token })
    const filesContent = await Promise.all(
        files.map((file) => fetchFileContent({ token, file }))
    )
    await revokeToken({ token })
    return files.map((file, index) => {
        const encryptedContent = filesContent[index]
        return {
            ...file,
            encryptedContent,
        }
    })
}

export const FileLoader = ({ onMsg }: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetch, {
        type: 'loading',
        params: undefined,
    })
    switch (loadable.type) {
        case 'loading':
            return <Skeleton onMsg={onMsg} />
        case 'loaded': {
            if (loadable.data.length === 0) {
                return <FileNotFound onMsg={onMsg} />
            } else if (loadable.data.length === 1) {
                const file = loadable.data[0]
                const content = parseEncryptedBackupContent(
                    file.encryptedContent
                )
                switch (content.type) {
                    case 'Failure':
                        return <FileCorrupted onMsg={onMsg} />
                    case 'Success':
                        return (
                            <SuccessLayout
                                title={
                                    <FormattedMessage
                                        id="account.recovery_kit.success.recovery_file_found"
                                        defaultMessage="Recovery File found 🎉"
                                    />
                                }
                                onAnimationComplete={() => {
                                    onMsg({
                                        type: 'recovery_file_found',
                                        file: {
                                            ...file,
                                            encryptedContent: content.data,
                                        },
                                    })
                                }}
                            />
                        )
                    /* istanbul ignore next */
                    default:
                        return notReachable(content)
                }
            }

            return (
                <SelectFile
                    files={loadable.data}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'backup_file_selected':
                                onMsg({
                                    type: 'recovery_file_found',
                                    file: msg.file,
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
                                            params: undefined,
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
