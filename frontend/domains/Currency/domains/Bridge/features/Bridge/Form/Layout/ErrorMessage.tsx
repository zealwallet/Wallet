import React from 'react'
import { FormattedMessage } from 'react-intl'

import { notReachable } from '@zeal/toolkit'

import { SubmitError } from './validation'

type Props = { error?: SubmitError }

export const ErrorMessage = ({ error }: Props) => {
    if (!error) {
        return (
            <FormattedMessage id="action.continue" defaultMessage="Continue" />
        )
    }
    switch (error.type) {
        case 'pollable_reloading':
        case 'pollable_subsequent_failed':
        case 'amount_required':
        case 'pollable_loading':
        case 'pollable_failed':
            return (
                <FormattedMessage
                    id="action.continue"
                    defaultMessage="Continue"
                />
            )
        case 'not_enough_balance':
            return (
                <FormattedMessage
                    id="swap.form.error.not_enough_balance"
                    defaultMessage="Not enough balance"
                />
            )
        case 'not_enough_native_currency':
            return (
                <FormattedMessage
                    id="swap.form.error.not_enough_native_currency"
                    defaultMessage="Not enough native currency"
                />
            )
        case 'no_routes_found':
        case 'selected_route_is_no_more_available':
            return (
                <FormattedMessage
                    id="swap.form.error.no_routes_found"
                    defaultMessage="No routes found"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}
