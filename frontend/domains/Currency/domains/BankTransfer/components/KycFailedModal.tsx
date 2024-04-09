import { FormattedMessage } from 'react-intl'

import { Avatar } from '@zeal/uikit/Avatar'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { ArrowLink } from '@zeal/uikit/Icon/ArrowLink'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Popup } from '@zeal/uikit/Popup'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { openExternalURL } from '@zeal/toolkit/Window'

import { DISCORD_URL } from '@zeal/domains/Main/constants'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const KycFailedModal = ({ onMsg }: Props) => (
    <Popup.Layout onMsg={onMsg} background="surfaceDefault">
        <Column spacing={24}>
            <Header
                icon={({ size }) => (
                    <Avatar
                        size={72}
                        variant="round"
                        backgroundColor="backgroundLight"
                    >
                        <BoldDangerTriangle
                            size={size}
                            color="iconStatusCritical"
                        />
                    </Avatar>
                )}
                title={
                    <FormattedMessage
                        id="kyc.modal.failed.title"
                        defaultMessage="Identity verification failed"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="kyc.modal.failed.subtitle"
                        defaultMessage="Something went wrong. Please contact the Zeal team for support."
                    />
                }
            />
            <Popup.Actions>
                <Button
                    variant="primary"
                    onClick={() => openExternalURL(DISCORD_URL)}
                    size="regular"
                >
                    <Row spacing={6}>
                        <Text>
                            <FormattedMessage
                                id="kyc.modal.failed.button-text"
                                defaultMessage="Contact Support"
                            />
                        </Text>
                        <ArrowLink size={16} />
                    </Row>
                </Button>
            </Popup.Actions>
        </Column>
    </Popup.Layout>
)
