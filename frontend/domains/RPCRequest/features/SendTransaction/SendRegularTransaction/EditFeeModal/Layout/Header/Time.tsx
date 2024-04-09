import { FormattedMessage } from 'react-intl'

import { components } from '@zeal/api/portfolio'

import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

type Props = {
    duration: components['schemas']['ForecastDuration']
}

export const Time = ({ duration }: Props) => {
    const formatHumanReadableDuration = useReadableDuration()

    switch (duration.type) {
        case 'WithinForecast':
            return (
                <Text
                    ellipsis
                    variant="paragraph"
                    weight="regular"
                    color="textSecondary"
                >
                    {formatHumanReadableDuration(duration.durationMs)}
                </Text>
            )

        case 'OutsideOfForecast':
            return (
                <Text
                    ellipsis
                    variant="paragraph"
                    weight="regular"
                    color="textSecondary"
                >
                    <FormattedMessage
                        id="EditFeeModal.Header.Time.unknown"
                        defaultMessage="Time Unknown"
                    />
                </Text>
            )

        /* istanbul ignore next */
        default:
            return notReachable(duration)
    }
}
