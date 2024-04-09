import { useEffect } from 'react'

import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import {
    loginToUnblock,
    UnblockLoginInfo,
} from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { SignUnblockLoginMsg } from '@zeal/domains/Currency/domains/BankTransfer/features/SignUnblockLoginMsg'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { EOA, KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

type Props = {
    keystore: EOA
    account: Account
    network: Network
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    keyStoreMap: KeyStoreMap
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
          type: 'on_logged_in'
          account: Account
          loginSignature: UnblockLoginSignature
          unblockLoginInfo: UnblockLoginInfo
      }
    | Extract<
          MsgOf<typeof SignUnblockLoginMsg>,
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

export const ResignMsgAndLogin = ({
    account,
    sessionPassword,
    network,
    networkMap,
    keyStoreMap,
    networkRPCMap,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    installationId,
    portfolio,
    keystore,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(loginToUnblock, {
        type: 'not_asked',
    })

    const liveOnMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'not_asked':
            case 'loading':
            case 'error':
                break
            case 'loaded':
                liveOnMsg.current({
                    type: 'on_logged_in',
                    account,
                    loginSignature: loadable.params,
                    unblockLoginInfo: loadable.data,
                })
                break
            default:
                notReachable(loadable)
        }
    }, [account, liveOnMsg, loadable])

    switch (loadable.type) {
        case 'not_asked':
            return (
                <SignUnblockLoginMsg
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
                            case 'on_message_signed':
                                setLoadable({
                                    type: 'loading',
                                    params: msg.loginSignature,
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
        case 'loading':
            return (
                <LoadingLayout
                    actionBar={
                        <ActionBar
                            account={account}
                            keystore={getKeyStore({
                                keyStoreMap: keyStoreMap,
                                address: account.address,
                            })}
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

        case 'error':
            const error = parseAppError(loadable.error)

            return (
                <>
                    <LoadingLayout
                        actionBar={
                            <ActionBar
                                account={account}
                                keystore={getKeyStore({
                                    keyStoreMap: keyStoreMap,
                                    address: account.address,
                                })}
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
                </>
            )

        default:
            return notReachable(loadable)
    }
}
