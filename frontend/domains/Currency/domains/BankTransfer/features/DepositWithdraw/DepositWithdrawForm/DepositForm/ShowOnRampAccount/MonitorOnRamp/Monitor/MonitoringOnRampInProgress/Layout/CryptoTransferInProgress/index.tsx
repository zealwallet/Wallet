import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'

import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KnownCurrencies } from '@zeal/domains/Currency'
import {
    OnRampTransactionCryptoTransferIssuedEvent,
    OnRampTransactionFailedEvent,
    OnRampTransactionOnHoldComplianceEvent,
    OnRampTransactionOutsideTransferInReviewEvent,
    OnRampTransactionTransferApprovedEvent,
    OnRampTransactionTransferReceivedEvent,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { NetworkMap } from '@zeal/domains/Network'

import { Footer } from './Footer'

import { CryptoPendingSection } from '../CryptoPendingSection'
import { FiatCompletedSection } from '../FiatCompletedSection'

type Props = {
    networkMap: NetworkMap
    event:
        | OnRampTransactionFailedEvent
        | OnRampTransactionOnHoldComplianceEvent
        | OnRampTransactionOutsideTransferInReviewEvent
        | OnRampTransactionTransferApprovedEvent
        | OnRampTransactionTransferReceivedEvent
        | OnRampTransactionCryptoTransferIssuedEvent
    now: number
    startedAt: number
    form: OnRampFeeParams
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Footer>

export const CryptoTransferInProgress = ({
    event,
    form,
    knownCurrencies,
    networkMap,
    now,
    startedAt,
    onMsg,
}: Props) => {
    return (
        <Content
            header={
                <Content.Header
                    title={
                        <FormattedMessage
                            id="currency.bankTransfer.deposit_status.title"
                            defaultMessage="Deposit"
                        />
                    }
                />
            }
            footer={
                <Footer
                    event={event}
                    now={now}
                    startedAt={startedAt}
                    onMsg={onMsg}
                />
            }
        >
            <Column spacing={16}>
                <FiatCompletedSection
                    event={event}
                    knownCurrencies={knownCurrencies}
                />

                <CryptoPendingSection
                    event={event}
                    form={form}
                    knownCurrencies={knownCurrencies}
                    networkMap={networkMap}
                />
            </Column>
        </Content>
    )
}
