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

type Msg = { type: 'close' } | { type: 'on_get_started_clicked' }

export const KycModal = ({ onMsg }: Props) => (
    <Popup.Layout onMsg={onMsg} background="surfaceDefault">
        <Column spacing={24}>
            <Header
                icon={({ size, color }) => (
                    <Avatar
                        size={72}
                        variant="round"
                        backgroundColor="backgroundLight"
                    >
                        <BoldId size={size} color={color} />
                    </Avatar>
                )}
                title={
                    <FormattedMessage
                        id="bank_transfers.deposit.modal.kyc.title"
                        defaultMessage="Verify your identity to increase limits"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="bank_transfers.deposit.modal.kyc.text"
                        defaultMessage="To verify your identity we’ll need some personal details and documentation. This usually only takes a couple of minutes to submit."
                    />
                }
            />
            <Popup.Actions>
                <Button
                    variant="primary"
                    onClick={() => onMsg({ type: 'on_get_started_clicked' })}
                    size="regular"
                >
                    <FormattedMessage
                        id="bank_transfers.deposit.modal.kyc.button-text"
                        defaultMessage="Get started"
                    />
                </Button>
            </Popup.Actions>
        </Column>
    </Popup.Layout>
)
