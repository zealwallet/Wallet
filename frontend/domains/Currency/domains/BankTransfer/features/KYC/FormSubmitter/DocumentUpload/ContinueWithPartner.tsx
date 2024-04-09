import { FormattedMessage } from 'react-intl'

import { Avatar } from '@zeal/uikit/Avatar'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { Forward } from '@zeal/uikit/Icon/Forward'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_continue_clicked' }

export const ContinueWithPartner = ({ onMsg }: Props) => {
    return (
        <Popup.Layout
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'close':
                        onMsg({ type: 'on_continue_clicked' })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(msg.type)
                }
            }}
            background="surfaceDefault"
        >
            <Column spacing={24}>
                <Header
                    icon={({ size, color }) => (
                        <Avatar
                            size={72}
                            variant="round"
                            backgroundColor="backgroundLight"
                        >
                            <Forward size={size} color={color} />
                        </Avatar>
                    )}
                    title={
                        <FormattedMessage
                            id="kyc.modal.continue-with-partner.title"
                            defaultMessage="Continue with our partner"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="kyc.modal.continue-with-partner.subtitle"
                            defaultMessage="We’ll now forward you to our partner to collect your documentation and complete verification application."
                        />
                    }
                />
                <Popup.Actions>
                    <Button
                        variant="primary"
                        onClick={() => onMsg({ type: 'on_continue_clicked' })}
                        size="regular"
                    >
                        <FormattedMessage
                            id="kyc.modal.continue-with-partner.button-text"
                            defaultMessage="Continue"
                        />
                    </Button>
                </Popup.Actions>
            </Column>
        </Popup.Layout>
    )
}
