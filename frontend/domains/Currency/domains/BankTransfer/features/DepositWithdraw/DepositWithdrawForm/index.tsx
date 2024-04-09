import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import {
    OffRampAccount,
    OffRampTransaction,
    OnRampTransaction,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchUnblockTransactions } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUnblockTransactions'
import { fetchUser } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUser'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'
import { fetchPortfolio } from '@zeal/domains/Portfolio/api/fetchPortfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import {
    BankTransferUnblockUserCreated,
    CustomCurrencyMap,
} from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { Form } from './Form'

import { LoadingLayout } from '../LoadingLayout'

type Props = {
    customCurrencies: CustomCurrencyMap
    bankTransferCurrencies: BankTransferCurrencies
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    networkMap: NetworkMap
    feePresetMap: FeePresetMap
    offRampAccounts: OffRampAccount[]
    installationId: string
    sessionPassword: string
    network: Network
    networkRPCMap: NetworkRPCMap
    portfolioMap: PortfolioMap
    account: Account
    loginInfo: UnblockLoginInfo
    bankTransferInfo: BankTransferUnblockUserCreated
    gasCurrencyPresetMap: GasCurrencyPresetMap
    onMsg: (msg: Msg) => void
}

export type Msg = Extract<
    MsgOf<typeof Form>,
    {
        type:
            | 'close'
            | 'unblock_offramp_account_created'
            | 'on_off_ramp_account_become_default'
            | 'kyc_applicant_created'
            | 'on_withdrawal_monitor_fiat_transaction_start'
            | 'on_withdrawal_monitor_fiat_transaction_success'
            | 'import_keys_button_clicked'
            | 'on_predefined_fee_preset_selected'
            | 'on_on_ramp_transfer_success_close_click'
            | 'on_gas_currency_selected'
            | 'on_4337_gas_currency_selected'
            | 'on_contact_support_clicked'
            | 'on_kyc_update_details_clicked'
            | 'on_kyc_start_verification_clicked'
    }
>

type Data = {
    offRampTransactions: OffRampTransaction[]
    onRampTransactions: OnRampTransaction[]
    portfolio: Portfolio
    unblockUser: UnblockUser
}

const fetch = async ({
    portfolioMap,
    bankTransferInfo,
    unblockLoginInfo,
    customCurrencies,
    networkMap,
    networkRPCMap,
}: {
    portfolioMap: PortfolioMap
    bankTransferInfo: BankTransferUnblockUserCreated
    unblockLoginInfo: UnblockLoginInfo
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
}): Promise<Data> => {
    const [unblockUser, transactions, fetchedPortfolio] = await Promise.all([
        fetchUser({ bankTransferInfo }),
        fetchUnblockTransactions({
            unblockLoginInfo,
            bankTransferInfo,
        }),
        getPortfolio({
            address: bankTransferInfo.connectedWalletAddress,
            portfolioMap,
        }) ||
            fetchPortfolio({
                address: bankTransferInfo.connectedWalletAddress,
                customCurrencies,
                forceRefresh: false,
                networkMap,
                networkRPCMap,
            }),
    ])

    return {
        offRampTransactions: transactions.offRampTransactions,
        onRampTransactions: transactions.onRampTransactions,
        portfolio: fetchedPortfolio,
        unblockUser,
    }
}

export const DepositWithdrawForm = ({
    customCurrencies,
    bankTransferCurrencies,
    accountsMap,
    keystoreMap,
    networkMap,
    installationId,
    sessionPassword,
    offRampAccounts,
    network,
    networkRPCMap,
    loginInfo,
    bankTransferInfo,
    onMsg,
    account,
    portfolioMap,
    feePresetMap,
    gasCurrencyPresetMap,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetch, {
        type: 'loading',
        params: {
            portfolioMap,
            bankTransferInfo,
            unblockLoginInfo: loginInfo,
            customCurrencies,
            networkMap,
            networkRPCMap,
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
                <Form
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    portfolio={loadable.data.portfolio}
                    feePresetMap={feePresetMap}
                    accountsMap={accountsMap}
                    keystoreMap={keystoreMap}
                    installationId={installationId}
                    sessionPassword={sessionPassword}
                    network={network}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    unblockLoginInfo={loginInfo}
                    bankTransferInfo={bankTransferInfo}
                    offRampAccounts={offRampAccounts}
                    unblockUser={loadable.data.unblockUser}
                    offRampTransactions={loadable.data.offRampTransactions}
                    onRampTransactions={loadable.data.onRampTransactions}
                    currencies={bankTransferCurrencies}
                    account={account}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'unblock_offramp_account_created':
                            case 'on_off_ramp_account_become_default':
                            case 'kyc_applicant_created':
                            case 'on_withdrawal_monitor_fiat_transaction_start':
                            case 'on_withdrawal_monitor_fiat_transaction_success':
                            case 'import_keys_button_clicked':
                            case 'on_predefined_fee_preset_selected':
                            case 'on_on_ramp_transfer_success_close_click':
                            case 'on_4337_gas_currency_selected':
                            case 'on_contact_support_clicked':
                                onMsg(msg)
                                break
                            case 'user_bank_verification_number_successfully_set':
                                setLoadable({
                                    type: 'loaded',
                                    params: loadable.params,
                                    data: {
                                        ...loadable.data,
                                        unblockUser: {
                                            ...loadable.data.unblockUser,
                                            bankVerificationNumber:
                                                msg.bankVerificationNumber,
                                        },
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
