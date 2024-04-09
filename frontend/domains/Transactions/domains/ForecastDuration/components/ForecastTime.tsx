import { FormattedMessage } from 'react-intl'

import { components } from '@zeal/api/portfolio'

import { BoldCheetah } from '@zeal/uikit/Icon/BoldCheetah'
import { BoldRabbit } from '@zeal/uikit/Icon/BoldRabbit'
import { BoldSetting } from '@zeal/uikit/Icon/BoldSetting'
import { BoldTurtle } from '@zeal/uikit/Icon/BoldTurtle'
import { LightDangerTriangle } from '@zeal/uikit/Icon/LightDangerTriangle'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

import { FeeForecastRequest } from '@zeal/domains/Transactions/api/fetchFeeForecast'

type Props = {
    errored?: boolean

    forecastDuration: components['schemas']['ForecastDuration']
    selectedPreset: FeeForecastRequest['selectedPreset']
}

const Icon = ({ preset }: { preset: FeeForecastRequest['selectedPreset'] }) => {
    switch (preset.type) {
        case 'Slow':
            return <BoldTurtle size={20} color="iconDefault" />

        case 'Normal':
            return <BoldRabbit size={20} color="iconDefault" />

        case 'Fast':
            return <BoldCheetah size={20} color="iconDefault" />

        case 'Custom':
            return <BoldSetting size={20} color="iconDefault" />

        /* istanbul ignore next */
        default:
            return notReachable(preset)
    }
}

export const ForecastTime = ({
    forecastDuration,
    errored,
    selectedPreset,
}: Props) => {
    const formatHumanReadableDuration = useReadableDuration()

    switch (forecastDuration.type) {
        case 'WithinForecast':
            return (
                <Row spacing={4}>
                    <Icon preset={selectedPreset} />
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
