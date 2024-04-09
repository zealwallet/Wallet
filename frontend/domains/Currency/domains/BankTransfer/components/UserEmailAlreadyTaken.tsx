import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_try_with_different_wallet_clicked' }

export const UserEmailAlreadyTaken = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                title={
                    <FormattedMessage
                        id="user_email_already_exists.title"
                        defaultMessage="Transfers setup with a different wallet"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="user_email_already_exists.subtitle"
                        defaultMessage="You've already setup bank transfer with another wallet. Please try again with the wallet you used previously."
                    />
                }
            />

            <Popup.Actions>
                <Button
                    variant="primary"
                    size="regular"
                    onClick={() =>
                        onMsg({
                            type: 'on_try_with_different_wallet_clicked',
                        })
                    }
                >
                    <FormattedMessage
                        id="user_email_already_exists.try_with_another_wallet"
                        defaultMessage="Try with another wallet"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
