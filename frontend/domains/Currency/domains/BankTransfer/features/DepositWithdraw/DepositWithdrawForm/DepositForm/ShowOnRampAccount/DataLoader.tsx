import { noop, notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { UnblockUser } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { fetchOnRampAccounts } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUnblockAccounts'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { Flow } from './Flow'

import { LoadingLayout } from '../../../LoadingLayout'

type Props = {
    currencies: BankTransferCurrencies
    network: Network
    networkMap: NetworkMap
    keyStoreMap: KeyStoreMap
    account: Account
    unblockLoginInfo: UnblockLoginInfo
    bankTransferInfo: BankTransferUnblockUserCreated
    form: OnRampFeeParams
    unblockUser: UnblockUser
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof Flow>

export const DataLoader = ({
    form,
    currencies,
    onMsg,
    network,
    unblockLoginInfo,
    bankTransferInfo,
    keyStoreMap,
    account,
    unblockUser,
    networkMap,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetchOnRampAccounts, {
        type: 'loading',
        params: {
            unblockLoginInfo,
            bankTransferInfo,
            currencies,
        },
    })
    switch (loadable.type) {
        case 'loading':
            return (
                <LoadingLayout
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    onMsg={noop}
                />
            )
        case 'loaded':
            return (
                <Flow
                    networkMap={networkMap}
                    unblockUser={unblockUser}
                    currencies={currencies}
                    onRampAccounts={loadable.data}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    account={account}
                    unblockLoginInfo={unblockLoginInfo}
                    bankTransferInfo={bankTransferInfo}
                    form={form}
                    onMsg={onMsg}
                />
            )

        case 'error':
            return (
                <>
                    <LoadingLayout
                        account={account}
                        network={network}
                        keyStoreMap={keyStoreMap}
                        onMsg={noop}
                    />
                    <AppErrorPopup
                        error={parseAppError(loadable.error)}
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
                </>
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
