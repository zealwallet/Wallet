import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { ApprovalTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { HighSpendLimitInfo } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/HighSpendLimitInfo'

import { Form } from './Form'

import { SpendLimitInfo } from '../../SpendLimitInfo'

type Props = {
    state: State
    originalEthSendTransaction: EthSendTransaction
    transaction: ApprovalTransaction
    network: Network
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Form>

export type State =
    | { type: 'closed' }
    | { type: 'form' }
    | { type: 'spend_limit_info' }
    | { type: 'high_spend_limit_warning' }

export const Modal = ({
    onMsg,
    state,
    originalEthSendTransaction,
    transaction,
    network,
    networkRPCMap,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'form':
            return (
                <UIModal>
                    <Form
                        originalEthSendTransaction={originalEthSendTransaction}
                        transaction={transaction}
                        network={network}
                        networkRPCMap={networkRPCMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'spend_limit_info':
            return <SpendLimitInfo onMsg={onMsg} />
        case 'high_spend_limit_warning':
            return <HighSpendLimitInfo onMsg={onMsg} />
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
