import { FormattedMessage } from 'react-intl'

import { Avatar } from '@zeal/uikit/Avatar'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BoldId } from '@zeal/uikit/Icon/BoldId'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'on_kyc_start_verification_clicked' }

export const KycRequiredModal = ({ onMsg }: Props) => (
    <Popup.Layout onMsg={onMsg} background="surfaceDefault">
        <Column spacing={24}>
            <Header
                icon={({ size }) => (
                    <Avatar
                        size={72}
                        variant="round"
                        backgroundColor="backgroundLight"
                    >
                        <BoldId size={size} color="iconAccent2" />
                    </Avatar>
                )}
                title={
                    <FormattedMessage
                        id="kyc.modal.required.title"
                        defaultMessage="Identity verification required"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="kyc.modal.required.subtitle"
                        defaultMessage="You’ve reached the transaction limit. Please verify your identity to continue. This usually only takes a couple of minutes and requires some personal details and documentation."
                    />
                }
            />
            <Popup.Actions>
                <Button
                    variant="primary"
                    onClick={() =>
                        onMsg({ type: 'on_kyc_start_verification_clicked' })
                    }
                    size="regular"
                >
                    <FormattedMessage
                        id="kyc.modal.required.cta"
                        defaultMessage="Start verification"
                    />
                </Button>
            </Popup.Actions>
        </Column>
    </Popup.Layout>
)
