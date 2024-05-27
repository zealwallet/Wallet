import { useEffect } from 'react'

import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'
import { Modal } from '@zeal/uikit/Modal'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { Address } from '@zeal/domains/Address'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import {
    createUnblockUser,
    CreateUnblockUserParams,
} from '@zeal/domains/Currency/domains/BankTransfer/api/createUnblockUser'
import {
    loginToUnblock,
    UnblockLoginInfo,
} from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { CreateUserForm } from '@zeal/domains/Currency/domains/BankTransfer/components/CreateUserForm'
import { UserEmailAlreadyTaken } from '@zeal/domains/Currency/domains/BankTransfer/components/UserEmailAlreadyTaken'
import { LoginExistingUser } from '@zeal/domains/Currency/domains/BankTransfer/features/LoginExistingUser'
import { ResignMsgAndLogin } from '@zeal/domains/Currency/domains/BankTransfer/features/ResignMsgAndLogin'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { EOA, KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

type Props = {
    account: Account
    network: Network
    keystore: EOA
    keystoreMap: KeyStoreMap
    sessionPassword: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    unblockLoginSignature: UnblockLoginSignature
    accountsMap: AccountsMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    keyStoreMap: KeyStoreMap
    portfolio: Portfolio | null
    onMsg: (msg: Msg) => void
}

export type Msg =
    | {
          type: 'close'
      }
    | {
          type: 'on_unblock_login_success'
          unblockLoginInfo: UnblockLoginInfo
          unblockLoginSignature: UnblockLoginSignature
      }
    | {
          type: 'unblock_user_created'
          loginInfo: UnblockLoginInfo
          user: CreateUnblockUserParams
          unblockLoginSignature: UnblockLoginSignature
          address: Address
      }
    | MsgOf<typeof UserEmailAlreadyTaken>
    | Extract<
          MsgOf<typeof ResignMsgAndLogin>,
          {
              type:
                  | 'on_gas_currency_selected'
                  | 'on_4337_gas_currency_selected'
                  | 'on_predefined_fee_preset_selected'
                  | 'cancel_submitted'
                  | 'transaction_submited'
                  | 'transaction_request_replaced'
          }
      >

const fetch = async ({
    user,
    unblockLoginSignature,
    signal,
}: {
    unblockLoginSignature: UnblockLoginSignature
    user: CreateUnblockUserParams
} & {
    signal?: AbortSignal
}): Promise<UnblockLoginInfo> => {
    await createUnblockUser({
        signature: unblockLoginSignature,
        user,
        signal,
    })

    const loginResult = await loginToUnblock({
        ...unblockLoginSignature,
        signal,
    })

    return {
        ...user,
        ...loginResult,
    }
}

export const SubmitUserCreateRequest = ({
    account,
    keystoreMap,
    network,
    unblockLoginSignature,
    sessionPassword,
    networkMap,
    networkRPCMap,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    installationId,
    portfolio,
    keystore,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(fetch)
    const liveOnMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loaded':
                liveOnMsg.current({
                    type: 'unblock_user_created',
                    user: loadable.params.user,
                    loginInfo: loadable.data,
                    unblockLoginSignature,
                    address: account.address,
                })
                break

            case 'not_asked':
            case 'loading':
            case 'error':
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [liveOnMsg, loadable, unblockLoginSignature, account])

    switch (loadable.type) {
        case 'not_asked':
            return (
                <CreateUserForm
                    keystore={keystore}
                    network={network}
                    account={account}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_create_user_form_submit':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        unblockLoginSignature,
                                        user: msg.form,
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
                    onClose={() => onMsg({ type: 'close' })}
                    actionBar={
                        <ActionBar
                            account={account}
                            keystore={keystore}
                            network={network}
                            left={
                                <IconButton
                                    variant="on_light"
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    {({ color }) => (
                                        <BackIcon size={24} color={color} />
                                    )}
                                </IconButton>
                            }
                        />
                    }
                />
            )

        case 'loaded':
            // data loader (submitter) -> case loaded: <OTPForm> with LazyLD
            return null

        case 'error':
            const error = parseAppError(loadable.error)

            return (
                <>
                    <LoadingLayout
                        onClose={() => onMsg({ type: 'close' })}
                        actionBar={
                            <ActionBar
                                account={account}
                                keystore={keystore}
                                network={network}
                                left={
                                    <IconButton
                                        variant="on_light"
                                        onClick={() => onMsg({ type: 'close' })}
                                    >
                                        {({ color }) => (
                                            <BackIcon size={24} color={color} />
                                        )}
                                    </IconButton>
                                }
                            />
                        }
                    />

                    {(() => {
                        switch (error.type) {
                            case 'unblock_user_with_such_email_already_exists':
                                return (
                                    <UserEmailAlreadyTaken
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'close':
                                                    setLoadable({
                                                        type: 'not_asked',
                                                    })
                                                    break

                                                case 'on_try_with_different_wallet_clicked':
                                                    onMsg(msg)
                                                    break

                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(msg)
                                            }
                                        }}
                                    />
                                )

                            case 'unblock_user_with_address_already_exists':
                                return (
                                    <LoginExistingUser
                                        network={network}
                                        keyStore={keystore}
                                        account={account}
                                        unblockLoginSignature={
                                            unblockLoginSignature
                                        }
                                        onMsg={onMsg}
                                    />
                                )

                            case 'unblock_nonce_already_in_use':
                                return (
                                    <Modal>
                                        <ResignMsgAndLogin
                                            keystore={keystore}
                                            accountsMap={accountsMap}
                                            feePresetMap={feePresetMap}
                                            gasCurrencyPresetMap={
                                                gasCurrencyPresetMap
                                            }
                                            installationId={installationId}
                                            portfolio={portfolio}
                                            networkRPCMap={networkRPCMap}
                                            account={account}
                                            network={network}
                                            networkMap={networkMap}
                                            keyStoreMap={keystoreMap}
                                            sessionPassword={sessionPassword}
                                            onMsg={(msg) => {
                                                switch (msg.type) {
                                                    case 'close':
                                                        onMsg(msg)
                                                        break
                                                    case 'on_logged_in':
                                                        setLoadable({
                                                            type: 'loaded',
                                                            params: loadable.params,
                                                            data: msg.unblockLoginInfo,
                                                        })
                                                        break
                                                    case 'on_4337_gas_currency_selected':
                                                        onMsg(msg)
                                                        break
                                                    default:
                                                        notReachable(msg)
                                                }
                                            }}
                                        />
                                    </Modal>
                                )

                            default:
                                return (
                                    <AppErrorPopup
                                        error={error}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'close':
                                                    setLoadable({
                                                        type: 'not_asked',
                                                    })
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
                                )
                        }
                    })()}
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
