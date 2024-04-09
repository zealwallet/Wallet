import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const InvalidIBAN = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size }) => (
                    <BoldDangerTriangle size={size} color="statusWarning" />
                )}
                title={
                    <FormattedMessage
                        id="invalid_iban.title"
                        defaultMessage="Invalid IBAN"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="invalid_iban.subtitle"
                        defaultMessage="The IBAN entered is not valid. Please double check that details were added correctly and try again."
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
                        id="invalid_iban.got_it"
                        defaultMessage="Got it"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
