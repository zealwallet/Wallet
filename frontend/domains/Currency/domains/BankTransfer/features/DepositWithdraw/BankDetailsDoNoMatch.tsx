import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const BankDetailsDoNoMatch = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size }) => (
                    <BoldDangerTriangle size={size} color="statusWarning" />
                )}
                title={
                    <FormattedMessage
                        id="bank_details_do_not_match.title"
                        defaultMessage="Bank details don't match"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="bank_details_do_not_match.subtitle"
                        defaultMessage="The sort code and account number don’t match. Please double check that details were added correctly and try again."
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
                        id="bank_details_do_not_match.got_it"
                        defaultMessage="Got it"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
