import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import {
    OnRampTransactionEvent,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { LookForUnfinishedOnRamp } from './LookForUnfinishedOnRamp'
import { Monitor } from './Monitor'

type Props = {
    network: Network
    networkMap: NetworkMap
    account: Account
    keyStoreMap: KeyStoreMap
    event: OnRampTransactionEvent | null
    form: OnRampFeeParams
    bankTransferInfo: BankTransferUnblockUserCreated
    bankTransferCurrencies: BankTransferCurrencies
    unblockUser: UnblockUser
    unblockLoginInfo: UnblockLoginInfo
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | MsgOf<typeof Monitor>

type State =
    | { type: 'looking_for_unfinished_on_ramp' }
    | {
          type: 'monitoring_on_ramp_in_progress'
          event: OnRampTransactionEvent
      }

export const MonitorOnRamp = ({
    onMsg,
    account,
    keyStoreMap,
    network,
    form,
    bankTransferCurrencies,
    bankTransferInfo,
    networkMap,
    unblockUser,
    unblockLoginInfo,
    event,
}: Props) => {
    const [state, setState] = useState<State>(
        event
            ? { type: 'monitoring_on_ramp_in_progress', event }
            : { type: 'looking_for_unfinished_on_ramp' }
    )

    switch (state.type) {
        case 'looking_for_unfinished_on_ramp':
            return (
                <LookForUnfinishedOnRamp
                    networkMap={networkMap}
                    account={account}
                    bankTransferCurrencies={bankTransferCurrencies}
                    form={form}
                    keyStoreMap={keyStoreMap}
                    bankTransferInfo={bankTransferInfo}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break

                            case 'on_onramp_found':
                                setState({
                                    type: 'monitoring_on_ramp_in_progress',
                                    event: msg.event,
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        case 'monitoring_on_ramp_in_progress':
            return (
                <Monitor
                    unblockUser={unblockUser}
                    networkMap={networkMap}
                    account={account}
                    bankTransferCurrencies={bankTransferCurrencies}
                    form={form}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    previousEvent={state.event}
                    bankTransferInfo={bankTransferInfo}
                    unblockLoginInfo={unblockLoginInfo}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(state)
    }
}
