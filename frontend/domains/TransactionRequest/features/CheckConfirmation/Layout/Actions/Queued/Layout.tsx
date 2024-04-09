import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'stop_clicked' } | { type: 'speed_up_clicked' }

export const Layout = ({ onMsg }: Props) => {
    return (
        <Actions>
            <Button
                size="regular"
                variant="secondary"
                onClick={() => onMsg({ type: 'stop_clicked' })}
            >
                <FormattedMessage
                    id="submitTransaction.stop"
                    defaultMessage="Stop"
                />
            </Button>

            <Button
                size="regular"
                variant="secondary"
                onClick={() => onMsg({ type: 'speed_up_clicked' })}
            >
                <FormattedMessage
                    id="submitTransaction.speedUp"
                    defaultMessage="Speed up"
                />
            </Button>
        </Actions>
    )
}
