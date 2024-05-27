import { FormattedMessage } from 'react-intl'

import { Avatar } from '@zeal/uikit/Avatar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { BoldId } from '@zeal/uikit/Icon/BoldId'
import { BoldSend } from '@zeal/uikit/Icon/BoldSend'
import { ProgressThin } from '@zeal/uikit/ProgressThin'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { GnosisPayAccountNotOnboardedState } from '@zeal/domains/Card'

type Props = {
    onboardingState: GnosisPayAccountNotOnboardedState['state']
}

export const OnboardingStatusWidget = ({ onboardingState }: Props) => {
    switch (onboardingState) {
        case 'kyc_submitted':
            return (
                <Group variant="default">
                    <Column spacing={12}>
                        <Row spacing={12}>
                            <Avatar size={32}>
                                <BoldId size={32} color="iconDefault" />
                            </Avatar>
                            <Column spacing={4} shrink>
                                <Text
                                    variant="paragraph"
                                    color="textPrimary"
                                    weight="regular"
                                >
                                    <FormattedMessage
                                        id="card.onboarding.status-widget.kyc-submitted.title"
                                        defaultMessage="Verifying identity"
                                    />
                                </Text>
                                <Row spacing={8} alignX="stretch">
                                    <Text
                                        variant="footnote"
                                        color="textSecondary"
                                        weight="regular"
                                    >
                                        <FormattedMessage
                                            id="card.onboarding.status-widget.subtitle"
                                            defaultMessage="Debit card"
                                        />
                                    </Text>
                                    <Text
                                        variant="footnote"
                                        color="textStatusNeutralOnColor"
                                        weight="regular"
                                    >
                                        <FormattedMessage
                                            id="card.onboarding.status-widget.kyc-submitted.status-text"
                                            defaultMessage="Wait for verification"
                                        />
                                    </Text>
                                </Row>
                            </Column>
                        </Row>
                        <ProgressThin
                            animationTimeMs={300}
                            initialProgress={null}
                            progress={25}
                            background="neutral"
                        />
                    </Column>
                </Group>
            )
        case 'kyc_approved':
            return (
                <Group variant="default">
                    <Column spacing={12}>
                        <Row spacing={12}>
                            <Avatar size={32}>
                                <BoldId size={32} color="iconDefault" />
                            </Avatar>
                            <Column spacing={4} shrink>
                                <Text
                                    variant="paragraph"
                                    color="textPrimary"
                                    weight="regular"
                                >
                                    <FormattedMessage
                                        id="card.onboarding.status-widget.kyc-approved.title"
                                        defaultMessage="Identity verification complete"
                                    />
                                </Text>
                                <Row spacing={8} alignX="stretch">
                                    <Text
                                        variant="footnote"
                                        color="textSecondary"
                                        weight="regular"
                                    >
                                        <FormattedMessage
                                            id="card.onboarding.status-widget.subtitle"
                                            defaultMessage="Debit card"
                                        />
                                    </Text>
                                    <Text
                                        variant="footnote"
                                        color="textStatusSuccessOnColor"
                                        weight="regular"
                                    >
                                        <FormattedMessage
                                            id="card.onboarding.status-widget.kyc-approved.status-text"
                                            defaultMessage="Order your card"
                                        />
                                    </Text>
                                </Row>
                            </Column>
                        </Row>
                        <ProgressThin
                            animationTimeMs={300}
                            initialProgress={null}
                            progress={40}
                            background="success"
                        />
                    </Column>
                </Group>
            )
        case 'card_shipped':
            return (
                <Group variant="default">
                    <Column spacing={12}>
                        <Row spacing={12}>
                            <Avatar size={32} variant="square">
                                <BoldSend size={32} color="iconDefault" />
                            </Avatar>
                            <Column spacing={4} shrink>
                                <Text
                                    variant="paragraph"
                                    color="textPrimary"
                                    weight="regular"
                                >
                                    <FormattedMessage
                                        id="card.onboarding.status-widget.card-shipped.title"
                                        defaultMessage="Card has been sent"
                                    />
                                </Text>
                                <Row spacing={8} alignX="stretch">
                                    <Text
                                        variant="footnote"
                                        color="textSecondary"
                                        weight="regular"
                                    >
                                        <FormattedMessage
                                            id="card.onboarding.status-widget.subtitle"
                                            defaultMessage="Debit card"
                                        />
                                    </Text>
                                    <Text
                                        variant="footnote"
                                        color="textStatusNeutralOnColor"
                                        weight="regular"
                                    >
                                        <FormattedMessage
                                            id="card.onboarding.status-widget.card-shipped.status-text"
                                            defaultMessage="Activate card"
                                        />
                                    </Text>
                                </Row>
                            </Column>
                        </Row>
                        <ProgressThin
                            animationTimeMs={300}
                            initialProgress={null}
                            progress={80}
                            background="neutral"
                        />
                    </Column>
                </Group>
            )
        case 'kyc_not_started':
            return (
                <Group variant="default">
                    <Column spacing={12}>
                        <Row spacing={12}>
                            <Avatar size={32} variant="square">
                                <BoldId size={32} color="iconDefault" />
                            </Avatar>
                            <Column spacing={4} shrink>
                                <Text
                                    variant="paragraph"
                                    color="textPrimary"
                                    weight="regular"
                                >
                                    <FormattedMessage
                                        id="card.onboarding.status-widget.kyc_no_started.title"
                                        defaultMessage="Identity verification required"
                                    />
                                </Text>
                                <Row spacing={8} alignX="stretch">
                                    <Text
                                        variant="footnote"
                                        color="textSecondary"
                                        weight="regular"
                                    >
                                        <FormattedMessage
                                            id="card.onboarding.status-kyc_no_started.subtitle"
                                            defaultMessage="Debit card"
                                        />
                                    </Text>
                                    <Text
                                        variant="footnote"
                                        color="textStatusNeutralOnColor"
                                        weight="regular"
                                    >
                                        <FormattedMessage
                                            id="card.onboarding.status-widget.card-shipped.status-text"
                                            defaultMessage="Resume verification"
                                        />
                                    </Text>
                                </Row>
                            </Column>
                        </Row>
                        <ProgressThin
                            animationTimeMs={300}
                            initialProgress={null}
                            progress={10}
                            background="neutral"
                        />
                    </Column>
                </Group>
            )

        case 'card_ready_to_be_shipped':
            return (
                <Group variant="default">
                    <Column spacing={12}>
                        <Row spacing={12}>
                            <Avatar size={32} variant="square">
                                <BoldId size={32} color="iconDefault" />
                            </Avatar>
                            <Column spacing={4} shrink>
                                <Text
                                    variant="paragraph"
                                    color="textPrimary"
                                    weight="regular"
                                >
                                    <FormattedMessage
                                        id="card.onboarding.status-widget.card_ready_to_be_shipped.title"
                                        defaultMessage="Card will be sent soon"
                                    />
                                </Text>
                                <Row spacing={8} alignX="stretch">
                                    <Text
                                        variant="footnote"
                                        color="textSecondary"
                                        weight="regular"
                                    >
                                        <FormattedMessage
                                            id="card.onboarding.status-kyc_no_started.subtitle"
                                            defaultMessage="Debit card"
                                        />
                                    </Text>
                                    <Text
                                        variant="footnote"
                                        color="textStatusNeutralOnColor"
                                        weight="regular"
                                    >
                                        <FormattedMessage
                                            id="card.onboarding.status-card_ready_to_be_shipped.user-action"
                                            defaultMessage="Wait for delivery"
                                        />
                                    </Text>
                                </Row>
                            </Column>
                        </Row>
                        <ProgressThin
                            animationTimeMs={300}
                            initialProgress={null}
                            progress={50}
                            background="neutral"
                        />
                    </Column>
                </Group>
            )

        /* istanbul ignore next */
        default:
            return notReachable(onboardingState)
    }
}
