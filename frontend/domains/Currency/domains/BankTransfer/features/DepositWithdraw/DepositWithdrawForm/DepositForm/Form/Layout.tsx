import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { BannerLimit } from '@zeal/uikit/BannerLimit'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { BoldId } from '@zeal/uikit/Icon/BoldId'
import { BoldLock } from '@zeal/uikit/Icon/BoldLock'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { IconButton } from '@zeal/uikit/IconButton'
import { AmountInput } from '@zeal/uikit/Input/AmountInput'
import { NextStepSeparator } from '@zeal/uikit/NextStepSeparator'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Spacer } from '@zeal/uikit/Spacer'
import { TabHeader } from '@zeal/uikit/TabHeader'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { Avatar as CurrencyAvatar } from '@zeal/domains/Currency/components/Avatar'
import {
    KycStatus,
    OffRampAccount,
    OnRampTransaction,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import {
    ON_RAMP_SERVICE_TIME_MS,
    PRE_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY,
} from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { getCryptoAmountInDefaultCurrency } from '@zeal/domains/Currency/domains/BankTransfer/helpers/getCryptoAmountInDefaultCurrency'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Money } from '@zeal/domains/Money'
import { FormattedFeeInDefaultCurrencyWhichCanBeZero } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrencyWhichCanBeZero'
import { FormattedFiatCurrency } from '@zeal/domains/Money/components/FormattedFiatCurrency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import {
    FormattedTokenBalances,
    useFormatTokenBalance,
} from '@zeal/domains/Money/components/FormattedTokenBalances'
import { sub } from '@zeal/domains/Money/helpers/sub'
import { Network } from '@zeal/domains/Network'
import { FancyButton as NetworkFancyButton } from '@zeal/domains/Network/components/FancyButton'
import { Portfolio } from '@zeal/domains/Portfolio'

import {
    BannerError,
    DepositPollable,
    FormErrors,
    validateBeforeSubmit,
    validateOnSubmit,
} from './validation'

type Props = {
    pollable: DepositPollable
    currencies: BankTransferCurrencies
    unblockUser: UnblockUser
    portfolio: Portfolio
    keyStoreMap: KeyStoreMap
    account: Account
    offRampAccounts: OffRampAccount[]
    onRampTransactions: OnRampTransaction[]
    network: Network
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_amount_change'; amount: string | null }
    | { type: 'on_withdraw_tab_click' }
    | { type: 'on_currency_selector_click' }
    | { type: 'on_fee_info_click' }
    | { type: 'on_time_info_click' }
    | { type: 'on_submit_form_click'; form: OnRampFeeParams }
    | { type: 'on_kyc_banner_click' }

const getDefaultCryptoCurrencyBalance = (
    portfolio: Portfolio,
    defaultCryptoCurrency: CryptoCurrency
): Money => {
    const token = portfolio.tokens.find(
        (t) => t.balance.currencyId === defaultCryptoCurrency.id
    )

    return (
        token?.balance || {
            currencyId: defaultCryptoCurrency.id,
            amount: BigInt(0),
        }
    )
}

const getCryptoAmount = (
    pollable: DepositPollable,
    knownCurrencies: KnownCurrencies
): { grossAmount: Money | null; netAmount: Money | null } => {
    switch (pollable.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            const grossAmount = applyRate(
                {
                    amount: amountToBigint(
                        pollable.params.form.amount,
                        pollable.params.form.inputCurrency.fraction
                    ),
                    currencyId: pollable.params.form.inputCurrency.id,
                },
                pollable.data.rate,
                knownCurrencies
            )

            const feeAmount = applyRate(
                pollable.data.fee.amount,
                {
                    rate: amountToBigint(
                        '1',
                        knownCurrencies[grossAmount.currencyId].rateFraction
                    ),
                    base: pollable.data.fee.amount.currencyId,
                    quote: grossAmount.currencyId,
                },
                knownCurrencies
            )

            const netAmount = sub(grossAmount, feeAmount)

            return { grossAmount, netAmount }

        case 'loading':
        case 'error':
            return { grossAmount: null, netAmount: null }
        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

export const Layout = ({
    currencies,
    pollable,
    network,
    account,
    keyStoreMap,
    unblockUser,
    onRampTransactions,
    onMsg,
    portfolio,
}: Props) => {
    const [submitAttempted, setSubmitAttempted] = useState<boolean>(false)
    const { formatMessage } = useIntl()
    const formatHumanReadableDuration = useReadableDuration()
    const formatTokenBalance = useFormatTokenBalance()

    const { amount, inputCurrency, outputCurrency } = pollable.params.form
    const { defaultCryptoCurrency, knownCurrencies } = currencies

    const result = submitAttempted
        ? validateOnSubmit(
              pollable,
              unblockUser,
              onRampTransactions,
              knownCurrencies
          )
        : validateBeforeSubmit(
              pollable,
              unblockUser,
              onRampTransactions,
              knownCurrencies
          )

    const errors = result.getFailureReason() || {}

    // TODO: fee has been deducted. With the rounding in the UI, the numbers are a bit off
    const { grossAmount, netAmount } = getCryptoAmount(
        pollable,
        knownCurrencies
    )

    const formattedCrypto = netAmount
        ? formatTokenBalance({
              money: netAmount,
              knownCurrencies,
          })
        : null

    const cryptoBalance = getDefaultCryptoCurrencyBalance(
        portfolio,
        defaultCryptoCurrency
    )

    const onSubmit = () => {
        setSubmitAttempted(true)
        const result = validateOnSubmit(
            pollable,
            unblockUser,
            onRampTransactions,
            knownCurrencies
        )

        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'on_submit_form_click',
                    form: result.data,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    }

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
            <Column spacing={16}>
                <Row spacing={12}>
                    <TabHeader selected>
                        <FormattedMessage
                            id="bank_transfers.deposit.deposit-header"
                            defaultMessage="Deposit"
                        />
                    </TabHeader>
                    <TabHeader
                        selected={false}
                        onClick={() => onMsg({ type: 'on_withdraw_tab_click' })}
                    >
                        <FormattedMessage
                            id="bank_transfers.deposit.withdraw-header"
                            defaultMessage="Withdraw"
                        />
                    </TabHeader>
                </Row>

                <Column spacing={12}>
                    <Column spacing={4}>
                        <AmountInput
                            state={errors.input ? 'error' : 'normal'}
                            content={{
                                topLeft: (
                                    <IconButton
                                        variant="on_light"
                                        onClick={() => {
                                            onMsg({
                                                type: 'on_currency_selector_click',
                                            })
                                        }}
                                    >
                                        {() => (
                                            <Row spacing={4}>
                                                <CurrencyAvatar
                                                    key={inputCurrency.id}
                                                    currency={inputCurrency}
                                                    size={24}
                                                    rightBadge={() => null}
                                                />
                                                <Text
                                                    variant="title3"
                                                    color="textPrimary"
                                                    weight="medium"
                                                >
                                                    {inputCurrency.code}
                                                </Text>
                                                <LightArrowDown2
                                                    size={18}
                                                    color="iconDefault"
                                                />
                                            </Row>
                                        )}
                                    </IconButton>
                                ),
                                topRight: ({ onBlur, onFocus }) => (
                                    <AmountInput.Input
                                        onBlur={onBlur}
                                        onFocus={onFocus}
                                        label={formatMessage({
                                            id: 'bank_transfers.deposit.amount-input',
                                            defaultMessage: 'Amount to deposit',
                                        })}
                                        amount={amount}
                                        fraction={inputCurrency.fraction}
                                        onChange={(value) =>
                                            onMsg({
                                                type: 'on_amount_change',
                                                amount: value,
                                            })
                                        }
                                        autoFocus
                                        prefix={inputCurrency.symbol}
                                        onSubmitEditing={onSubmit}
                                    />
                                ),
                                bottomRight: (() => {
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
                                            return grossAmount ? (
                                                <Text
                                                    variant="footnote"
                                                    color="textSecondary"
                                                    weight="regular"
                                                >
                                                    <FormattedTokenBalanceInDefaultCurrency
                                                        knownCurrencies={
                                                            knownCurrencies
                                                        }
                                                        money={getCryptoAmountInDefaultCurrency(
                                                            grossAmount,
                                                            knownCurrencies
                                                        )}
                                                    />
                                                </Text>
                                            ) : null
                                        case 'error':
                                            return null
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(pollable)
                                    }
                                })(),
                            }}
                        />

                        <NextStepSeparator />

                        <AmountInput
                            state={(() => {
                                switch (pollable.type) {
                                    case 'error':
                                        return 'error'
                                    case 'loaded':
                                    case 'reloading':
                                    case 'subsequent_failed':
                                    case 'loading':
                                        return 'normal'
                                    default:
                                        return notReachable(pollable)
                                }
                            })()}
                            top={
                                <NetworkFancyButton
                                    fill
                                    rounded={false}
                                    network={network}
                                    onClick={null}
                                />
                            }
                            content={{
                                topLeft: (
                                    <Row spacing={4}>
                                        <CurrencyAvatar
                                            key={outputCurrency.id}
                                            currency={outputCurrency}
                                            size={24}
                                            rightBadge={() => null}
                                        />
                                        <Text
                                            variant="title3"
                                            color="textPrimary"
                                            weight="medium"
                                        >
                                            {outputCurrency.code}
                                        </Text>
                                    </Row>
                                ),
                                topRight: ({ onBlur, onFocus }) =>
                                    (() => {
                                        switch (pollable.type) {
                                            case 'loading':
                                            case 'reloading':
                                                return (
                                                    <AmountInput.InputSkeleton />
                                                )
                                            case 'loaded':
                                            case 'subsequent_failed':
                                                return (
                                                    <AmountInput.Input
                                                        onBlur={onBlur}
                                                        onFocus={onFocus}
                                                        label={formatMessage({
                                                            id: 'bank_transfers.deposit.amount-output',
                                                            defaultMessage:
                                                                'Destination amount',
                                                        })}
                                                        amount={formattedCrypto}
                                                        fraction={
                                                            outputCurrency.fraction ??
                                                            0
                                                        }
                                                        onChange={noop}
                                                        prefix=""
                                                        readOnly
                                                        onSubmitEditing={
                                                            onSubmit
                                                        }
                                                    />
                                                )
                                            case 'error':
                                                return (
                                                    <Column
                                                        spacing={0}
                                                        alignX="end"
                                                    >
                                                        <Text
                                                            variant="title3"
                                                            color="textDisabled"
                                                            weight="regular"
                                                        >
                                                            <FormattedMessage
                                                                id="bank_transfers.deposit.amount-output.error"
                                                                defaultMessage="error"
                                                            />
                                                        </Text>
                                                    </Column>
                                                )
                                            /* istanbul ignore next */
                                            default:
                                                return notReachable(pollable)
                                        }
                                    })(),
                                bottomRight: (() => {
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
                                            return netAmount ? (
                                                <Text
                                                    variant="footnote"
                                                    color="textSecondary"
                                                    weight="regular"
                                                >
                                                    <FormattedTokenBalanceInDefaultCurrency
                                                        knownCurrencies={
                                                            knownCurrencies
                                                        }
                                                        money={getCryptoAmountInDefaultCurrency(
                                                            netAmount,
                                                            knownCurrencies
                                                        )}
                                                    />
                                                </Text>
                                            ) : null
                                        case 'error':
                                            return null
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(pollable)
                                    }
                                })(),
                                bottomLeft: (
                                    <Text
                                        color="textSecondary"
                                        variant="paragraph"
                                    >
                                        <FormattedMessage
                                            id="bank_transfers.deposit.default-token.balance"
                                            defaultMessage="Balance {amount}"
                                            values={{
                                                amount: (
                                                    <FormattedTokenBalances
                                                        money={cryptoBalance}
                                                        knownCurrencies={
                                                            knownCurrencies
                                                        }
                                                    />
                                                ),
                                            }}
                                        />
                                    </Text>
                                ),
                            }}
                        />
                    </Column>
                </Column>
            </Column>

            <Spacer />

            <Column spacing={12}>
                <Group variant="default">
                    <Column spacing={6}>
                        <Row spacing={3}>
                            <Text variant="paragraph" color="textPrimary">
                                <FormattedMessage
                                    id="bank_transfers.deposit.fees"
                                    defaultMessage="Fees"
                                />
                            </Text>
                            <IconButton
                                variant="on_light"
                                onClick={() =>
                                    onMsg({ type: 'on_fee_info_click' })
                                }
                            >
                                {({ color }) => (
                                    <InfoCircle size={14} color={color} />
                                )}
                            </IconButton>

                            <Spacer />

                            <Fees
                                pollable={pollable}
                                knownCurrencies={knownCurrencies}
                            />
                        </Row>
                        <Row spacing={3}>
                            <Text variant="paragraph" color="textPrimary">
                                <FormattedMessage
                                    id="bank_transfers.deposit.time"
                                    defaultMessage="Time"
                                />
                            </Text>
                            <IconButton
                                variant="on_light"
                                onClick={() =>
                                    onMsg({
                                        type: 'on_time_info_click',
                                    })
                                }
                            >
                                {({ color }) => (
                                    <InfoCircle size={14} color={color} />
                                )}
                            </IconButton>

                            <Spacer />

                            <Text
                                variant="paragraph"
                                color="textPrimary"
                                weight="regular"
                            >
                                {formatHumanReadableDuration(
                                    ON_RAMP_SERVICE_TIME_MS
                                )}
                            </Text>
                        </Row>
                    </Column>
                </Group>
                {errors.banner ? (
                    <ErrorBanner
                        error={errors.banner}
                        kycStatus={unblockUser.kycStatus}
                        knownCurrencies={knownCurrencies}
                        onClick={() => onMsg({ type: 'on_kyc_banner_click' })}
                    />
                ) : (
                    <KycVerificationBanner
                        kycStatus={unblockUser.kycStatus}
                        knownCurrencies={knownCurrencies}
                        onClick={() => onMsg({ type: 'on_kyc_banner_click' })}
                    />
                )}
                <Actions>
                    <Button
                        size="regular"
                        variant="primary"
                        disabled={!!errors.submit}
                        onClick={onSubmit}
                    >
                        {errors.submit ? (
                            <SubmitButtonErrorText
                                error={errors.submit}
                                knownCurrencies={knownCurrencies}
                            />
                        ) : (
                            <FormattedMessage
                                id="bank_transfers.deposit.continue"
                                defaultMessage="Continue"
                            />
                        )}
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}

const SubmitButtonErrorText = ({
    error,
    knownCurrencies,
}: {
    error: NonNullable<FormErrors['submit']>
    knownCurrencies: KnownCurrencies
}) => {
    switch (error.type) {
        case 'pre_kyc_limit_reached':
        case 'post_kyc_limit_reached':
        case 'pollable_loading':
        case 'trial_limit_reached':
        case 'kyc_in_progress':
        case 'kyc_paused':
        case 'kyc_failed':
        case 'amount_is_zero':
            return (
                <FormattedMessage
                    id="bank_transfers.deposit.continue"
                    defaultMessage="Continue"
                />
            )
        case 'minimum_amount':
            return (
                <FormattedMessage
                    id="bank_transfers.deposit.increase-amount"
                    defaultMessage="Minimum transfer is {limit}"
                    values={{
                        limit: (
                            <FormattedFiatCurrency
                                knownCurrencies={knownCurrencies}
                                money={error.limit}
                                minimumFractionDigits={0}
                            />
                        ),
                    }}
                />
            )
        case 'currency_is_currently_not_supported':
            return (
                <FormattedMessage
                    id="bank_transfers.currency_is_currently_not_supported"
                    defaultMessage="{code} is currently not supported"
                    values={{ code: error.currency.code }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

const ErrorBanner = ({
    error,
    kycStatus,
    knownCurrencies,
    onClick,
}: {
    error: BannerError
    kycStatus: KycStatus
    knownCurrencies: KnownCurrencies
    onClick: () => void
}) => {
    switch (error.type) {
        case 'kyc_in_progress':
            return (
                <BannerLimit
                    variant="neutral"
                    onClick={onClick}
                    icon={({ size }) => <BoldId size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.verifying-identity"
                            defaultMessage="Verifying identity"
                        />
                    }
                />
            )
        case 'kyc_paused':
            return (
                <BannerLimit
                    variant="warning"
                    onClick={onClick}
                    icon={({ size }) => <BoldId size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.verification-paused"
                            defaultMessage="Verification paused"
                        />
                    }
                />
            )
        case 'kyc_failed':
            return (
                <BannerLimit
                    variant="critical"
                    onClick={onClick}
                    icon={({ size }) => <BoldId size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.verification-failed"
                            defaultMessage="Verification failed"
                        />
                    }
                />
            )
        case 'pre_kyc_limit_reached':
            return (
                <BannerLimit
                    variant="warning"
                    onClick={onClick}
                    icon={({ size }) => <BoldLock size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.trial-max-limit"
                            defaultMessage="You can do 1 deposit up to {limit}"
                            values={{
                                limit: (
                                    <FormattedTokenBalanceInDefaultCurrency
                                        knownCurrencies={knownCurrencies}
                                        money={
                                            PRE_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY
                                        }
                                    />
                                ),
                            }}
                        />
                    }
                />
            )
        case 'post_kyc_limit_reached':
            return (
                <BannerLimit
                    variant="warning"
                    onClick={null}
                    icon={({ size }) => <BoldDangerTriangle size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.max-limit-reached"
                            defaultMessage="Amount exceeds max transfer limit"
                        />
                    }
                />
            )
        case 'trial_limit_reached':
            return (
                <BannerLimit
                    variant="warning"
                    onClick={onClick}
                    icon={({ size }) => <BoldLock size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.trial-limit-reached"
                            defaultMessage="Trial limit reached. Verify your ID"
                        />
                    }
                />
            )
        case 'pollable_loading': {
            return (
                <KycVerificationBanner
                    kycStatus={kycStatus}
                    onClick={onClick}
                    knownCurrencies={knownCurrencies}
                />
            )
        }
        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

const KycVerificationBanner = ({
    onClick,
    knownCurrencies,
    kycStatus,
}: {
    onClick: () => void
    knownCurrencies: KnownCurrencies
    kycStatus: KycStatus
}) => {
    switch (kycStatus.type) {
        case 'approved':
            return null
        case 'paused':
            return (
                <BannerLimit
                    variant="warning"
                    onClick={onClick}
                    icon={({ size }) => <BoldId size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.verification-paused"
                            defaultMessage="Verification paused"
                        />
                    }
                />
            )
        case 'failed':
            return (
                <BannerLimit
                    variant="critical"
                    onClick={onClick}
                    icon={({ size }) => <BoldId size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.verification-failed"
                            defaultMessage="Verification failed"
                        />
                    }
                />
            )
        case 'in_progress':
            return (
                <BannerLimit
                    variant="neutral"
                    onClick={onClick}
                    icon={({ size }) => <BoldId size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.verifying-identity"
                            defaultMessage="Verifying identity"
                        />
                    }
                />
            )
        case 'not_started':
            return (
                <BannerLimit
                    variant="default"
                    onClick={onClick}
                    icon={({ size }) => <BoldLock size={size} />}
                    title={
                        <FormattedMessage
                            id="bank_transfers.deposit.limit-info"
                            defaultMessage="You can do 1 deposit up to {limit}"
                            values={{
                                limit: (
                                    <FormattedTokenBalanceInDefaultCurrency
                                        knownCurrencies={knownCurrencies}
                                        money={
                                            PRE_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY
                                        }
                                    />
                                ),
                            }}
                        />
                    }
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(kycStatus)
    }
}

const Fees = ({
    pollable,
    knownCurrencies,
}: {
    pollable: DepositPollable
    knownCurrencies: KnownCurrencies
}) => {
    const { formatNumber } = useIntl()

    switch (pollable.type) {
        case 'loading':
        case 'reloading':
            return <Skeleton variant="default" width={40} height={16} />
        case 'loaded':
        case 'subsequent_failed': {
            const percentage = formatNumber(pollable.data.fee.percentageFee, {
                style: 'percent',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            })

            return (
                <Row spacing={4}>
                    <Text variant="paragraph" color="textSecondary">
                        {percentage}
                    </Text>
                    <Text variant="paragraph" color="textPrimary">
                        <FormattedFeeInDefaultCurrencyWhichCanBeZero
                            knownCurrencies={knownCurrencies}
                            money={pollable.data.fee.amount}
                        />
                    </Text>
                </Row>
            )
        }
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
}
