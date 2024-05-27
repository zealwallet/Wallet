import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { ShieldEmpty } from '@zeal/uikit/Icon/ShieldEmpty'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

type Props = {
    secretPhraseTestStepsCount: number
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_verification_explaination_close' }
    | { type: 'on_continue_click' }

export const VerificationExplaination = ({
    secretPhraseTestStepsCount,
    onMsg,
}: Props) => {
    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() =>
                onMsg({ type: 'on_verification_explaination_close' })
            }
        >
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() =>
                            onMsg({
                                type: 'on_verification_explaination_close',
                            })
                        }
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />
            <Column spacing={24}>
                <Header
                    icon={({ size, color }) => (
                        <ShieldEmpty size={size} color={color} />
                    )}
                    title={
                        <FormattedMessage
                            id="keystore.write_secret_phrase.test_ps.title"
                            defaultMessage="Test Account Recovery"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="keystore.write_secret_phrase.test_ps.subtitle"
                            defaultMessage="You’ll need your Secret Phrase to restore your account in this or other devices. Let’s test that your Secret Phrase is written correctly."
                        />
                    }
                />
                <Row spacing={0} alignX="center">
                    <Text
                        variant="paragraph"
                        weight="bold"
                        color="textSecondary"
                        align="center"
                    >
                        <FormattedMessage
                            id="keystore.write_secret_phrase.test_ps.subtitle2"
                            defaultMessage="We’ll ask you for {count} words in your phrase."
                            values={{ count: secretPhraseTestStepsCount }}
                        />
                    </Text>
                </Row>
            </Column>
            <Spacer />
            <Actions>
                <Button
                    variant="primary"
                    size="regular"
                    onClick={() => {
                        onMsg({ type: 'on_continue_click' })
                    }}
                >
                    <FormattedMessage
                        id="keystore.write_secret_phrase.test_ps.lets_do_it"
                        defaultMessage="Let’s do it"
                    />
                </Button>
            </Actions>
        </Screen>
    )
}
