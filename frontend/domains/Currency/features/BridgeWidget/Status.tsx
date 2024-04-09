import { FormattedMessage } from 'react-intl'

import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { Row } from '@zeal/uikit/Row'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

import {
    BridgeSubmitted,
    BridgeSubmittedStatus,
} from '@zeal/domains/Currency/domains/Bridge'
import { openExplorerLink } from '@zeal/domains/Currency/domains/Bridge/helpers/openExplorerLink'

type Props = {
    nowTimestampMs: number
    bridgeSubmitted: BridgeSubmitted
    bridgeSubmittedStatus: BridgeSubmittedStatus
}

export const Status = ({
    nowTimestampMs,
    bridgeSubmitted,
    bridgeSubmittedStatus,
}: Props) => {
    switch (bridgeSubmittedStatus.targetTransaction.type) {
        case 'pending':
        case 'not_started':
            return (
                <Pending
                    bridgeSubmitted={bridgeSubmitted}
                    nowTimestampMs={nowTimestampMs}
                />
            )

        case 'completed':
            if (!bridgeSubmitted.route.refuel) {
                return <Completed bridgeSubmitted={bridgeSubmitted} />
            }

            if (!bridgeSubmittedStatus.refuel) {
                return (
                    <Pending
                        bridgeSubmitted={bridgeSubmitted}
                        nowTimestampMs={nowTimestampMs}
                    />
                )
            }

            switch (bridgeSubmittedStatus.refuel.type) {
                case 'pending':
                case 'not_started':
                    return (
                        <Pending
                            bridgeSubmitted={bridgeSubmitted}
                            nowTimestampMs={nowTimestampMs}
                        />
                    )

                case 'completed':
                    return <Completed bridgeSubmitted={bridgeSubmitted} />

                /* istanbul ignore next */
                default:
                    return notReachable(bridgeSubmittedStatus.refuel.type)
            }

        /* istanbul ignore next */
        default:
            return notReachable(bridgeSubmittedStatus.targetTransaction.type)
    }
}

const Completed = ({
    bridgeSubmitted,
}: {
    bridgeSubmitted: BridgeSubmitted
}) => {
    return (
        <Row spacing={8}>
            <Text
                variant="footnote"
                weight="regular"
                color="textStatusSuccessOnColor"
            >
                <FormattedMessage
                    id="bridge.widget.completed"
                    defaultMessage="Complete"
                />
            </Text>

            <Text
                variant="footnote"
                weight="regular"
                color="textStatusSuccessOnColor"
            >
                <Tertiary
                    size="small"
                    color="success"
                    onClick={() => openExplorerLink(bridgeSubmitted)}
                >
                    {({ color, textVariant, textWeight }) => (
                        <Row spacing={0}>
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                0x
                            </Text>

                            <ExternalLink size={14} color={color} />
                        </Row>
                    )}
                </Tertiary>
            </Text>
        </Row>
    )
}

const Pending = ({
    bridgeSubmitted,
    nowTimestampMs,
}: {
    nowTimestampMs: number
    bridgeSubmitted: BridgeSubmitted
}) => {
    const formatHumanReadableDuration = useReadableDuration()

    return (
        <Row spacing={8}>
            <Text variant="footnote" weight="regular" color="textSecondary">
                {`${formatHumanReadableDuration(
                    nowTimestampMs - bridgeSubmitted.submittedAtMS,
                    'floor'
                )} / ${formatHumanReadableDuration(
                    bridgeSubmitted.route.serviceTimeMs
                )}`}
            </Text>

            <Text
                variant="footnote"
                weight="regular"
                color="textStatusSuccessOnColor"
            >
                <Tertiary
                    size="small"
                    color="on_light"
                    onClick={() => {
                        openExplorerLink(bridgeSubmitted)
                    }}
                >
                    {({ color, textVariant, textWeight }) => (
                        <Row spacing={0}>
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                0x
                            </Text>

                            <ExternalLink size={14} color={color} />
                        </Row>
                    )}
                </Tertiary>
            </Text>
        </Row>
    )
}
