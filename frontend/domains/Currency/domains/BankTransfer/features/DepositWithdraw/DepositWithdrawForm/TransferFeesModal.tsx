import { FormattedMessage, useIntl } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Divider } from '@zeal/uikit/Divider'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import {
    MONTHLY_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY,
    POST_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY,
} from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { FormattedFeeInDefaultCurrencyWhichCanBeZero } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrencyWhichCanBeZero'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'

import { DepositPollable } from './DepositForm/Form/validation'
import { WithdrawPollable } from './WithdrawalForm/Form/validation'

type Props = {
    knownCurrencies: KnownCurrencies
    pollable: DepositPollable | WithdrawPollable
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const TransferFeesModal = ({
    onMsg,
    pollable,
    knownCurrencies,
}: Props) => (
    <Popup.Layout onMsg={onMsg}>
        <Header
            title={
                <FormattedMessage
                    id="bank_transfers.deposit.modal.transfer-fees.title"
                    defaultMessage="Transfer fees"
                />
            }
        />

        <Column spacing={20}>
            <Column spacing={8}>
                <TotalFees
                    pollable={pollable}
                    knownCurrencies={knownCurrencies}
                />
            </Column>

            <Column spacing={8}>
                <Text variant="paragraph" color="textPrimary">
                    <FormattedMessage
                        id="bank_transfers.deposit.modal.transfer-fees.content.monthly-limits"
                        defaultMessage="Your monthly limits"
                    />
                </Text>

                <Divider variant="secondary" />

                <Row spacing={4}>
                    <Text variant="paragraph" color="textPrimary">
                        <FormattedMessage
                            id="bank_transfers.deposit.modal.transfer-fees.content.free"
                            defaultMessage="Free"
                        />
                    </Text>
                    <Text variant="paragraph" color="textSecondary">
                        <FormattedMessage
                            id="bank_transfers.deposit.modal.transfer-fees.content.fee-above"
                            defaultMessage="0.2% fee above"
                        />
                    </Text>
                    <Spacer />
                    <Text variant="paragraph" color="textPrimary">
                        <FormattedTokenBalanceInDefaultCurrency
                            knownCurrencies={knownCurrencies}
                            money={MONTHLY_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY}
                        />
                    </Text>
                </Row>

                <Row spacing={4}>
                    <Text variant="paragraph" color="textPrimary">
                        <FormattedMessage
                            id="bank_transfers.deposit.modal.transfer-fees.content.max"
                            defaultMessage="Max"
                        />
                    </Text>
                    <Spacer />
                    <Text variant="paragraph" color="textPrimary">
                        <FormattedTokenBalanceInDefaultCurrency
                            knownCurrencies={knownCurrencies}
                            money={POST_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY}
                        />
                    </Text>
                </Row>
            </Column>
        </Column>
    </Popup.Layout>
)

const TotalFees = ({
    pollable,
    knownCurrencies,
}: {
    pollable: DepositPollable | WithdrawPollable
    knownCurrencies: KnownCurrencies
}) => {
    const { formatNumber } = useIntl()

    return (
        <Row spacing={4}>
            <Text variant="paragraph" color="textPrimary">
                <FormattedMessage
                    id="bank_transfers.deposit.modal.transfer_fees.content.total_fees"
                    defaultMessage="Total fees"
                />
            </Text>

            <Spacer />

            {(() => {
                switch (pollable.type) {
                    case 'loading':
                    case 'reloading':
                        return (
                            <Skeleton
                                variant="default"
                                width={40}
                                height={16}
                            />
                        )

                    case 'loaded':
                    case 'subsequent_failed':
                        // TODO Zeal vs Partner fees now not available in the data so showing only total
                        const feeInfo = pollable.data.fee
                        return (
                            <>
                                <Text
                                    variant="paragraph"
                                    color="textSecondary"
                                    weight="regular"
                                >
                                    {formatNumber(feeInfo.percentageFee, {
                                        style: 'percent',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                    })}
                                </Text>

                                <Text
                                    variant="paragraph"
                                    color="textPrimary"
                                    weight="regular"
                                >
                                    <FormattedFeeInDefaultCurrencyWhichCanBeZero
                                        knownCurrencies={knownCurrencies}
                                        money={feeInfo.amount}
                                    />
                                </Text>
                            </>
                        )

                    case 'error':
                        return (
                            <Text
                                variant="paragraph"
                                color="textStatusCriticalOnColor"
                                weight="regular"
                            >
                                <FormattedMessage
                                    id="bank_transfers.deposit.failed_to_load_fee"
                                    defaultMessage="Unknown"
                                />
                            </Text>
                        )

                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable)
                }
            })()}
        </Row>
    )
}
