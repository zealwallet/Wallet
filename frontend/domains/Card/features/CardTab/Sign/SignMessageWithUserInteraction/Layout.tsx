import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { GnosisPayIcon } from '@zeal/uikit/Icon/GnosisPayIcon'
import { Screen } from '@zeal/uikit/Screen'

import { noop } from '@zeal/toolkit'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_sign_login_message_button_clicked' }

export const Layout = ({ onMsg }: Props) => {
    return (
        <Screen padding="form" background="light" onNavigateBack={noop}>
            <Column spacing={0} fill>
                <Header
                    title={
                        <FormattedMessage
                            id="cards.sign_message_with_user_interaction.layout.header"
                            defaultMessage="Sign into Gnosis Pay"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="cards.sign_message_with_user_interaction.layout.subtite"
                            defaultMessage="To access cards you’ll need to sign a message with our partner Gnosis Pay. You’re seeing this because you’re using a wallet that requires additional security steps."
                        />
                    }
                    icon={({ size }) => <GnosisPayIcon size={size} />}
                />
            </Column>
            <Actions>
                <Button
                    variant="primary"
                    size="regular"
                    onClick={() => {
                        onMsg({ type: 'on_sign_login_message_button_clicked' })
                    }}
                >
                    <FormattedMessage
                        defaultMessage="Sign in"
                        id="cards.sign_message_with_user_interaction.layout.cta"
                    />
                </Button>
            </Actions>
        </Screen>
    )
}
