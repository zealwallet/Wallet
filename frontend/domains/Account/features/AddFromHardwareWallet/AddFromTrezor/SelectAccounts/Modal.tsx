import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'hardware_wallet_tips' }

type Msg = { type: 'close' }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'hardware_wallet_tips':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        title={
                            <FormattedMessage
                                id="AddFromTrezor.hwWalletTip.title"
                                defaultMessage="Importing from Hardware Wallets"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="AddFromTrezor.hwWalletTip.subtitle"
                                defaultMessage="A hardware wallet holds millions of wallets with different addresses. You can import as many wallets as you need now or add more later."
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() => onMsg({ type: 'close' })}
                        >
                            <FormattedMessage
                                id="actions.continue"
                                defaultMessage="Continue"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
