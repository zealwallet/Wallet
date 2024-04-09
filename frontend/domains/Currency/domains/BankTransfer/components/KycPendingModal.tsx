import { FormattedMessage } from 'react-intl'

import { Avatar } from '@zeal/uikit/Avatar'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { Clock } from '@zeal/uikit/Icon/Clock'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const KycPendingModal = ({ onMsg }: Props) => (
    <Popup.Layout onMsg={onMsg} background="surfaceDefault">
        <Column spacing={24}>
            <Header
                icon={({ size, color }) => (
                    <Avatar
                        size={72}
                        variant="round"
                        backgroundColor="backgroundLight"
                    >
                        <Clock size={size} color={color} />
                    </Avatar>
                )}
                title={
                    <FormattedMessage
                        id="kyc.modal.pending.title"
                        defaultMessage="We'll keep you updated"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="kyc.modal.pending.subtitle"
                        defaultMessage="Verification normally takes less than 10 minutes to complete, but sometimes it can take a bit longer."
                    />
                }
            />

            <Popup.Actions>
                <Button
                    variant="primary"
                    onClick={() => onMsg({ type: 'close' })}
                    size="regular"
                >
                    <FormattedMessage
                        id="kyc.modal.pending.button-text"
                        defaultMessage="Close"
                    />
                </Button>
            </Popup.Actions>
        </Column>
    </Popup.Layout>
)
