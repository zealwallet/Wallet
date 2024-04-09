import { notReachable } from '@zeal/toolkit'
import { failure, Result, shape, success } from '@zeal/toolkit/Result'

import {
    BridgePollable,
    BridgeRequest,
} from '@zeal/domains/Currency/domains/Bridge'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { Portfolio } from '@zeal/domains/Portfolio'
import { Token } from '@zeal/domains/Token'

type NoRoutesFoundError = { type: 'no_routes_found' }
type NotEnoughBalanceError = { type: 'not_enough_balance' }
type PollableReloading = { type: 'pollable_reloading' }
type PollableLoading = { type: 'pollable_loading' }
type PollableFailed = { type: 'pollable_failed' }
type AmountRequired = { type: 'amount_required' }
type PollableSubsequentFailed = { type: 'pollable_subsequent_failed' }
type NotEnoughNativeCurrency = { type: 'not_enough_native_currency' }
type SelectedRouteIsNoMoreAvailable = {
    type: 'selected_route_is_no_more_available'
}

type FromTokenError = NotEnoughBalanceError | AmountRequired

export type SubmitError =
    | PollableReloading
    | AmountRequired
    | PollableSubsequentFailed
    | NoRoutesFoundError
    | NotEnoughBalanceError
    | NotEnoughNativeCurrency
    | SelectedRouteIsNoMoreAvailable
    | PollableLoading
    | PollableFailed

export type FormError = {
    fromToken?: FromTokenError
    submit?: SubmitError
}

export const getBridgeRouteRequest = ({
    pollable,
}: {
    pollable: BridgePollable
}): BridgeRequest | null => {
    switch (pollable.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                pollable.data.find(
                    (route) =>
                        route.route.name === pollable.params.bridgeRouteName
                ) ||
                pollable.data[0] ||
                null
            )
        case 'loading':
        case 'error':
            return null

        default:
            return notReachable(pollable)
    }
}

export const getFromToken = ({
    portfolio,
    pollable,
}: {
    portfolio: Portfolio
    pollable: BridgePollable
}): Token | null =>
    portfolio.tokens.find(
        (token) => token.balance.currencyId === pollable.params.fromCurrency.id
    ) || null

export const validateNotEnoughBalance = ({
    pollable,
    portfolio,
}: {
    pollable: BridgePollable
    portfolio: Portfolio
}): Result<NotEnoughBalanceError, void> => {
    const token = getFromToken({ pollable, portfolio })
    const fromAmount = amountToBigint(
        pollable.params.fromAmount,
        pollable.params.fromCurrency.fraction
    )

    const isUserDidNotInputAnythingYet = fromAmount === 0n

    if (isUserDidNotInputAnythingYet) {
        return success(undefined)
    }

    if (!token || token.balance.amount < fromAmount) {
        return failure({ type: 'not_enough_balance' })
    }

    return success(undefined)
}

const validateAmountRequred = ({
    pollable,
}: {
    pollable: BridgePollable
}): Result<AmountRequired, void> => {
    const { fromCurrency, fromAmount } = pollable.params

    if (
        !fromAmount ||
        amountToBigint(fromAmount, fromCurrency.fraction) === 0n
    ) {
        return failure({ type: 'amount_required' })
    }

    return success(undefined)
}

const validateRoute = ({
    pollable,
}: {
    pollable: Extract<BridgePollable, { type: 'loaded' }>
}): Result<
    NoRoutesFoundError | SelectedRouteIsNoMoreAvailable,
    BridgeRequest
> => {
    if (!pollable.data.length) {
        return failure({ type: 'no_routes_found' })
    }

    const selectedRoute = getBridgeRouteRequest({ pollable })

    if (!selectedRoute) {
        return failure({ type: 'selected_route_is_no_more_available' })
    }

    return success(selectedRoute)
}

export const validateSubmit = ({
    pollable,
    portfolio,
}: {
    pollable: BridgePollable
    portfolio: Portfolio
}): Result<SubmitError, BridgeRequest> => {
    switch (pollable.type) {
        case 'loaded': {
            return (
                validateAmountRequred({ pollable })
                    .andThen(() =>
                        validateNotEnoughBalance({ pollable, portfolio })
                    )
                    .andThen(() =>
                        validateNotEnoughBalance({ pollable, portfolio })
                    )
                    // TODO not enough native balance not implemented
                    .andThen(() => validateRoute({ pollable }))
            )
        }

        case 'reloading':
            return failure({ type: 'pollable_reloading' })

        case 'subsequent_failed':
            return failure({ type: 'pollable_subsequent_failed' })
        case 'loading':
            return failure({ type: 'pollable_loading' })
        case 'error':
            return failure({ type: 'pollable_failed' })

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

export const validateOnSubmit = ({
    pollable,
    portfolio,
}: {
    pollable: BridgePollable
    portfolio: Portfolio
}): Result<FormError, BridgeRequest> => {
    return shape({
        fromToken: validateNotEnoughBalance({ pollable, portfolio }),
        submit: validateSubmit({ pollable, portfolio }),
    }).map(({ submit }) => submit)
}
