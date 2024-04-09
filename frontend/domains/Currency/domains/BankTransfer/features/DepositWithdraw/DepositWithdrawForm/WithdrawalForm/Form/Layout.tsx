import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import Big from 'big.js'

import { Actions } from '@zeal/uikit/Actions'
import { BannerLimit } from '@zeal/uikit/BannerLimit'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { BoldGeneralBank } from '@zeal/uikit/Icon/BoldGeneralBank'
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
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import {
    CryptoCurrency,
    Currency,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { Avatar as CurrencyAvatar } from '@zeal/domains/Currency/components/Avatar'
import {
    BankAccountDetails,
    KycStatus,
    OffRampAccount,
    OffRampTransaction,
    UnblockUser,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import {
    OFF_RAMP_SERVICE_TIME_MS,
    PRE_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY,
    USD,
} from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { formatIBAN } from '@zeal/domains/Currency/domains/BankTransfer/helpers/formatIBAN'
import { getCryptoAmountInDefaultCurrency } from '@zeal/domains/Currency/domains/BankTransfer/helpers/getCryptoAmountInDefaultCurrency'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { ImperativeError } from '@zeal/domains/Error'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Money } from '@zeal/domains/Money'
import { FormattedFeeInDefaultCurrencyWhichCanBeZero } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrencyWhichCanBeZero'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { FormattedTokenBalanceWithSymbol } from '@zeal/domains/Money/components/FormattedTokenBalanceWithSymbol'
import { sub } from '@zeal/domains/Money/helpers/sub'
import { Network } from '@zeal/domains/Network'
import { FancyButton as NetworkFancyButton } from '@zeal/domains/Network/components/FancyButton'
import { Portfolio } from '@zeal/domains/Portfolio'

import {
    BannerError,
    FormErrors,
    validateAsUserTypes,
    validateOnSubmit,
    WithdrawPollable,
} from './validation'

type Props = {
    currencies: BankTransferCurrencies
    pollable: WithdrawPollable
    network: Network
    keyStoreMap: KeyStoreMap
    portfolio: Portfolio
    account: Account
    offRampAccounts: OffRampAccount[]
    offRampTransactions: OffRampTransaction[]
    unblockUser: UnblockUser
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_amount_change'; amount: string | null }
    | { type: 'on_deposit_tab_click' }
    | { type: 'on_currency_selector_click' }
    | { type: 'on_fee_info_click' }
    | { type: 'on_time_info_click' }
    | { type: 'on_submit_form_click'; form: WithdrawalRequest }
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

const getToAmounts = (
    pollable: WithdrawPollable,
    knownCurrencies: KnownCurrencies
): { inSelectedCurrency: Money | null; inDefaultCurrency: Money | null } => {
    switch (pollable.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed': {
            const fromAmount = {
                amount: amountToBigint(
                    pollable.params.form.amount,
                    pollable.params.form.inputCurrency.fraction
                ),
                currencyId: pollable.params.form.inputCurrency.id,
            }

            const feeAmount = applyRate(
                pollable.data.fee.amount,
                {
                    rate: amountToBigint(
                        '1',
                        knownCurrencies[fromAmount.currencyId].rateFraction
                    ),
                    base: pollable.data.fee.amount.currencyId,
                    quote: fromAmount.currencyId,
                },
                knownCurrencies
            )

            const netAmount = sub(fromAmount, feeAmount)

            return {
                inSelectedCurrency: applyRate(
                    netAmount,
                    pollable.data.rate,
                    knownCurrencies
                ),
                inDefaultCurrency: getCryptoAmountInDefaultCurrency(
                    netAmount,
                    knownCurrencies
                ),
            }
        }
        case 'loading':
        case 'error':
            return {
                inSelectedCurrency: null,
                inDefaultCurrency: null,
            }

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

export const Layout = ({
    pollable,
    currencies,
    portfolio,
    account,
    network,
    keyStoreMap,
    offRampTransactions,
    offRampAccounts,
    unblockUser,
    onMsg,
}: Props) => {
    const [submitAttempted, setSubmitAttempted] = useState<boolean>(false)
    const { formatMessage } = useIntl()
    const formatHumanReadableDuration = useReadableDuration()

    const { amount, inputCurrency, outputCurrency } = pollable.params.form
    const { defaultCryptoCurrency, knownCurrencies } = currencies

    const cryptoBalance = getDefaultCryptoCurrencyBalance(
        portfolio,
        defaultCryptoCurrency
    )

    const result = submitAttempted
        ? validateOnSubmit(
              pollable,
              unblockUser,
              offRampTransactions,
              cryptoBalance,
              knownCurrencies
          )
        : validateAsUserTypes(
              pollable,
              unblockUser,
              offRampTransactions,
              knownCurrencies
          )

    const errors = result.getFailureReason() || {}

    // TODO: fee has been deducted. With the rounding in the UI, the numbers are a bit off
    const {
        inSelectedCurrency: toAmountInSelectedCurrency,
        inDefaultCurrency: toAmountInDefaultCurrency,
    } = getToAmounts(pollable, knownCurrencies)

    const onSubmit = () => {
        setSubmitAttempted(true)
        const result = validateOnSubmit(
            pollable,
            unblockUser,
            offRampTransactions,
            cryptoBalance,
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
                    <TabHeader
                        selected={false}
                        onClick={() => onMsg({ type: 'on_deposit_tab_click' })}
                    >
                        <FormattedMessage
                            id="bank_transfers.deposit-header"
                            defaultMessage="Deposit"
                        />
                    </TabHeader>
                    <TabHeader selected>
                        <FormattedMessage
                            id="bank_transfers.withdraw-header"
                            defaultMessage="Withdraw"
                        />
                    </TabHeader>
                </Row>
                <Column spacing={12}>
                    <Column spacing={4}>
                        <AmountInput
                            state={errors.input ? 'error' : 'normal'}
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
                                    </Row>
                                ),
                                topRight: ({ onBlur, onFocus }) => (
                                    <AmountInput.Input
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                        label={formatMessage({
                                            id: 'bank_transfers.withdraw.amount-input',
                                            defaultMessage:
                                                'Amount to withdraw',
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
                                        prefix=""
                                        onSubmitEditing={onSubmit}
                                    />
                                ),
                                bottomRight: (
                                    <Text
                                        variant="footnote"
                                        color="textSecondary"
                                        weight="regular"
                                    >
                                        <FormattedTokenBalanceInDefaultCurrency
                                            knownCurrencies={knownCurrencies}
                                            money={{
                                                amount: amountToBigint(
                                                    pollable.params.form.amount,
                                                    USD.fraction
                                                ),
                                                currencyId: USD.id,
                                            }}
                                        />
                                    </Text>
                                ),
                                bottomLeft: (
                                    <Tertiary
                                        color={(() => {
                                            if (!errors.balance) {
                                                return 'on_light'
                                            }

                                            switch (errors.balance.type) {
                                                case 'insufficient_balance':
                                                    return 'critical'

                                                default:
                                                    return notReachable(
                                                        errors.balance.type
                                                    )
                                            }
                                        })()}
                                        size="regular"
                                        onClick={() => {
                                            onMsg({
                                                type: 'on_amount_change',
                                                amount: Big(
                                                    cryptoBalance.amount.toString(
                                                        10
                                                    )
                                                )
                                                    .div(
                                                        Big(10).pow(
                                                            knownCurrencies[
                                                                cryptoBalance
                                                                    .currencyId
                                                            ].fraction
                                                        )
                                                    )
                                                    .toFixed(
                                                        knownCurrencies[
                                                            cryptoBalance
                                                                .currencyId
                                                        ].fraction
                                                    ),
                                            })
                                        }}
                                    >
                                        {({
                                            color,
                                            textVariant,
                                            textWeight,
                                        }) => (
                                            <Text
                                                color={color}
                                                variant={textVariant}
                                                weight={textWeight}
                                            >
                                                <FormattedMessage
                                                    id="bank_transfers.withdraw.default-token.balance"
                                                    defaultMessage="Balance {amount}"
                                                    values={{
                                                        amount: (
                                                            <FormattedTokenBalances
                                                                money={
                                                                    cryptoBalance
                                                                }
                                                                knownCurrencies={
                                                                    knownCurrencies
                                                                }
                                                            />
                                                        ),
                                                    }}
                                                />
                                            </Text>
                                        )}
                                    </Tertiary>
                                ),
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
                                        {({ color }) => (
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

                                                <LightArrowDown2
                                                    size={18}
                                                    color="iconDefault"
                                                />
                                            </Row>
                                        )}
                                    </IconButton>
                                ),
                                topRight: () =>
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
                                                    <Text
                                                        variant="title3"
                                                        color="textPrimary"
                                                        weight="medium"
                                                    >
                                                        {toAmountInSelectedCurrency ? (
                                                            <FormattedTokenBalanceInDefaultCurrency
                                                                knownCurrencies={
                                                                    knownCurrencies
                                                                }
                                                                money={
                                                                    toAmountInSelectedCurrency
                                                                }
                                                            />
                                                        ) : (
                                                            '0'
                                                        )}
                                                    </Text>
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
                                            return (
                                                <Text
                                                    variant="footnote"
                                                    color="textSecondary"
                                                    weight="regular"
                                                >
                                                    {toAmountInDefaultCurrency ? (
                                                        <FormattedTokenBalanceInDefaultCurrency
                                                            knownCurrencies={
                                                                knownCurrencies
                                                            }
                                                            money={
                                                                toAmountInDefaultCurrency
                                                            }
                                                        />
                                                    ) : (
                                                        '$0'
                                                    )}
                                                </Text>
                                            )

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

                        <Group variant="default">
                            <Row spacing={12}>
                                <BoldGeneralBank
                                    size={28}
                                    color="textPrimary"
                                />

                                <BankAccountInformation
                                    unblockUser={unblockUser}
                                    offRampAccounts={offRampAccounts}
                                    currency={outputCurrency}
                                />
                            </Row>
                        </Group>
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
                                    id="bank_transfers.fees"
                                    defaultMessage="Fees"
                                />
                            </Text>
                            <IconButton
                                variant="on_light"
                                onClick={() => {
                                    onMsg({
                                        type: 'on_fee_info_click',
                                    })
                                }}
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
                                    id="bank_transfers.time"
                                    defaultMessage="Time"
                                />
                            </Text>
                            <IconButton
                                variant="on_light"
                                onClick={() => {
                                    onMsg({
                                        type: 'on_time_info_click',
                                    })
                                }}
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
                                    OFF_RAMP_SERVICE_TIME_MS
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
                        knownCurrencies={knownCurrencies}
                        kycStatus={unblockUser.kycStatus}
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
                                id="bank_transfers.continue"
                                defaultMessage="Continue"
                            />
                        )}
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}

const BankAccountInformation = ({
    offRampAccounts,
    currency,
    unblockUser,
}: {
    offRampAccounts: OffRampAccount[]
    currency: Currency
    unblockUser: UnblockUser
}) => {
    const bankAccount = offRampAccounts.find(
        (account) => account.currency.id === currency.id
    )

    if (!bankAccount) {
        throw new ImperativeError(
            'Bank account information not available in list of off-ramp accounts'
        )
    }

    return (
        <Column spacing={4} shrink>
            <Text variant="paragraph" color="textPrimary" weight="regular">
                {unblockUser.firstName} {unblockUser.lastName}
            </Text>

            <BankAccountDetailsInfo bankDetails={bankAccount.bankDetails} />
        </Column>
    )
}

const BankAccountDetailsInfo = ({
    bankDetails: bankAccount,
}: {
    bankDetails: BankAccountDetails
}) => {
    switch (bankAccount.type) {
        case 'uk':
            return (
                <Row spacing={8}>
                    <Text
                        variant="paragraph"
                        color="textSecondary"
                        weight="regular"
                    >
                        {bankAccount.accountNumber}
                    </Text>
                    <Text
                        variant="paragraph"
                        color="textSecondary"
                        weight="regular"
                    >
                        {formattedSortCode(bankAccount.sortCode)}
                    </Text>
                </Row>
            )

        case 'iban':
            return (
                <Text
                    variant="paragraph"
                    color="textSecondary"
                    weight="regular"
                >
                    {formatIBAN(bankAccount.iban)}
                </Text>
            )
        case 'ngn':
            return (
                <Row spacing={8}>
                    <Text
                        variant="paragraph"
                        color="textSecondary"
                        weight="regular"
                    >
                        {bankAccount.accountNumber}
                    </Text>
                    <Text
                        variant="paragraph"
                        color="textSecondary"
                        weight="regular"
                    >
                        {bankAccount.bankCode}
                    </Text>
                </Row>
            )

        default:
            return notReachable(bankAccount)
    }
}

const formattedSortCode = (sortCode: string) => {
    const parts = sortCode.match(/.{1,2}/g) || []
    return parts.join('-')
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
                    id="bank_transfers.continue"
                    defaultMessage="Continue"
                />
            )
        case 'minimum_amount':
            return (
                <FormattedMessage
                    id="bank_transfers.increase-amount"
                    defaultMessage="Minimum transfer is {limit}"
                    values={{
                        limit: (
                            <FormattedTokenBalanceWithSymbol
                                knownCurrencies={knownCurrencies}
                                money={error.limit}
                            />
                        ),
                    }}
                />
            )

        case 'insufficient_balance':
            return (
                <FormattedMessage
                    id="bank_transfers.insufficient-funds"
                    defaultMessage="Insufficient funds"
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
                            id="bank_transfers.withdraw.trial-max-limit"
                            defaultMessage="You can do 1 withdrawal up to {limit}"
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
                            id="bank_transfers.withdraw.max-limit-reached"
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
                            id="bank_transfers.withdraw.trial-limit-reached"
                            defaultMessage="Trial limit reached. Verify your ID"
                        />
                    }
                />
            )
        case 'pollable_loading':
            return (
                <KycVerificationBanner
                    kycStatus={kycStatus}
                    onClick={onClick}
                    knownCurrencies={knownCurrencies}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

const KycVerificationBanner = ({
    kycStatus,
    onClick,
    knownCurrencies,
}: {
    kycStatus: KycStatus
    onClick: () => void
    knownCurrencies: KnownCurrencies
}) => {
    switch (kycStatus.type) {
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
                <KycNotVerifiedBanner
                    onClick={onClick}
                    knownCurrencies={knownCurrencies}
                />
            )
        case 'approved':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(kycStatus)
    }
}

const KycNotVerifiedBanner = ({
    onClick,
    knownCurrencies,
}: {
    onClick: () => void
    knownCurrencies: KnownCurrencies
}) => (
    <BannerLimit
        variant="default"
        onClick={onClick}
        icon={({ size }) => <BoldLock size={size} />}
        title={
            <Text variant="paragraph" color="textPrimary">
                <FormattedMessage
                    id="bank_transfers.deposit.limit-info"
                    defaultMessage="You can do 1 withdrawal up to {limit}"
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
            </Text>
        }
    />
)

const Fees = ({
    pollable,
    knownCurrencies,
}: {
    pollable: WithdrawPollable
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
                    {/* TODO: check with design */}
                    <FormattedMessage
                        id="bank_transfers.withdraw.failed_to_load_fee"
                        defaultMessage="Unknown"
                    />
                </Text>
            )

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
