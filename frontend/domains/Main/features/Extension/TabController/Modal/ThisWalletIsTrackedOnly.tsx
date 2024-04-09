import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'on_add_active_wallet_clicked' }

export const ThisWalletIsTrackedOnly = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                title={
                    <FormattedMessage
                        id="tracked_only_wallet.title"
                        defaultMessage="This wallet is tracked only"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="tracked_only_wallet.subtitle"
                        defaultMessage="You can only track portfolio and activity. To make transactions, add an active wallet."
                    />
                }
                icon={({ size, color }) => (
                    <BoldEye size={size} color={color} />
                )}
            />
            <Popup.Actions>
                <Button
                    variant="primary"
                    size="regular"
                    onClick={() =>
                        onMsg({ type: 'on_add_active_wallet_clicked' })
                    }
                >
                    <FormattedMessage
                        id="tracked_only_wallet.add_active_wallet"
                        defaultMessage="Add active wallet"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
