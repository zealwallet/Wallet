import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { values } from '@zeal/toolkit/Object'
import { failure, Result, shape, success } from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { FXRate } from '@zeal/domains/FXRate'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { Money } from '@zeal/domains/Money'
import { PredefinedNetwork } from '@zeal/domains/Network'
import { PREDEFINED_NETWORKS } from '@zeal/domains/Network/constants'
import { Portfolio } from '@zeal/domains/Portfolio'

import { ConnectionState } from './ConnectionState'

import { TopUpRequest } from '../TopUpRequest'

export type Form = {
    currency: CryptoCurrency
    amount: string | null
}

export type FormError = {
    balance?: { type: 'insufficient_balance' }
    submit?:
        | { type: 'insufficient_balance' }
        | { type: 'amount_requred' }
        | { type: 'connected_to_unsupported_network' }
}

const validateAmount = ({
    form,
}: {
    form: Form
}): Result<{ type: 'amount_requred' }, unknown> =>
    amountToBigint(form.amount, form.currency.fraction) === 0n
        ? failure({ type: 'amount_requred' })
        : success(undefined)

const validateBalance = ({
    form,
    portfolioLoadable,
}: {
    portfolioLoadable: LoadableData<Portfolio, unknown>
    form: Form
}): Result<{ type: 'insufficient_balance' }, Money> => {
    const money: Money = {
        amount: amountToBigint(form.amount, form.currency.fraction),
        currencyId: form.currency.id,
    }

    switch (portfolioLoadable.type) {
        case 'loading':
        case 'error':
            return success(money)

        case 'loaded':
            const portfolioToken =
                portfolioLoadable.data.tokens.find(
                    (token) => token.balance.currencyId === money.currencyId
                ) || null

            return !portfolioToken ||
                portfolioToken.balance.amount < money.amount
                ? failure({ type: 'insufficient_balance' })
                : success(money)

        default:
            return notReachable(portfolioLoadable)
    }
}

const validateConnectionState = ({
    connectionState,
    form,
}: {
    form: Form
    connectionState: Extract<
        ConnectionState,
        { type: 'connected' | 'connected_to_unsupported_network' }
    >
}): Result<{ type: 'connected_to_unsupported_network' }, PredefinedNetwork> => {
    switch (connectionState.type) {
        case 'connected_to_unsupported_network':
            return failure({ type: 'connected_to_unsupported_network' })
        case 'connected':
            const connectedNetwork = PREDEFINED_NETWORKS.find(
                (network) => network.hexChainId === connectionState.networkHexId
            )

            return connectedNetwork &&
                form.currency.networkHexChainId === connectedNetwork.hexChainId
                ? success(connectedNetwork)
                : failure({ type: 'connected_to_unsupported_network' })

        default:
            return notReachable(connectionState)
    }
}

export const validateAsYouType = ({
    form,
    fromAccount,
    portfolioLoadable,
    ratePollable,
    zealAccount,
    connectionState,
}: {
    zealAccount: Account
    fromAccount: Account
    ratePollable: PollableData<
        { rate: FXRate; currencies: KnownCurrencies },
        Form
    >
    form: Form
    portfolioLoadable: LoadableData<Portfolio, unknown>
    connectionState: Extract<
        ConnectionState,
        { type: 'connected' | 'connected_to_unsupported_network' }
    >
}): Result<
    FormError,
    { topUpRequest: TopUpRequest; knownCurrencies: KnownCurrencies | null }
> => {
    return shape({
        balance: validateBalance({ portfolioLoadable, form }),
        submit: shape({
            network: validateConnectionState({ connectionState, form }),
            amount: validateAmount({ form }).andThen(() =>
                validateBalance({ portfolioLoadable, form })
            ),
        }).mapError((error) => values(error)[0]),
    }).map(({ submit: { amount, network } }) => ({
        topUpRequest: {
            fromAccount,
            zealAccount,
            amount,
            network,
            amountInDefaultCurrency: (() => {
                switch (ratePollable.type) {
                    case 'loaded':
                    case 'reloading':
                    case 'subsequent_failed':
                        return applyRate(
                            amount,
                            ratePollable.data.rate,
                            ratePollable.data.currencies
                        )
                    case 'loading':
                    case 'error':
                        return null

                    default:
                        return notReachable(ratePollable)
                }
            })(),
        },
        knownCurrencies: (() => {
            switch (portfolioLoadable.type) {
                case 'loaded':
                    return portfolioLoadable.data.currencies
                case 'loading':
                case 'error':
                    switch (ratePollable.type) {
                        case 'loaded':
                        case 'reloading':
                        case 'subsequent_failed':
                            return ratePollable.data.currencies
                        case 'loading':
                        case 'error':
                            return null

                        default:
                            return notReachable(ratePollable)
                    }
                /* istanbul ignore next */
                default:
                    return notReachable(portfolioLoadable)
            }
        })(),
    }))
}
