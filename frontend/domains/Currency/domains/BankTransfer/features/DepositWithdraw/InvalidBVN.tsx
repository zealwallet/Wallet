import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Popup } from '@zeal/uikit/Popup'

import {
    UnblockBvnDoesNotMatch,
    UnblockUnableToVerifyBVN,
} from '@zeal/domains/Error'

type Props = {
    error: UnblockBvnDoesNotMatch | UnblockUnableToVerifyBVN
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const InvalidBVN = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size }) => (
                    <BoldDangerTriangle size={size} color="statusWarning" />
                )}
                title={
                    <FormattedMessage
                        id="invalid_bvn.title"
                        defaultMessage="BVN doesn’t match"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="invalid_bvn.subtitle"
                        defaultMessage="Please review to make sure it’s correct and it matches your personal details."
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
                        id="invalid_bvn.got_it"
                        defaultMessage="Got it"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
