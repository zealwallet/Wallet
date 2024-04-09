import React from 'react'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { Account } from '@zeal/domains/Account'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { SecretPhrase } from '@zeal/domains/KeyStore'
import { generateSecretPhrase } from '@zeal/domains/KeyStore/helpers/generateSecretPhrase'
import { generateSecretPhraseAddress } from '@zeal/domains/KeyStore/helpers/generateSecretPhraseAddress'

type Props = {
    label: string
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: SecretPhrase
          }[]
      }
    | {
          type: 'on_accounts_create_success_animation_finished'
          accountsWithKeystores: {
              account: Account
              keystore: SecretPhrase
          }[]
      }

const generateAccountAndKeystore = async ({
    sessionPassword,
    label,
}: {
    sessionPassword: string
    label: string
}): Promise<{
    account: Account
    keystore: SecretPhrase
}> => {
    const encryptedPhrase = await generateSecretPhrase({ sessionPassword })

    const { address, path } = await generateSecretPhraseAddress({
        encryptedPhrase,
        offset: 0,
        sessionPassword,
    })
    const keystore: SecretPhrase = {
        id: uuid(),
        type: 'secret_phrase_key',
        bip44Path: path,
        encryptedPhrase,
        confirmed: false,
        googleDriveFile: null,
    }

    return {
        account: {
            label,
            address: address,
            avatarSrc: null,
        },
        keystore,
    }
}

export const CreateNewAccount = ({ sessionPassword, label, onMsg }: Props) => {
    const liveMsg = useLiveRef(onMsg)
    const [loadable] = useLoadableData(generateAccountAndKeystore, {
        type: 'loading',
        params: { sessionPassword, label },
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
                break

            case 'loaded':
                liveMsg.current({
                    type: 'on_account_create_request',
                    accountsWithKeystores: [loadable.data],
                })

                break

            case 'error':
                captureError(loadable.error)
                break

            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable, liveMsg])

    const [
        animationFinishedBeforeLoadable,
        setAnimationFinishedBeforeLoadable,
    ] = useState(false)

    useEffect(() => {
        if (animationFinishedBeforeLoadable) {
            switch (loadable.type) {
                case 'loaded':
                    liveMsg.current({
                        type: 'on_accounts_create_success_animation_finished',
                        accountsWithKeystores: [loadable.data],
                    })
                    break

                case 'loading':
                case 'error':
                    break

                /* istanbul ignore next */
                default:
                    return notReachable(loadable)
            }
        }
    }, [animationFinishedBeforeLoadable, loadable, liveMsg])

    return (
        <SuccessLayout
            key="success-slide"
            title={
                <FormattedMessage
                    id="account.add.success.title"
                    defaultMessage="New wallet created 🎉"
                />
            }
            onAnimationComplete={() => {
                switch (loadable.type) {
                    case 'loaded':
                        return onMsg({
                            type: 'on_accounts_create_success_animation_finished',
                            accountsWithKeystores: [loadable.data],
                        })

                    case 'loading':
                    case 'error':
                        setAnimationFinishedBeforeLoadable(true)
                        break

                    /* istanbul ignore next */
                    default:
                        return notReachable(loadable)
                }
            }}
        />
    )
}
