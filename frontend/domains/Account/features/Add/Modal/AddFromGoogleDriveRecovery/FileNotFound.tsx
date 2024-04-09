import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const FileNotFound = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size, color }) => (
                    <BoldDangerTriangle size={size} color="statusWarning" />
                )}
                title={
                    <FormattedMessage
                        id="account.add.from_recovery_kit.file_not_found"
                        defaultMessage="We couldn’t find your file"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="account.add.from_recovery_kit.file_not_found.explanation"
                        defaultMessage="Please check you logged in to the correct account that has a Zeal Backup folder"
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
                        id="account.add.from_recovery_kit.file_not_found.button_title"
                        defaultMessage="Try again"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
