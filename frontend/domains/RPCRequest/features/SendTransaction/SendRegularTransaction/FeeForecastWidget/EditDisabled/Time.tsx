import { FormattedMessage } from 'react-intl'

import { components } from '@zeal/api/portfolio'

import { LightDangerTriangle } from '@zeal/uikit/Icon/LightDangerTriangle'
import { SolidLightning } from '@zeal/uikit/Icon/SolidLightning'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

type Props = {
    errored?: boolean

    forecastDuration: components['schemas']['ForecastDuration']
}

export const Time = ({ forecastDuration, errored }: Props) => {
    const formatHumanReadableDuration = useReadableDuration()

    switch (forecastDuration.type) {
        case 'WithinForecast':
            return (
                <Row spacing={4}>
                    <SolidLightning size={20} color="iconDefault" />
                    <Text
                        variant="paragraph"
                        weight="regular"
                        color="textPrimary"
                    >
                        {formatHumanReadableDuration(
                            forecastDuration.durationMs
                        )}
                    </Text>
                </Row>
            )

        case 'OutsideOfForecast':
            return (
                <Row spacing={4}>
                    <LightDangerTriangle
                        size={20}
                        color={errored ? 'iconStatusCritical' : 'iconDefault'}
                    />

                    <Text
                        variant="paragraph"
                        weight="regular"
                        color="textPrimary"
                    >
                        <FormattedMessage
                            id="FeeForecastWiget.unknownDuration"
                            defaultMessage="Unknown"
                        />
                    </Text>
                </Row>
            )

        /* istanbul ignore next */
        default:
            return notReachable(forecastDuration)
    }
}
