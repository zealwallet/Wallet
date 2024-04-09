import { FormattedMessage } from 'react-intl'

import { Avatar } from '@zeal/uikit/Avatar'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'on_kyc_try_again_clicked' }

export const KycPausedModal = ({ onMsg }: Props) => (
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
                            color="iconStatusWarning"
                        />
                    </Avatar>
                )}
                title={
                    <FormattedMessage
                        id="kyc.modal.paused.title"
                        defaultMessage="Your details look wrong"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="kyc.modal.paused.subtitle"
                        defaultMessage="It looks like some of your information is wrong. Please try again and double-check your details before submitting."
                    />
                }
            />
            <Popup.Actions>
                <Button
                    variant="primary"
                    onClick={() => onMsg({ type: 'on_kyc_try_again_clicked' })}
                    size="regular"
                >
                    <FormattedMessage
                        id="kyc.modal.paused.button-text"
                        defaultMessage="Update details"
                    />
                </Button>
            </Popup.Actions>
        </Column>
    </Popup.Layout>
)
