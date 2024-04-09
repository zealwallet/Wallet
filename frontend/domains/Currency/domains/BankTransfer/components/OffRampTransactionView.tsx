import { FormattedMessage, useIntl } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { GroupHeader, Section } from '@zeal/uikit/Group'
import { BoldCrossRound } from '@zeal/uikit/Icon/BoldCrossRound'
import { BoldTickRound } from '@zeal/uikit/Icon/BoldTickRound'
import { ListItem } from '@zeal/uikit/ListItem'
import { Spinner } from '@zeal/uikit/Spinner'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import {
    CryptoCurrency,
    CurrencyId,
    FiatCurrency,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import {
    KycStatus,
    OffRampTransactionEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { ImperativeError } from '@zeal/domains/Error'
import { FormattedFiatCurrency } from '@zeal/domains/Money/components/FormattedFiatCurrency'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'

type Props = {
    variant: // TODO @resetko-zeal this probably would look better if unried to two separate components, one for simulation and one for bank transfer flow
    | {
              type: 'status'
              offRampTransactionEvent: OffRampTransactionEvent | null
              kycStatus: KycStatus
          }
        | { type: 'no_status' }
    withdrawalRequest: WithdrawalRequest
    networkMap: NetworkMap
}
export type Msg = { type: 'close' }

export const OffRampTransactionView = ({
    withdrawalRequest,
    networkMap,
    variant,
}: Props) => {
    const { formatMessage } = useIntl()
    const { knownCurrencies } = withdrawalRequest

    const fromCurrency = getCryptoCurrency({
        cryptoCurrencyId: withdrawalRequest.fromAmount.currencyId,
        knownCurrencies,
    })

    const toCurrency = getFiatCurrency({
        fiatCurrencyId: (() => {
            switch (withdrawalRequest.type) {
                case 'full_withdrawal_request':
                    return withdrawalRequest.toAmount.currencyId
                case 'incomplete_withdrawal_request':
                    return withdrawalRequest.currencyId
                default:
                    return notReachable(withdrawalRequest)
            }
        })(),
        knownCurrencies,
    })

    const fromNetwork = findNetworkByHexChainId(
        fromCurrency.networkHexChainId,
        networkMap
    )

    return (
        <Column spacing={16}>
            <Section>
                <GroupHeader
                    left={({ color, textVariant, textWeight }) => (
                        <Text
                            color={color}
                            variant={textVariant}
                            weight={textWeight}
                        >
                            <FormattedMessage
                                id="currency.withdrawal.amount_from"
                                defaultMessage="From"
                            />
                        </Text>
                    )}
                    right={null}
                />
                <ListItem
                    aria-current={false}
                    size="regular"
                    primaryText={fromCurrency.code}
                    avatar={({ size }) => (
                        <Avatar
                            rightBadge={({ size }) =>
                                fromNetwork && (
                                    <Badge network={fromNetwork} size={size} />
                                )
                            }
                            size={size}
                            currency={fromCurrency}
                        />
                    )}
                    side={{
                        title: (
                            <>
                                -
                                <FormattedTokenBalances
                                    money={withdrawalRequest.fromAmount}
                                    knownCurrencies={knownCurrencies}
                                />
                            </>
                        ),
                        rightIcon: ({ size }) => {
                            switch (variant.type) {
                                case 'status':
                                    return (
                                        <BoldTickRound
                                            aria-label={formatMessage({
                                                id: 'withdrawal_request.completed',
                                                defaultMessage: 'Completed',
                                            })}
                                            size={size}
                                            color="iconStatusSuccess"
                                        />
                                    )
                                case 'no_status':
                                    return null

                                default:
                                    return notReachable(variant)
                            }
                        },
                    }}
                />
            </Section>
            <Section>
                <GroupHeader
                    left={({ color, textVariant, textWeight }) => (
                        <Text
                            color={color}
                            variant={textVariant}
                            weight={textWeight}
                        >
                            <FormattedMessage
                                id="currency.withdrawal.amount_to"
                                defaultMessage="To"
                            />
                        </Text>
                    )}
                    right={null}
                />
                <ListItem
                    aria-current={false}
                    size="regular"
                    primaryText={toCurrency.code}
                    avatar={({ size }) => (
                        <Avatar
                            rightBadge={() => null}
                            size={size}
                            currency={toCurrency}
                        />
                    )}
                    side={{
                        title: (() => {
                            switch (withdrawalRequest.type) {
                                case 'full_withdrawal_request':
                                    return (
                                        <>
                                            +
                                            <FormattedFiatCurrency
                                                money={
                                                    withdrawalRequest.toAmount
                                                }
                                                knownCurrencies={
                                                    knownCurrencies
                                                }
                                                minimumFractionDigits={2}
                                            />
                                        </>
                                    )

                                case 'incomplete_withdrawal_request':
                                    return (
                                        <Text
                                            variant="paragraph"
                                            color="textDisabled"
                                            weight="regular"
                                        >
                                            unknown
                                        </Text>
                                    )

                                default:
                                    return notReachable(withdrawalRequest)
                            }
                        })(),
                        rightIcon: ({ size }) => {
                            switch (variant.type) {
                                case 'status':
                                    return (
                                        <FiatStatusIcon
                                            kycStatus={variant.kycStatus}
                                            transactionEvent={
                                                variant.offRampTransactionEvent
                                            }
                                            size={size}
                                        />
                                    )
                                case 'no_status':
                                    return null

                                default:
                                    return notReachable(variant)
                            }
                        },
                    }}
                />
            </Section>
        </Column>
    )
}

const FiatStatusIcon = ({
    transactionEvent,
    kycStatus,
    size,
}: {
    transactionEvent: OffRampTransactionEvent | null
    kycStatus: KycStatus
    size: number
}) => {
    const { formatMessage } = useIntl()

    if (!transactionEvent) {
        return (
            <Spinner
                aria-label={formatMessage({
                    id: 'withdrawal_request.pending',
                    defaultMessage: 'Pending',
                })}
                size={size}
                color="iconStatusNeutral"
            />
        )
    }

    switch (transactionEvent.type) {
        case 'unblock_offramp_in_progress':
        case 'unblock_offramp_failed':
        case 'unblock_offramp_fiat_transfer_issued':
        case 'unblock_offramp_on_hold_compliance':
            return (
                <Spinner
                    aria-label={formatMessage({
                        id: 'withdrawal_request.pending',
                        defaultMessage: 'Pending',
                    })}
                    size={size}
                    color="iconStatusNeutral"
                />
            )

        case 'unblock_offramp_on_hold_kyc':
            switch (kycStatus.type) {
                case 'not_started':
                case 'approved':
                case 'paused':
                case 'in_progress':
                    return (
                        <Spinner
                            aria-label={formatMessage({
                                id: 'withdrawal_request.pending',
                                defaultMessage: 'Pending',
                            })}
                            size={size}
                            color="iconStatusNeutral"
                        />
                    )
                case 'failed':
                    return (
                        <BoldCrossRound
                            aria-label={formatMessage({
                                id: 'withdrawal_request.kyc-failed',
                                defaultMessage: 'KycFailed',
                            })}
                            size={size}
                            color="iconStatusWarning"
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(kycStatus)
            }

        case 'unblock_offramp_success':
            return (
                <BoldTickRound
                    aria-label={formatMessage({
                        id: 'withdrawal_request.completed',
                        defaultMessage: 'Completed',
                    })}
                    size={size}
                    color="iconStatusSuccess"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(transactionEvent)
    }
}

const getCryptoCurrency = ({
    cryptoCurrencyId,
    knownCurrencies,
}: {
    cryptoCurrencyId: CurrencyId
    knownCurrencies: KnownCurrencies
}): CryptoCurrency => {
    const currency = knownCurrencies[cryptoCurrencyId]
    if (!currency) {
        throw new ImperativeError('currency is missing in `knownCurrencies`')
    }

    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError('Fiat currency can not be here')

        case 'CryptoCurrency':
            return currency
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}

const getFiatCurrency = ({
    fiatCurrencyId,
    knownCurrencies,
}: {
    fiatCurrencyId: CurrencyId
    knownCurrencies: KnownCurrencies
}): FiatCurrency => {
    const currency = knownCurrencies[fiatCurrencyId]
    if (!currency) {
        throw new ImperativeError('currency is missing in `knownCurrencies`')
    }

    switch (currency.type) {
        case 'CryptoCurrency':
            throw new ImperativeError('Fiat currency can not be here')

        case 'FiatCurrency':
            return currency
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
