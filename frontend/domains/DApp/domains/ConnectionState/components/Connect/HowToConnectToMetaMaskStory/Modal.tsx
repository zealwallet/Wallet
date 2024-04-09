import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { Bridge } from '@zeal/uikit/Icon/Bridge'
import { ShieldDone } from '@zeal/uikit/Icon/ShieldDone'
import { Popup } from '@zeal/uikit/Popup'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'show_why_switch' }

export type Msg = { type: 'close' }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'show_why_switch':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        title={
                            <FormattedMessage
                                id="how_to_connect_to_metamask.why_switch"
                                defaultMessage="Why switch between Zeal and other wallets?"
                            />
                        }
                    />

                    <Popup.Content>
                        <Column spacing={20}>
                            <Row spacing={12} alignY="start">
                                <Bridge size={24} color="textPrimary" />
                                <Text
                                    variant="callout"
                                    weight="regular"
                                    color="textPrimary"
                                >
                                    <FormattedMessage
                                        id="how_to_connect_to_metamask.why_switch.description"
                                        defaultMessage="We know its hard to take the leap and start using a new wallet. So we made it easy to use Zeal alongside your existing wallet. Switch anytime."
                                    />
                                </Text>
                            </Row>
                            <Row spacing={12} alignY="start">
                                <ShieldDone size={24} color="textPrimary" />
                                <Text
                                    variant="callout"
                                    weight="regular"
                                    color="textPrimary"
                                >
                                    <FormattedMessage
                                        id="how_to_connect_to_metamask.why_switch.description"
                                        defaultMessage="No matter which wallet you choose, you’ll always get Zeals Safety Checks protecting you from malicious sites and transactions."
                                    />
                                </Text>
                            </Row>
                        </Column>
                    </Popup.Content>

                    <Popup.Actions>
                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() => {
                                onMsg({ type: 'close' })
                            }}
                        >
                            <FormattedMessage
                                id="how_to_connect_to_metamask.got_it"
                                defaultMessage="OK, got it"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )
        default:
            return notReachable(state)
    }
}
