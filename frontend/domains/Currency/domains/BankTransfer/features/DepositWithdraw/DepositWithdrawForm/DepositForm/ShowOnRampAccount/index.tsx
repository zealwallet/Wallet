import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { UnblockUser } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { DataLoader } from './DataLoader'

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

export type Msg = MsgOf<typeof DataLoader>

export const ShowOnRampAccount = ({
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
    return (
        <DataLoader
            networkMap={networkMap}
            unblockUser={unblockUser}
            currencies={currencies}
            form={form}
            network={network}
            keyStoreMap={keyStoreMap}
            account={account}
            unblockLoginInfo={unblockLoginInfo}
            bankTransferInfo={bankTransferInfo}
            onMsg={onMsg}
        />
    )
}
