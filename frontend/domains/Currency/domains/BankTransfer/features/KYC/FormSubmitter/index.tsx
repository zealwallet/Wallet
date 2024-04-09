import { useEffect } from 'react'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { UnblockUser } from '@zeal/domains/Currency/domains/BankTransfer'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { submitUnblockKycApplication } from '@zeal/domains/Currency/domains/BankTransfer/api/submitUnblockKycApplication'
import { KycFailedModal } from '@zeal/domains/Currency/domains/BankTransfer/components/KycFailedModal'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import {
    BankTransferUnblockUserCreated,
    SumSubAccessToken,
} from '@zeal/domains/Storage'

import { DocumentUpload } from './DocumentUpload'
import { Form } from './Form'

import { LoadingLayout } from '../LoadingLayout'

type Props = {
    loginInfo: UnblockLoginInfo
    unblockUser: UnblockUser
    bankTransferInfo: BankTransferUnblockUserCreated
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'kyc_applicant_created'
          sumSubAccessToken: SumSubAccessToken
          bankTransferInfo: BankTransferUnblockUserCreated
      }
    | Extract<MsgOf<typeof Form>, { type: 'close' | 'on_back_button_clicked' }>
    | MsgOf<typeof DocumentUpload>

export const FormSubmitter = ({
    onMsg,
    bankTransferInfo,
    account,
    loginInfo,
    unblockUser,
    network,
    keyStoreMap,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(
        submitUnblockKycApplication,
        {
            type: 'not_asked',
        }
    )

    const liveMsg = useLiveRef(onMsg)
    const liveBankTransferInfo = useLiveRef(bankTransferInfo)

    useEffect(() => {
        switch (loadable.type) {
            case 'not_asked':
            case 'loading':
            case 'error':
                break
            case 'loaded':
                liveMsg.current({
                    type: 'kyc_applicant_created',
                    sumSubAccessToken: loadable.data,
                    bankTransferInfo: liveBankTransferInfo.current,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [liveMsg, loadable, liveBankTransferInfo])

    switch (loadable.type) {
        case 'not_asked':
            return (
                <Form
                    unblockUser={unblockUser}
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_back_button_clicked':
                                onMsg(msg)
                                break
                            case 'form_submitted':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        application: msg.form,
                                        unblockUser,
                                        loginInfo,
                                        bankTransferInfo,
                                    },
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'loading':
            return (
                <LoadingLayout
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    onMsg={onMsg}
                />
            )
        case 'loaded':
            return (
                <DocumentUpload
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    sumSubAccessToken={loadable.data}
                    onMsg={onMsg}
                />
            )
        case 'error':
            const error = parseAppError(loadable.error)

            switch (error.type) {
                case 'unblock_hard_kyc_failure':
                    return (
                        <>
                            <LoadingLayout
                                account={account}
                                network={network}
                                keyStoreMap={keyStoreMap}
                                onMsg={onMsg}
                            />
                            <KycFailedModal
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'close':
                                            onMsg(msg)
                                            break

                                        default:
                                            notReachable(msg.type)
                                    }
                                }}
                            />
                        </>
                    )

                default:
                    return (
                        <>
                            <LoadingLayout
                                account={account}
                                network={network}
                                keyStoreMap={keyStoreMap}
                                onMsg={onMsg}
                            />
                            <AppErrorPopup
                                error={error}
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'close':
                                            setLoadable({ type: 'not_asked' })
                                            break

                                        case 'try_again_clicked':
                                            setLoadable({
                                                type: 'loading',
                                                params: loadable.params,
                                            })
                                            break
                                        /* istanbul ignore next */
                                        default:
                                            notReachable(msg)
                                    }
                                }}
                            />
                        </>
                    )
            }
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
