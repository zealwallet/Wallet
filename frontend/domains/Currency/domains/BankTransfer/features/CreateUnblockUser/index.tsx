import { useEffect } from 'react'

import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import {
    loginToUnblock,
    UnblockLoginInfo,
} from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { ResignMsgAndLogin } from '@zeal/domains/Currency/domains/BankTransfer/features/ResignMsgAndLogin'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { EOA, KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { SubmitUserCreateRequest } from './SubmitUserCreateRequest'
import { UserAssociatedWithOtherMerchant } from './UserAssociatedWithOtherMerchant'

type Props = {
    keystore: EOA
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    unblockLoginSignature: UnblockLoginSignature
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    accountsMap: AccountsMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    portfolio: Portfolio | null
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_unblock_login_success'
          unblockLoginInfo: UnblockLoginInfo
          unblockLoginSignature: UnblockLoginSignature
      }
    | Extract<
          MsgOf<typeof SubmitUserCreateRequest>,
          {
              type:
                  | 'unblock_user_created'
                  | 'on_try_with_different_wallet_clicked'
          }
      >
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

export const CreateUnblockUser = ({
    keystore,
    unblockLoginSignature,
    keyStoreMap,
    network,
    networkMap,
    sessionPassword,
    account,
    networkRPCMap,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    installationId,
    portfolio,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(loginToUnblock, {
        type: 'loading',
        params: unblockLoginSignature,
    })

    const liveOnMsg = useLiveRef(onMsg)
    const liveSignature = useLiveRef(unblockLoginSignature)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'error':
                break
            case 'loaded':
                liveOnMsg.current({
                    type: 'on_unblock_login_success',
                    unblockLoginInfo: loadable.data,
                    unblockLoginSignature: liveSignature.current,
                })
                break

            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [liveOnMsg, liveSignature, loadable])

    switch (loadable.type) {
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
            return null

        case 'error': {
            const error = parseAppError(loadable.error)

            switch (error.type) {
                case 'unblock_login_user_did_not_exists':
                    return (
                        <SubmitUserCreateRequest
                            keystore={keystore}
                            keyStoreMap={keyStoreMap}
                            accountsMap={accountsMap}
                            feePresetMap={feePresetMap}
                            gasCurrencyPresetMap={gasCurrencyPresetMap}
                            installationId={installationId}
                            portfolio={portfolio}
                            networkRPCMap={networkRPCMap}
                            keystoreMap={keyStoreMap}
                            network={network}
                            unblockLoginSignature={loadable.params}
                            account={account}
                            networkMap={networkMap}
                            sessionPassword={sessionPassword}
                            onMsg={onMsg}
                        />
                    )

                case 'unblock_user_associated_with_other_merchant':
                    return <UserAssociatedWithOtherMerchant onMsg={onMsg} />

                case 'unblock_nonce_already_in_use':
                    return (
                        <ResignMsgAndLogin
                            keystore={keystore}
                            accountsMap={accountsMap}
                            feePresetMap={feePresetMap}
                            gasCurrencyPresetMap={gasCurrencyPresetMap}
                            installationId={installationId}
                            portfolio={portfolio}
                            networkRPCMap={networkRPCMap}
                            account={account}
                            network={network}
                            networkMap={networkMap}
                            keyStoreMap={keyStoreMap}
                            sessionPassword={sessionPassword}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        onMsg(msg)
                                        break
                                    case 'on_logged_in':
                                        setLoadable({
                                            type: 'loaded',
                                            params: msg.loginSignature,
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
                    )

                /* istanbul ignore next */
                default:
                    return (
                        <AppErrorPopup
                            error={error}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        onMsg({ type: 'close' })
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
        }

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
