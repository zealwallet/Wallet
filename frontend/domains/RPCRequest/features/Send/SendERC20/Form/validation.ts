import { notReachable } from '@zeal/toolkit'
import {
    failure,
    required,
    RequiredError,
    Result,
    shape,
    success,
} from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { revert } from '@zeal/domains/FXRate/helpers/revert'
import { Money } from '@zeal/domains/Money'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { createERC20EthSendTransaction } from '@zeal/domains/RPCRequest/helpers/createERC20EthSendTransaction'

import { Form } from './Layout'

type BalanceError = {
    type: 'not_enough_tokens'
}
type ToAddressError = RequiredError
type TokenError = RequiredError

type FormErrors = {
    amount?: BalanceError
    submit?:
        | BalanceError
        | { type: 'zero_amount' }
        | TokenError
        | ToAddressError
}

const validateTokenBalance = (
    form: Form,
    knownCurrencies: KnownCurrencies
): Result<BalanceError, Money> => {
    switch (form.type) {
        case 'amount_in_tokens': {
            const currency = knownCurrencies[form.token.balance.currencyId]
            const inputAmount = amountToBigint(form.amount, currency.fraction)
            return inputAmount <= form.token.balance.amount
                ? success({ amount: inputAmount, currencyId: currency.id })
                : failure({ type: 'not_enough_tokens' })
        }
        case 'amount_in_default_currency': {
            const currency =
                knownCurrencies[form.priceInDefaultCurrency.currencyId]
            const inputAmount = amountToBigint(form.amount, currency.fraction)
            const reverted = revert(form.fxRate, knownCurrencies)
            const tokenAmount = applyRate(
                { amount: inputAmount, currencyId: currency.id },
                reverted,
                knownCurrencies
            )
            return tokenAmount.amount <= form.token.balance.amount
                ? success({
                      amount: tokenAmount.amount,
                      currencyId: form.token.balance.currencyId,
                  })
                : failure({ type: 'not_enough_tokens' })
        }
        /* istanbul ignore next */
        default:
            return notReachable(form)
    }
}

const validateZeroAmount = (
    tokenAmount: Money
): Result<{ type: 'zero_amount' }, Money> => {
    return tokenAmount.amount > 0n
        ? success(tokenAmount)
        : failure({ type: 'zero_amount' })
}

export const validate = ({
    form,
    account,
    knownCurrencies,
    networkMap,
    networkRPCMap,
}: {
    form: Form
    account: Account
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
}): Result<
    FormErrors,
    {
        request: EthSendTransaction
        network: Network
    }
> => {
    return shape({
        amount: validateTokenBalance(form, knownCurrencies),
        submit: validateTokenBalance(form, knownCurrencies)
            .andThen((tokenAmount) => validateZeroAmount(tokenAmount))
            .andThen(() => required(form.toAddress))
            .andThen((toAddress) =>
                required(form.token).map((token) => ({
                    token,
                    toAddress,
                }))
            ),
    }).map((result) => {
        const { token, toAddress } = result.submit
        const network = networkMap[token.networkHexId]

        return {
            network,
            request: createERC20EthSendTransaction({
                fromAccount: account,
                knownCurrencies,
                toAddress,
                amount: result.amount,
                network,
                networkRPCMap,
            }),
        }
    })
}
