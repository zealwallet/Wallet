import { Column } from '@zeal/uikit/Column'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { IconButton } from '@zeal/uikit/IconButton'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { KnownCurrencies } from '@zeal/domains/Currency'
import {
    KycStatus,
    OnRampTransactionEvent,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'

import { Completed } from './Completed'
import { CryptoTransferInProgress } from './CryptoTransferInProgress'
import { OnHoldKyc } from './OnHoldKyc'

type Props = {
    now: number
    startedAt: number
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    form: OnRampFeeParams
    onRampTransactionEvent: OnRampTransactionEvent
    keyStatus: KycStatus
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | MsgOf<typeof Completed> | MsgOf<typeof OnHoldKyc>

export const Layout = ({
    onMsg,
    now,
    startedAt,
    form,
    account,
    keyStoreMap,
    network,
    onRampTransactionEvent,
    knownCurrencies,
    networkMap,
    keyStatus,
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

            <Column spacing={12} fill>
                {(() => {
                    switch (onRampTransactionEvent.type) {
                        case 'unblock_onramp_crypto_transfer_issued':
                        case 'unblock_onramp_failed':
                        case 'unblock_onramp_transfer_approved':
                        case 'unblock_onramp_transfer_in_review':
                        case 'unblock_onramp_transfer_on_hold_compliance':
                        case 'unblock_onramp_transfer_received':
                            return (
                                <CryptoTransferInProgress
                                    networkMap={networkMap}
                                    event={onRampTransactionEvent}
                                    form={form}
                                    knownCurrencies={knownCurrencies}
                                    now={now}
                                    startedAt={startedAt}
                                    onMsg={onMsg}
                                />
                            )

                        case 'unblock_onramp_transfer_on_hold_kyc': {
                            return (
                                <OnHoldKyc
                                    kycStatus={keyStatus}
                                    onMsg={onMsg}
                                    networkMap={networkMap}
                                    event={onRampTransactionEvent}
                                    form={form}
                                    knownCurrencies={knownCurrencies}
                                    now={now}
                                    startedAt={startedAt}
                                />
                            )
                        }

                        case 'unblock_onramp_process_completed':
                            return (
                                <Completed
                                    networkMap={networkMap}
                                    event={onRampTransactionEvent}
                                    knownCurrencies={knownCurrencies}
                                    onMsg={onMsg}
                                />
                            )

                        default:
                            return notReachable(onRampTransactionEvent)
                    }
                })()}
            </Column>
        </Screen>
    )
}
