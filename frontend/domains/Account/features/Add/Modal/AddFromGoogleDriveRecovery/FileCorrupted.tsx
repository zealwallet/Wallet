import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const FileCorrupted = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size }) => (
                    <BoldDangerTriangle size={size} color="statusWarning" />
                )}
                title={
                    <FormattedMessage
                        id="account.add.from_recovery_kit.file_not_valid"
                        defaultMessage="Recovery File is not valid"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="account.add.from_recovery_kit.file_not_valid.explanation"
                        defaultMessage="We checked your file and either it’s not the right type or it has been modified"
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
