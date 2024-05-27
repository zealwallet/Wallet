import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { JumperLogo } from '@zeal/uikit/Icon/JumperLogo'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { noop } from '@zeal/toolkit'
import { openExternalURL } from '@zeal/toolkit/Window'

import { GnosisPayAccountOnboardedState } from '@zeal/domains/Card'
import { getCardTokenFromBalance } from '@zeal/domains/Card/helpers/getCardTokenFromBalance'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    onMsg: (msg: Msg) => void
    installationId: string
    gnosisPayAccountOnboardedState: GnosisPayAccountOnboardedState
}

type Msg = { type: 'close' }

export const CardAddCash = ({
    gnosisPayAccountOnboardedState,
    installationId,
    onMsg,
}: Props) => {
    const safeCardAddress = gnosisPayAccountOnboardedState.card.safeAddress
    const toToken = getCardTokenFromBalance(
        gnosisPayAccountOnboardedState.card.balance
    )

    return (
        <Screen padding="form" background="light" onNavigateBack={noop}>
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />
            <Column spacing={0} fill>
                <Header
                    title={
                        <FormattedMessage
                            id="cards.add-cash.layout.header"
                            defaultMessage="Top up your card with Jumper"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="cards.add-cash.layout.subtite"
                            defaultMessage="Jumper allows you to bridge and swap from most tokens and networks into tokens on Gnosis Chain that you can spend with your card"
                        />
                    }
                    icon={({ size }) => <JumperLogo size={size} />}
                />
            </Column>
            <Actions>
                <Button
                    variant="secondary"
                    size="regular"
                    onClick={() => {
                        onMsg({ type: 'close' })
                    }}
                >
                    <FormattedMessage
                        defaultMessage="Cancel"
                        id="actions.cancel"
                    />
                </Button>
                <Button
                    variant="primary"
                    size="regular"
                    onClick={() => {
                        postUserEvent({
                            type: 'ClickJumperButtonEvent',
                            installationId,
                        })
                        openExternalURL(
                            `https://jumper.exchange/?toAddress=${safeCardAddress}&toChain=100&toToken=${toToken}`
                        )
                    }}
                >
                    <Row spacing={6}>
                        <Text>
                            <FormattedMessage
                                defaultMessage="Jumper"
                                id="cards.add-cash.layout.cta.primary"
                            />
                        </Text>
                        <ExternalLink size={20} />
                    </Row>
                </Button>
            </Actions>
        </Screen>
    )
}
