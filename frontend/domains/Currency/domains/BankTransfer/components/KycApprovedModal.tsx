import { FormattedMessage } from 'react-intl'

import { Avatar } from '@zeal/uikit/Avatar'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BoldGeneralBank } from '@zeal/uikit/Icon/BoldGeneralBank'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'on_do_bank_transfer_clicked' }
export const KycApprovedModal = ({ onMsg }: Props) => (
    <Popup.Layout onMsg={onMsg} background="surfaceDefault">
        <Column spacing={24}>
            <Header
                icon={({ size }) => (
                    <Avatar
                        size={72}
                        variant="round"
                        backgroundColor="backgroundLight"
                    >
                        <BoldGeneralBank
                            size={size}
                            color="iconStatusSuccess"
                        />
                    </Avatar>
                )}
                title={
                    <FormattedMessage
                        id="kyc.modal.approved.title"
                        defaultMessage="Bank transfers unlocked"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="kyc.modal.approved.subtitle"
                        defaultMessage="Your verification is complete you can now do limitless bank transfers."
                    />
                }
            />

            <Popup.Actions>
                <Button
                    variant="primary"
                    onClick={() =>
                        onMsg({ type: 'on_do_bank_transfer_clicked' })
                    }
                    size="regular"
                >
                    <FormattedMessage
                        id="kyc.modal.approved.button-text"
                        defaultMessage="Do bank transfer"
                    />
                </Button>
            </Popup.Actions>
        </Column>
    </Popup.Layout>
)
