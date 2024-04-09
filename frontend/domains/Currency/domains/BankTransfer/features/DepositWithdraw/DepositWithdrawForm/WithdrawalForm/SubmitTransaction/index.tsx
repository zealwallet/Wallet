import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import {
    UnblockUser,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchUserOffRampAddress } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUserOffRampAddress'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { Flow } from './Flow'

import { LoadingLayout } from '../../../LoadingLayout'

type Props = {
    unblockLoginInfo: UnblockLoginInfo
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    installationId: string
    sessionPassword: string
    account: Account
    withdrawalRequest: WithdrawalRequest
    network: Network
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    bankTransferInfo: BankTransferUnblockUserCreated
    bankTransferCurrencies: BankTransferCurrencies
    portfolio: Portfolio
    gasCurrencyPresetMap: GasCurrencyPresetMap
    unblockUser: UnblockUser
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof Flow>

export const SubmitTransaction = ({
    unblockLoginInfo,
    network,
    accountsMap,
    keystoreMap,
    installationId,
    sessionPassword,
    account,
    networkMap,
    networkRPCMap,
    onMsg,
    bankTransferInfo,
    withdrawalRequest,
    feePresetMap,
    bankTransferCurrencies,
    portfolio,
    gasCurrencyPresetMap,
    unblockUser,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetchUserOffRampAddress, {
        type: 'loading',
        params: {
            unblockLoginInfo,
            bankTransferInfo,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return (
                <LoadingLayout
                    account={account}
                    network={network}
                    keyStoreMap={keystoreMap}
                    onMsg={onMsg}
                />
            )
        case 'loaded':
            return (
                <Flow
                    unblockUser={unblockUser}
                    portfolio={portfolio}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    bankTransferCurrencies={bankTransferCurrencies}
                    feePresetMap={feePresetMap}
                    unblockLoginInfo={unblockLoginInfo}
                    bankTransferInfo={bankTransferInfo}
                    accountsMap={accountsMap}
                    keystoreMap={keystoreMap}
                    installationId={installationId}
                    sessionPassword={sessionPassword}
                    account={account}
                    withdrawalRequest={withdrawalRequest}
                    network={network}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    toAddress={loadable.data}
                    onMsg={onMsg}
                />
            )
        case 'error':
            return (
                <>
                    <LoadingLayout
                        account={account}
                        network={network}
                        keyStoreMap={keystoreMap}
                        onMsg={onMsg}
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

                                default:
                                    notReachable(msg)
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
