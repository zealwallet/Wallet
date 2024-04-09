import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { failure, Result, shape, success } from '@zeal/toolkit/Result'

import { Currency, KnownCurrencies } from '@zeal/domains/Currency'
import {
    OnRampTransaction,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { UNBLOCK_SUSPENDED_FIAT_CURRENCY_CODES } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
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

import { OnRampFeeResponse } from './index'

type MaxDepositError =
    | { type: 'pre_kyc_limit_reached' }
    | { type: 'post_kyc_limit_reached' }
    | { type: 'pollable_loading' }

type KycStatusError =
    | { type: 'trial_limit_reached' }
    | { type: 'kyc_in_progress' }
    | { type: 'kyc_paused' }
    | { type: 'kyc_failed' }

export type BannerError = MaxDepositError | KycStatusError

export type MinimumAmountError = {
    type: 'minimum_amount'
    limit: Money
}

export type FormErrors = {
    input?: MinimumAmountError
    banner?: BannerError
    submit?:
        | BannerError
        | MinimumAmountError
        | CurrencyIsCurrentlyNotSupported
        | { type: 'amount_is_zero' }
}

export type DepositPollable = PollableData<
    OnRampFeeResponse,
    { form: OnRampFeeParams; bankTransferInfo: BankTransferUnblockUserCreated }
>

type CurrencyIsCurrentlyNotSupported = {
    type: 'currency_is_currently_not_supported'
    currency: Currency
}

const validateCurrency = (
    pollable: DepositPollable
): Result<CurrencyIsCurrentlyNotSupported, unknown> => {
    const currency = pollable.params.form.inputCurrency
    return UNBLOCK_SUSPENDED_FIAT_CURRENCY_CODES.includes(currency.code)
        ? failure({
              type: 'currency_is_currently_not_supported',
              currency,
          })
        : success(undefined)
}

const validateDepositLimit = (
    pollable: DepositPollable,
    unblockUser: UnblockUser,
    knownCurrencies: KnownCurrencies
): Result<MaxDepositError, OnRampFeeParams> => {
    switch (pollable.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed': {
            const { form } = pollable.params
            const crypto = applyRate(
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

            const amountInDefaultCurrency: Money =
                getCryptoAmountInDefaultCurrency(crypto, knownCurrencies)
            const { kycStatus } = unblockUser
            switch (kycStatus.type) {
                case 'paused':
                case 'failed':
                case 'in_progress':
                case 'not_started':
                    return isGreaterThan(
                        amountInDefaultCurrency,
                        PRE_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY
                    )
                        ? failure({ type: 'pre_kyc_limit_reached' })
                        : success(form)

                case 'approved':
                    return isGreaterThan(
                        amountInDefaultCurrency,
                        POST_KYC_TRANSFER_LIMIT_IN_DEFAULT_CURRENCY
                    )
                        ? failure({ type: 'post_kyc_limit_reached' })
                        : success(form)
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

const validateAmountNotZero = (
    pollable: DepositPollable
): Result<{ type: 'amount_is_zero' }, unknown> => {
    return amountToBigint(
        pollable.params.form.amount,
        pollable.params.form.inputCurrency.fraction
    ) > 0n
        ? success(undefined)
        : failure({ type: 'amount_is_zero' })
}

const validateTrialLimitReached = (
    onRampTransactions: OnRampTransaction[]
): Result<
    {
        type: 'trial_limit_reached'
    },
    OnRampTransaction[]
> => {
    return onRampTransactions.some((transaction) => {
        switch (transaction.status) {
            case 'AML_CHECKS_COMPLETED':
            case 'AML_CHECKS_FAILED':
            case 'AML_CHECKS_IN_PROGRESS':
            case 'CRYPTO_TRANSFER_COMPLETED':
            case 'CRYPTO_TRANSFER_FAILED':
            case 'CRYPTO_TRANSFER_IN_PROGRESS':
            case 'CRYPTO_TRANSFER_ISSUED':
            case 'FINALITY_REACHED':
            case 'FINALIZE_PROCESS_FAILED':
            case 'IBAN_TRANSFER_COMPLETED':
            case 'IBAN_TRANSFER_FAILED':
            case 'IBAN_TRANSFER_IN_PROGRESS':
            case 'IBAN_TRANSFER_ISSUED':
            case 'INTERLEDGER_TRANSFER_COMPLETED':
            case 'INTERLEDGER_TRANSFER_FAILED':
            case 'INTERLEDGER_TRANSFER_IN_PROGRESS':
            case 'INTERLEDGER_TRANSFER_ISSUED':
            case 'ON_HOLD_KYC':
            case 'OUTSIDE_TRANSFER_APPROVED':
            case 'OUTSIDE_TRANSFER_IN_REVIEW':
            case 'OUTSIDE_TRANSFER_RECEIVED':
            case 'PROCESS_BLOCKED':
            case 'PROCESS_COMPLETED':
            case 'PROCESS_INITIATION_FAILED':
            case 'FIAT_TRANSFER_ISSUED':
                return true

            // TODO: Unblock to come back if this is only case
            case 'OUTSIDE_TRANSFER_REJECTED':
                return false

            /* istanbul ignore next */
            default:
                return notReachable(transaction.status)
        }
    })
        ? failure({ type: 'trial_limit_reached' })
        : success(onRampTransactions)
}

const validateKycStatus = (
    unblockUser: UnblockUser,
    onRampTransactions: OnRampTransaction[]
): Result<KycStatusError, unknown> => {
    const { kycStatus } = unblockUser

    switch (kycStatus.type) {
        case 'not_started':
            return validateTrialLimitReached(onRampTransactions)
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
    pollable: DepositPollable,
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

export const validateBeforeSubmit = (
    pollable: DepositPollable,
    unblockUser: UnblockUser,
    onRampTransactions: OnRampTransaction[],
    knownCurrencies: KnownCurrencies
): Result<FormErrors, unknown> => {
    return shape({
        banner: validateKycStatus(unblockUser, onRampTransactions).andThen(() =>
            validateDepositLimit(pollable, unblockUser, knownCurrencies)
        ),
        submit: validateKycStatus(unblockUser, onRampTransactions)
            .andThen(() => validateCurrency(pollable))
            .andThen(() =>
                validateDepositLimit(pollable, unblockUser, knownCurrencies)
            )
            .andThen(() => validateAmountNotZero(pollable)),
    })
}

export const validateOnSubmit = (
    pollable: DepositPollable,
    unblockUser: UnblockUser,
    onRampTransactions: OnRampTransaction[],
    knownCurrencies: KnownCurrencies
): Result<FormErrors, OnRampFeeParams> => {
    return shape({
        input: validateMinimumAmount(pollable, knownCurrencies),
        banner: validateKycStatus(unblockUser, onRampTransactions).andThen(() =>
            validateDepositLimit(pollable, unblockUser, knownCurrencies)
        ),
        submit: validateKycStatus(unblockUser, onRampTransactions)
            .andThen(() => validateMinimumAmount(pollable, knownCurrencies))
            .andThen(() =>
                validateDepositLimit(pollable, unblockUser, knownCurrencies)
            )
            .andThen(() => validateAmountNotZero(pollable)),
    }).map(() => pollable.params.form)
}
