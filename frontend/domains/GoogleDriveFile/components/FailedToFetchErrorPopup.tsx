import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const FailedToFetchErrorPopup = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size }) => (
                    <BoldDangerTriangle size={size} color="statusWarning" />
                )}
                title={
                    <FormattedMessage
                        id="google_file.error.filed_to_fetch_auth_token.title"
                        defaultMessage="We couldn’t get access"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="google_file.error.filed_to_fetch_auth_token.subtitle"
                        defaultMessage="To allow us to use your Recovery File, please grant access on your personal cloud."
                    />
                }
            />
            <Popup.Actions>
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() => {
                        onMsg({ type: 'close' })
                    }}
                >
                    <FormattedMessage
                        id="google_file.error.filed_to_fetch_auth_token.button_title"
                        defaultMessage="Try again"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
