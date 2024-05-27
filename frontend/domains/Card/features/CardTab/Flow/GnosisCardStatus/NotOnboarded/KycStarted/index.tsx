import { FormattedMessage } from 'react-intl'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { Actions as UIActions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { CardWidget } from '@zeal/uikit/CardWidget'
import { Column } from '@zeal/uikit/Column'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { LightArrowRight2 } from '@zeal/uikit/Icon/LightArrowRight2'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { format as formatAddress } from '@zeal/domains/Address/helpers/format'
import { GnosisPayAccountNotOnboardedState } from '@zeal/domains/Card'
import { openGnosisPayCardActivation } from '@zeal/domains/Card/helpers/openGnosisPayCardActivation'
import { openGnosisPayDashboard } from '@zeal/domains/Card/helpers/openGnosisPayDashboard'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { OnboardingStatusWidget } from '../OnboardingStatusWidget'

type Props = {
    account: Account
    installationId: string
    onboardingState: Extract<
        GnosisPayAccountNotOnboardedState['state'],
        | 'kyc_submitted'
        | 'kyc_approved'
        | 'card_shipped'
        | 'card_ready_to_be_shipped'
    >
}

export const KycStarted = ({
    onboardingState,
    account,
    installationId,
}: Props) => {
    return (
        <Screen padding="form" background="light" onNavigateBack={null}>
            <UIActionBar
                left={
                    <Row spacing={8}>
                        <AccountAvatar size={24} account={account} />
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                            ellipsis
                        >
                            {account.label}
                        </Text>

                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                        >
                            {formatAddress(account.address)}
                        </Text>
                    </Row>
                }
            />
            <Column spacing={8} fill alignY="stretch">
                <CardWidget side="front" />
                <Column spacing={8} alignX="center">
                    <OnboardingStatusWidget onboardingState={onboardingState} />
                    <Tertiary
                        size="regular"
                        color="on_color"
                        onClick={() => openGnosisPayDashboard()}
                    >
                        {({ color, textVariant, textWeight }) => (
                            <>
                                <Text
                                    variant={textVariant}
                                    weight={textWeight}
                                    color={color}
                                >
                                    <FormattedMessage
                                        id="card.kyc-started.get-support-button"
                                        defaultMessage="Get support on GnosisPay.com"
                                    />
                                </Text>
                                <LightArrowRight2 size={14} color={color} />
                            </>
                        )}
                    </Tertiary>
                </Column>
                <Spacer />
                <Actions
                    onboardingState={onboardingState}
                    installationId={installationId}
                />
            </Column>
        </Screen>
    )
}

const Actions = ({
    onboardingState,
    installationId,
}: {
    onboardingState: Props['onboardingState']
    installationId: string
}) => {
    switch (onboardingState) {
        case 'kyc_submitted':
            return (
                <UIActions>
                    <Button disabled variant="primary" size="regular">
                        <FormattedMessage
                            id="card.page.order_card_button"
                            defaultMessage="Order Card"
                        />
                    </Button>
                </UIActions>
            )
        case 'kyc_approved':
            return (
                <UIActions>
                    <Button
                        variant="primary"
                        size="regular"
                        onClick={() => {
                            postUserEvent({
                                type: 'ClickOrderCardButtonEvent',
                                installationId: installationId,
                            })
                            return openGnosisPayDashboard()
                        }}
                    >
                        <FormattedMessage
                            id="card.page.order_card_button"
                            defaultMessage="Order Card"
                        />
                    </Button>
                </UIActions>
            )

        case 'card_ready_to_be_shipped':
            return null

        case 'card_shipped':
            return (
                <UIActions>
                    <Button
                        variant="primary"
                        size="regular"
                        onClick={() => {
                            postUserEvent({
                                type: 'ClickActivateCardButtonEvent',
                                installationId: installationId,
                            })
                            openGnosisPayCardActivation()
                        }}
                    >
                        <Row spacing={6}>
                            <Text>
                                <FormattedMessage
                                    id="card.page.activate_button"
                                    defaultMessage="Activate card"
                                />
                            </Text>
                            <ExternalLink size={20} />
                        </Row>
                    </Button>
                </UIActions>
            )
        /* istanbul ignore next */
        default:
            return notReachable(onboardingState)
    }
}
