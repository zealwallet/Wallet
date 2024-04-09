import { notReachable } from '@zeal/toolkit'
import { LoadedReloadableData } from '@zeal/toolkit/LoadableData/LoadedReloadableData'
import { failure, Result, shape, success } from '@zeal/toolkit/Result'

import {
    SwapQuote,
    SwapQuoteRequest,
    SwapRoute,
} from '@zeal/domains/Currency/domains/SwapQuote'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'

type Pollable = LoadedReloadableData<SwapQuote, SwapQuoteRequest>

type NoRoutesFoundError = { type: 'no_routes_found' }
type NotEnoughBalanceError = { type: 'not_enough_balance' }
type PollableReloading = { type: 'pollable_reloading' }
type PollableSubsequentFailed = { type: 'pollable_subsequent_failed' }
type ToCurrencyNotSelectedError = { type: 'to_currency_not_selected' }
type NotEnoughNativeCurrency = { type: 'not_enough_native_currency' }
type AmountRequired = { type: 'amount_required' }
type SelectedRouteIsNoMoreAvailable = {
    type: 'selected_route_is_no_more_available'
}

type FromTokenError = NotEnoughBalanceError

type SubmitError =
    | PollableReloading
    | PollableSubsequentFailed
    | NoRoutesFoundError
    | NotEnoughBalanceError
    | ToCurrencyNotSelectedError
    | NotEnoughNativeCurrency
    | AmountRequired
    | SelectedRouteIsNoMoreAvailable

export type FormError = {
    fromToken?: FromTokenError
    submit?: SubmitError
}

export const getRoute = (
    pollable: LoadedReloadableData<SwapQuote, SwapQuoteRequest>
): SwapRoute | null =>
    pollable.data.routes.find(
        (route) => pollable.params.usedDexName === route.dexName
    ) ||
    pollable.data.routes[0] ||
    null

export const validate = ({
    pollable,
}: {
    pollable: Pollable
}): Result<FormError, SwapRoute> =>
    shape({
        fromToken: validateFromToken({ pollable }),
        submit: validateSubmit({ pollable }),
    }).map(({ submit }) => submit)

const validateFromToken = ({
    pollable,
}: {
    pollable: Pollable
}): Result<FromTokenError, unknown> => {
    const portfolio = pollable.params.portfolio
    const currency = pollable.params.fromCurrency
    const fromToken =
        portfolio.tokens.find(
            (token) => token.balance.currencyId === currency.id
        ) || null

    if (
        !fromToken ||
        fromToken.balance.amount <
            amountToBigint(pollable.params.amount, currency.fraction)
    ) {
        return failure({ type: 'not_enough_balance' })
    }

    return success(pollable.params.amount)
}

const validateSubmit = ({
    pollable,
}: {
    pollable: Pollable
}): Result<SubmitError, SwapRoute> => {
    const portfolio = pollable.params.portfolio
    switch (pollable.type) {
        case 'loaded': {
            const routes = pollable.data.routes
            const currency = pollable.params.fromCurrency
            const fromToken =
                portfolio.tokens.find(
                    (token) => token.balance.currencyId === currency.id
                ) || null

            if (
                !pollable.params.amount ||
                amountToBigint(pollable.params.amount, currency.fraction) === 0n
            ) {
                return failure({ type: 'amount_required' })
            }

            if (!pollable.params.toCurrency) {
                return failure({ type: 'to_currency_not_selected' })
            }

            if (
                !fromToken ||
                fromToken.balance.amount <
                    amountToBigint(pollable.params.amount, currency.fraction)
            ) {
                return failure({ type: 'not_enough_balance' })
            }

            if (!routes.length) {
                return failure({ type: 'no_routes_found' })
            }

            const selectedRoute = getRoute(pollable)

            if (!selectedRoute) {
                return failure({ type: 'selected_route_is_no_more_available' })
            }

            // TODO :: not enough native balance not implemented

            return success(selectedRoute)
        }

        case 'reloading':
            return failure({ type: 'pollable_reloading' })

        case 'subsequent_failed':
            return failure({ type: 'pollable_subsequent_failed' })

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
