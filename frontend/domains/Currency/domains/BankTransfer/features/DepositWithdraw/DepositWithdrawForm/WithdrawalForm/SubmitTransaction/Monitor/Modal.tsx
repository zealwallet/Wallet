import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { Kyc } from '@zeal/domains/Currency/domains/BankTransfer/features/KYC'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

type Props = {
    state: State
    unblockLoginInfo: UnblockLoginInfo
    network: Network
    account: Account
    keyStoreMap: KeyStoreMap
    bankTransferInfo: BankTransferUnblockUserCreated

    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'kyc_process' }

type Msg = MsgOf<typeof Kyc>

export const Modal = ({
    state,
    account,
    bankTransferInfo,
    keyStoreMap,
    network,
    unblockLoginInfo,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'kyc_process':
            return (
                <UIModal>
                    <Kyc
                        account={account}
                        bankTransferInfo={bankTransferInfo}
                        keyStoreMap={keyStoreMap}
                        loginInfo={unblockLoginInfo}
                        network={network}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        default:
            return notReachable(state)
    }
}
