import { Column } from '@zeal/uikit/Column'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { IconButton } from '@zeal/uikit/IconButton'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import {
    KycStatus,
    OffRampTransactionEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'

import { FiatTransferCompleted } from './FiatTransferCompleted'
import { FiatTransferInProgress } from './FiatTransferInProgress'
import { OnHoldKyc } from './OnHoldKyc'

type Props = {
    now: number
    startedAt: number
    network: Network
    networkMap: NetworkMap
    account: Account
    keyStoreMap: KeyStoreMap
    withdrawalRequest: WithdrawalRequest
    offRampTransactionEvent: OffRampTransactionEvent | null
    transactionHash: string
    kycStatus: KycStatus
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | MsgOf<typeof OnHoldKyc>

export const Layout = ({
    onMsg,
    account,
    keyStoreMap,
    network,
    networkMap,
    withdrawalRequest,
    offRampTransactionEvent,
    now,
    startedAt,
    transactionHash,
    kycStatus,
}: Props) => {
    return (
        <Screen padding="form" background="light">
            <ActionBar
                network={network}
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                right={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <CloseCross size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={12} alignY="stretch">
                {(() => {
                    if (!offRampTransactionEvent) {
                        return (
                            <FiatTransferInProgress
                                kycStatus={kycStatus}
                                network={network}
                                networkMap={networkMap}
                                now={now}
                                offRampTransactionEvent={
                                    offRampTransactionEvent
                                }
                                startedAt={startedAt}
                                transactionHash={transactionHash}
                                withdrawalRequest={withdrawalRequest}
                                onMsg={onMsg}
                            />
                        )
                    }

                    switch (offRampTransactionEvent.type) {
                        case 'unblock_offramp_fiat_transfer_issued':
                        case 'unblock_offramp_in_progress':
                        case 'unblock_offramp_on_hold_compliance':
                        case 'unblock_offramp_failed':
                            return (
                                <FiatTransferInProgress
                                    kycStatus={kycStatus}
                                    network={network}
                                    networkMap={networkMap}
                                    now={now}
                                    offRampTransactionEvent={
                                        offRampTransactionEvent
                                    }
                                    startedAt={startedAt}
                                    transactionHash={transactionHash}
                                    withdrawalRequest={withdrawalRequest}
                                    onMsg={onMsg}
                                />
                            )

                        case 'unblock_offramp_on_hold_kyc':
                            return (
                                <OnHoldKyc
                                    kycStatus={kycStatus}
                                    network={network}
                                    networkMap={networkMap}
                                    now={now}
                                    offRampTransactionEvent={
                                        offRampTransactionEvent
                                    }
                                    onMsg={onMsg}
                                    startedAt={startedAt}
                                    transactionHash={transactionHash}
                                    withdrawalRequest={withdrawalRequest}
                                />
                            )

                        case 'unblock_offramp_success':
                            return (
                                <FiatTransferCompleted
                                    kycStatus={kycStatus}
                                    network={network}
                                    networkMap={networkMap}
                                    offRampTransactionEvent={
                                        offRampTransactionEvent
                                    }
                                    transactionHash={transactionHash}
                                    withdrawalRequest={withdrawalRequest}
                                    onMsg={onMsg}
                                />
                            )

                        default:
                            return notReachable(offRampTransactionEvent)
                    }
                })()}
            </Column>
        </Screen>
    )
}
