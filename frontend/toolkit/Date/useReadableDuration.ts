import { useCallback } from 'react'
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl'

import { formatDistanceStrict } from 'date-fns'

import { notReachable } from '../notReachable'

const shortLocaleDistances = defineMessages({
    xSeconds: { id: 'durations.short.seconds', defaultMessage: '{count} sec' },
    xMinutes: { id: 'durations.short.minutes', defaultMessage: '{count} min' },
    xHours: { id: 'durations.short.hours', defaultMessage: '{count} h' },
    xDays: { id: 'durations.short.days', defaultMessage: '{count} d' },
    xMonths: { id: 'durations.short.months', defaultMessage: '{count} m' },
    xYears: { id: 'durations.short.years', defaultMessage: '{count} y' },
})

const longLocaleDistances = defineMessages({
    xSeconds: {
        id: 'durations.long.seconds',
        defaultMessage: '{count} seconds',
    },
    xMinutes: {
        id: 'durations.long.minutes',
        defaultMessage: '{count} minutes',
    },
    xHours: { id: 'durations.long.hours', defaultMessage: '{count} hours' },
    xDays: { id: 'durations.long.days', defaultMessage: '{count} days' },
    xMonths: { id: 'durations.long.months', defaultMessage: '{count} months' },
    xYears: { id: 'durations.long.years', defaultMessage: '{count} years' },
})

const getLocaleDistances = (
    locale: 'short' | 'long'
): Record<string, MessageDescriptor> => {
    switch (locale) {
        case 'short':
            return shortLocaleDistances
        case 'long':
            return longLocaleDistances
        /* istanbul ignore next */
        default:
            return notReachable(locale)
    }
}

export const useReadableDuration = () => {
    const { formatMessage } = useIntl()

    return useCallback(
        (
            timestamp: number,
            roundingMethod: 'floor' | 'ceil' = 'ceil',
            localeVariant: 'short' | 'long' = 'short'
        ) => {
            const now = Date.now()

            return formatDistanceStrict(now, now + timestamp, {
                locale: {
                    formatDistance: (token: string, count: string): string => {
                        const distances = getLocaleDistances(localeVariant)
                        return formatMessage(distances[token], { count })
                    },
                },
                roundingMethod,
            })
        },
        [formatMessage]
    )
}
