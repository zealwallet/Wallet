import { useEffect } from 'react'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { Account } from '@zeal/domains/Account'
import { OffRampAccount } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchOffRampAccounts } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUnblockAccounts'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import {
    BankTransferUnblockUserCreated,
    BankTransferUnblockUserCreatedForSafeWallet,
} from '@zeal/domains/Storage'

import { SubmitCreateAccount } from './SubmitCreateAccount'

import { LoadingLayout } from '../LoadingLayout'

type Props = {
    currencies: BankTransferCurrencies
    unblockLoginInfo: UnblockLoginInfo
    bankTransferInfo:
        | BankTransferUnblockUserCreated
        | BankTransferUnblockUserCreatedForSafeWallet
    network: Network
    keyStoreMap: KeyStoreMap
    account: Account
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'unblock_offramp_account_created'
          account: OffRampAccount
      }
    | {
          type: 'unblock_offramp_account_fetched'
          offRampAccounts: OffRampAccount[]
      }

export const SetupOfframpBankAccount = ({
    currencies,
    unblockLoginInfo,
    bankTransferInfo,
    network,
    keyStoreMap,
    account,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetchOffRampAccounts, {
        type: 'loading',
        params: {
            unblockLoginInfo,
            bankTransferInfo,
            currencies,
        },
    })

    const liveOnMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loaded':
                const offrampAccount = loadable.data.find((account) => {
                    return account.mainBeneficiary
                })

                if (offrampAccount) {
                    liveOnMsg.current({
                        type: 'unblock_offramp_account_fetched',
                        offRampAccounts: loadable.data,
                    })
                }
                // account did not exist and will be by children

                break
            case 'loading':
            case 'error':
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [liveOnMsg, loadable])

    switch (loadable.type) {
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
            const offRampAccount = loadable.data[0]
            return offRampAccount ? null : (
                <SubmitCreateAccount
                    currencies={currencies}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    account={account}
                    unblockLoginInfo={unblockLoginInfo}
                    bankTransferInfo={bankTransferInfo}
                    onMsg={onMsg}
                />
            )

        case 'error':
            const error = parseAppError(loadable.error)
            return (
                <AppErrorPopup
                    error={error}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'try_again_clicked':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        unblockLoginInfo,
                                        bankTransferInfo,
                                        currencies,
                                    },
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
