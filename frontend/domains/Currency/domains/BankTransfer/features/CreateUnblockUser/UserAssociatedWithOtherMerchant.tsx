import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const UserAssociatedWithOtherMerchant = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                title={
                    <FormattedMessage
                        id="user_associated_with_other_merchant.title"
                        defaultMessage="Wallet cannot be used"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="user_associated_with_other_merchant.subtitle"
                        defaultMessage="This wallet cannot be used for bank transfers. Please use another wallet or report on our Discord for support and updates."
                    />
                }
            />

            <Popup.Actions>
                <Button
                    variant="primary"
                    size="regular"
                    onClick={() =>
                        onMsg({
                            type: 'close',
                        })
                    }
                >
                    <FormattedMessage
                        id="user_associated_with_other_merchant.try_with_another_wallet"
                        defaultMessage="Try with another wallet"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
