import { FormattedMessage } from 'react-intl'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { Actions as UIActions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { CardWidget } from '@zeal/uikit/CardWidget'
import { Column } from '@zeal/uikit/Column'
import { LightArrowRight2 } from '@zeal/uikit/Icon/LightArrowRight2'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { format as formatAddress } from '@zeal/domains/Address/helpers/format'
import { GnosisPayAccountNotOnboardedState } from '@zeal/domains/Card'
import { openGnosisPayDashboard } from '@zeal/domains/Card/helpers/openGnosisPayDashboard'

import { OnboardingStatusWidget } from '../OnboardingStatusWidget'

type Props = {
    account: Account
    onboardingState: Extract<
        GnosisPayAccountNotOnboardedState['state'],
        'kyc_not_started'
    >
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_account_selector_clicked' }

export const Layout = ({ account, onboardingState, onMsg }: Props) => {
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
                        onClick={() => {
                            onMsg({ type: 'on_account_selector_clicked' })
                        }}
                    >
                        {({ color, textVariant, textWeight }) => (
                            <>
                                <Text
                                    variant={textVariant}
                                    weight={textWeight}
                                    color={color}
                                >
                                    <FormattedMessage
                                        id="card.kyc-not-started.check-status-button"
                                        defaultMessage="Choose another wallet"
                                    />
                                </Text>
                                <LightArrowRight2 size={14} color={color} />
                            </>
                        )}
                    </Tertiary>
                </Column>
                <Spacer />
                <UIActions>
                    <Button
                        variant="primary"
                        size="regular"
                        onClick={() => {
                            openGnosisPayDashboard()
                        }}
                    >
                        <FormattedMessage
                            id="card.page.order_card_button"
                            defaultMessage="Submit your ID"
                        />
                    </Button>
                </UIActions>
            </Column>
        </Screen>
    )
}
