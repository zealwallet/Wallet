import { FormattedMessage } from 'react-intl'

import { Avatar } from '@zeal/uikit/Avatar'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { BoldCrossMedium } from '@zeal/uikit/Icon/BoldCrossMedium'
import { BoldId } from '@zeal/uikit/Icon/BoldId'
import { LightArrowRight2 } from '@zeal/uikit/Icon/LightArrowRight2'
import { IconButton } from '@zeal/uikit/IconButton'
import { OutOfFlow } from '@zeal/uikit/OutOfFlow'
import { ProgressThin } from '@zeal/uikit/ProgressThin'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { KycStatus } from '@zeal/domains/Currency/domains/BankTransfer'

export type Props = {
    status: KycStatus
    onMsg: (msg: Msg) => void
}

// TODO: what is the correct animation time? 300 is used in some other places.
const ANIMATION_TIME_MS = 300

const pendingProgress = 40

export type Msg =
    | { type: 'on_dismiss_kyc_button_clicked' }
    | { type: 'on_click' }

export const Layout = ({ status, onMsg }: Props) => {
    return (
        <Clickable
            onClick={() => {
                onMsg({ type: 'on_click' })
            }}
        >
            <Group variant="default">
                <Column spacing={12}>
                    <Row spacing={12}>
                        <Avatar size={32}>
                            <BoldId size={32} color="iconDefault" />
                        </Avatar>

                        <Column spacing={4} alignX="stretch" shrink>
                            <Row spacing={0}>
                                <Text
                                    variant="paragraph"
                                    color="textPrimary"
                                    weight="regular"
                                >
                                    <FormattedMessage
                                        id="kyc_status.title"
                                        defaultMessage="Verifying identity"
                                    />
                                </Text>

                                <Spacer />

                                <OutOfFlow align="iconButtonRight">
                                    {(() => {
                                        switch (status.type) {
                                            case 'not_started':
                                            case 'in_progress':
                                                return null
                                            case 'approved':
                                            case 'paused':
                                            case 'failed':
                                                return (
                                                    <IconButton
                                                        variant="on_light"
                                                        onClick={(ev) => {
                                                            ev.stopPropagation()
                                                            onMsg({
                                                                type: 'on_dismiss_kyc_button_clicked',
                                                            })
                                                        }}
                                                    >
                                                        {({ color }) => (
                                                            <BoldCrossMedium
                                                                size={24}
                                                                color={color}
                                                            />
                                                        )}
                                                    </IconButton>
                                                )
                                            default:
                                                return notReachable(status)
                                        }
                                    })()}
                                </OutOfFlow>
                            </Row>

                            <Row spacing={8} alignX="stretch">
                                {(() => {
                                    switch (status.type) {
                                        case 'not_started':
                                        case 'approved':
                                        case 'failed':
                                        case 'in_progress':
                                            return (
                                                <Text
                                                    variant="footnote"
                                                    color="textSecondary"
                                                    weight="regular"
                                                >
                                                    <FormattedMessage
                                                        id="kyc_status.subtitle"
                                                        defaultMessage="Bank transfers"
                                                    />
                                                </Text>
                                            )
                                        case 'paused':
                                            return (
                                                <Text
                                                    variant="footnote"
                                                    color="textStatusWarningOnColor"
                                                    weight="regular"
                                                >
                                                    <FormattedMessage
                                                        id="kyc_status.subtitle.wrong_details"
                                                        defaultMessage="Wrong details"
                                                    />
                                                </Text>
                                            )
                                        default:
                                            return notReachable(status)
                                    }
                                })()}

                                {(() => {
                                    switch (status.type) {
                                        case 'not_started':
                                        case 'in_progress':
                                            return (
                                                <Text
                                                    variant="footnote"
                                                    color="textSecondary"
                                                    weight="regular"
                                                >
                                                    <FormattedMessage
                                                        id="kyc_status.subtitle"
                                                        defaultMessage="In progress"
                                                    />
                                                </Text>
                                            )
                                        case 'failed':
                                            return (
                                                <Row spacing={4}>
                                                    <Text
                                                        variant="footnote"
                                                        color="textStatusCriticalOnColor"
                                                        weight="regular"
                                                    >
                                                        <FormattedMessage
                                                            id="kyc_status.failed_status"
                                                            defaultMessage="Failed"
                                                        />
                                                    </Text>
                                                    <LightArrowRight2
                                                        color="textStatusCriticalOnColor"
                                                        size={14}
                                                    />
                                                </Row>
                                            )

                                        case 'paused':
                                            return (
                                                <Row spacing={4}>
                                                    <Text
                                                        variant="footnote"
                                                        color="textStatusWarningOnColor"
                                                        weight="regular"
                                                    >
                                                        <FormattedMessage
                                                            id="kyc_status.paused_status"
                                                            defaultMessage="Review"
                                                        />
                                                    </Text>
                                                    <LightArrowRight2
                                                        color="textStatusWarningOnColor"
                                                        size={14}
                                                    />
                                                </Row>
                                            )

                                        case 'approved':
                                            return (
                                                <Text
                                                    variant="footnote"
                                                    color="textStatusSuccessOnColor"
                                                    weight="regular"
                                                >
                                                    <FormattedMessage
                                                        id="kyc_status.completed_status"
                                                        defaultMessage="Complete"
                                                    />
                                                </Text>
                                            )
                                        default:
                                            return notReachable(status)
                                    }
                                })()}
                            </Row>
                        </Column>
                    </Row>

                    {(() => {
                        switch (status.type) {
                            case 'in_progress':
                            case 'not_started':
                                return (
                                    <ProgressThin
                                        background="neutral"
                                        initialProgress={null}
                                        progress={pendingProgress}
                                        animationTimeMs={ANIMATION_TIME_MS}
                                    />
                                )
                            case 'paused':
                                return (
                                    <ProgressThin
                                        background="warning"
                                        initialProgress={pendingProgress}
                                        progress={100}
                                        animationTimeMs={ANIMATION_TIME_MS}
                                    />
                                )
                            case 'failed':
                                return (
                                    <ProgressThin
                                        background="critical"
                                        initialProgress={pendingProgress}
                                        progress={100}
                                        animationTimeMs={ANIMATION_TIME_MS}
                                    />
                                )
                            case 'approved':
                                return (
                                    <ProgressThin
                                        background="success"
                                        initialProgress={pendingProgress}
                                        progress={100}
                                        animationTimeMs={ANIMATION_TIME_MS}
                                    />
                                )
                            default:
                                return notReachable(status)
                        }
                    })()}
                </Column>
            </Group>
        </Clickable>
    )
}
