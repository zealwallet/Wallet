import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { failure, Result, shape, success } from '@zeal/toolkit/Result'

import { Currency, KnownCurrencies } from '@zeal/domains/Currency'
import {
    OffRampTransaction,
    UnblockUser,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { UNBLOCK_SUSPENDED_FIAT_CURRENCY_CODES } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OffRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import {
    MINIMUM_TRANSFER_AMOUNT_IN_DEFAULT_CURRENCY,
    POST_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY,
    PRE_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY,
} from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { getCryptoAmountInDefaultCurrency } from '@zeal/domains/Currency/domains/BankTransfer/helpers/getCryptoAmountInDefaultCurrency'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { Money } from '@zeal/domains/Money'
import { isGreaterThan } from '@zeal/domains/Money/helpers/compare'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { OffRampFeeResponse } from '.'

export type WithdrawPollable = PollableData<
    OffRampFeeResponse,
    {
        form: OffRampFeeParams
        unblockLoginInfo: UnblockLoginInfo
        bankTransferInfo: BankTransferUnblockUserCreated
    }
>

export type FormErrors = {
    input?: InsufficientBalanceError | MinimumAmountError
    balance?: InsufficientBalanceError
    banner?: BannerError
    submit?:
        | InsufficientBalanceError
        | BannerError
        | MinimumAmountError
        | CurrencyIsCurrentlyNotSupported
        | { type: 'amount_is_zero' }
}
type CurrencyIsCurrentlyNotSupported = {
    type: 'currency_is_currently_not_supported'
    currency: Currency
}

const validateCurrency = (
    pollable: WithdrawPollable
): Result<CurrencyIsCurrentlyNotSupported, unknown> => {
    const currency = pollable.params.form.outputCurrency
    return UNBLOCK_SUSPENDED_FIAT_CURRENCY_CODES.includes(currency.code)
        ? failure({
              type: 'currency_is_currently_not_supported',
              currency,
          })
        : success(undefined)
}

export type InsufficientBalanceError = { type: 'insufficient_balance' }

export type MinimumAmountError = {
    type: 'minimum_amount'
    limit: Money
}

export type BannerError = MaxWithdrawError | KycStatusError

export type MaxWithdrawError =
    | { type: 'pre_kyc_limit_reached' }
    | { type: 'post_kyc_limit_reached' }
    | { type: 'pollable_loading' }

type KycStatusError =
    | { type: 'trial_limit_reached' }
    | { type: 'kyc_in_progress' }
    | { type: 'kyc_paused' }
    | { type: 'kyc_failed' }

export const validateAsUserTypes = (
    pollable: WithdrawPollable,
    unblockUser: UnblockUser,
    offRampTransactions: OffRampTransaction[],
    knownCurrencies: KnownCurrencies
): Result<FormErrors, unknown> => {
    return shape({
        banner: validateKycStatus(unblockUser, offRampTransactions).andThen(
            () =>
                validateKYCWithdrawalLimit(
                    pollable,
                    unblockUser,
                    knownCurrencies
                )
        ),

        submit: validateKycStatus(unblockUser, offRampTransactions)
            .andThen(() => validateCurrency(pollable))
            .andThen(() =>
                validateKYCWithdrawalLimit(
                    pollable,
                    unblockUser,
                    knownCurrencies
                )
            )
            .andThen(() => validateAmountNotZero(pollable)),
    })
}

export const validateOnSubmit = (
    pollable: WithdrawPollable,
    unblockUser: UnblockUser,
    offRampTransactions: OffRampTransaction[],
    balance: Money,
    knownCurrencies: KnownCurrencies
): Result<FormErrors, WithdrawalRequest> => {
    return shape({
        input: validateBalanceAmount(
            pollable,
            balance,
            knownCurrencies
        ).andThen(() => validateMinimumAmount(pollable, knownCurrencies)),

        balance: validateBalanceAmount(pollable, balance, knownCurrencies),

        banner: validateKycStatus(unblockUser, offRampTransactions).andThen(
            () =>
                validateKYCWithdrawalLimit(
                    pollable,
                    unblockUser,
                    knownCurrencies
                )
        ),

        submitText: validateBalanceAmount(
            pollable,
            balance,
            knownCurrencies
        ).andThen(() => validateMinimumAmount(pollable, knownCurrencies)),

        submit: validateKycStatus(unblockUser, offRampTransactions)
            .andThen(() =>
                validateBalanceAmount(pollable, balance, knownCurrencies)
            )
            .andThen(() => validateMinimumAmount(pollable, knownCurrencies))
            .andThen(() =>
                validateKYCWithdrawalLimit(
                    pollable,
                    unblockUser,
                    knownCurrencies
                )
            )
            .andThen(() => validateAmountNotZero(pollable)),
    }).map(() => {
        const fromAmount = {
            amount: amountToBigint(
                pollable.params.form.amount,
                pollable.params.form.inputCurrency.fraction
            ),
            currencyId: pollable.params.form.inputCurrency.id,
        }

        switch (pollable.type) {
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed':
                return {
                    type: 'full_withdrawal_request',
                    knownCurrencies,
                    fromAmount,
                    toAmount: applyRate(
                        {
                            amount: amountToBigint(
                                pollable.params.form.amount,
                                pollable.params.form.inputCurrency.fraction
                            ),
                            currencyId: pollable.params.form.inputCurrency.id,
                        },
                        pollable.data.rate,
                        knownCurrencies
                    ),

                    fee: pollable.data.fee,
                }

            case 'loading':
            case 'error':
                return {
                    type: 'incomplete_withdrawal_request',
                    knownCurrencies,
                    fromAmount,
                    currencyId: pollable.params.form.outputCurrency.id,
                }

            /* istanbul ignore next */
            default:
                return notReachable(pollable)
        }
    })
}

const validateAmountNotZero = (
    pollable: WithdrawPollable
): Result<{ type: 'amount_is_zero' }, unknown> => {
    return amountToBigint(
        pollable.params.form.amount,
        pollable.params.form.inputCurrency.fraction
    ) > 0n
        ? success(undefined)
        : failure({ type: 'amount_is_zero' })
}

const validateKycStatus = (
    unblockUser: UnblockUser,
    offRampTransactions: OffRampTransaction[]
): Result<KycStatusError, unknown> => {
    const { kycStatus } = unblockUser
    switch (kycStatus.type) {
        case 'not_started':
            return validateTrialLimitReached(offRampTransactions)
        case 'approved':
            return success(kycStatus)
        case 'paused':
            return failure({ type: 'kyc_paused' })
        case 'failed':
            return failure({ type: 'kyc_failed' })
        case 'in_progress':
            return failure({ type: 'kyc_in_progress' })
        /* istanbul ignore next */
        default:
            return notReachable(kycStatus)
    }
}

const validateMinimumAmount = (
    pollable: WithdrawPollable,
    knownCurrencies: KnownCurrencies
): Result<MinimumAmountError, Money> => {
    const amountUsd = getCryptoAmountInDefaultCurrency(
        {
            amount: amountToBigint(
                pollable.params.form.amount,
                pollable.params.form.inputCurrency.fraction
            ),
            currencyId: pollable.params.form.inputCurrency.id,
        },
        knownCurrencies
    )

    return isGreaterThan(MINIMUM_TRANSFER_AMOUNT_IN_DEFAULT_CURRENCY, amountUsd)
        ? failure({
              type: 'minimum_amount',
              limit: applyRate(
                  MINIMUM_TRANSFER_AMOUNT_IN_DEFAULT_CURRENCY,
                  {
                      rate: amountToBigint(
                          '1',
                          pollable.params.form.inputCurrency.rateFraction
                      ),
                      base: MINIMUM_TRANSFER_AMOUNT_IN_DEFAULT_CURRENCY.currencyId,
                      quote: pollable.params.form.inputCurrency.id,
                  },
                  knownCurrencies
              ),
          })
        : success(amountUsd)
}

const validateBalanceAmount = (
    pollable: WithdrawPollable,
    balance: Money,
    knownCurrencies: KnownCurrencies
): Result<{ type: 'insufficient_balance' }, Money> => {
    const amountUsd = getCryptoAmountInDefaultCurrency(
        {
            amount: amountToBigint(
                pollable.params.form.amount,
                pollable.params.form.inputCurrency.fraction
            ),
            currencyId: pollable.params.form.inputCurrency.id,
        },
        knownCurrencies
    )

    const balanceUsd = getCryptoAmountInDefaultCurrency(
        balance,
        knownCurrencies
    )

    return isGreaterThan(amountUsd, balanceUsd)
        ? failure({ type: 'insufficient_balance' })
        : success(amountUsd)
}

const validateTrialLimitReached = (
    offRampTransactions: OffRampTransaction[]
): Result<{ type: 'trial_limit_reached' }, unknown> => {
    // TODO: Unblock to confirm that any offramp transaction means trial limit reached
    return offRampTransactions.length > 0
        ? failure({ type: 'trial_limit_reached' })
        : success(offRampTransactions)
}

const validateKYCWithdrawalLimit = (
    pollable: WithdrawPollable,
    unblockUser: UnblockUser,
    knownCurrencies: KnownCurrencies
): Result<MaxWithdrawError, OffRampFeeParams> => {
    switch (pollable.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed': {
            const usdcMoney = getCryptoAmountInDefaultCurrency(
                {
                    amount: amountToBigint(
                        pollable.params.form.amount,
                        pollable.params.form.inputCurrency.fraction
                    ),
                    currencyId: pollable.params.form.inputCurrency.id,
                },
                knownCurrencies
            )
            const { kycStatus } = unblockUser

            switch (kycStatus.type) {
                case 'paused':
                case 'failed':
                case 'in_progress':
                case 'not_started': {
                    return isGreaterThan(
                        usdcMoney,
                        PRE_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY
                    )
                        ? failure({ type: 'pre_kyc_limit_reached' })
                        : success(pollable.params.form)
                }

                case 'approved':
                    return isGreaterThan(
                        usdcMoney,
                        POST_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY
                    )
                        ? failure({ type: 'post_kyc_limit_reached' })
                        : success(pollable.params.form)

                /* istanbul ignore next */
                default:
                    return notReachable(kycStatus)
            }
        }
        case 'loading':
            return failure({ type: 'pollable_loading' })
        case 'error':
            return success(pollable.params.form)
        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
