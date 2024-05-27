import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Screen } from '@zeal/uikit/Screen'

import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    onMsg: (msg: Msg) => void
    installationId: string
}

type Msg =
    | { type: 'on_order_new_card_clicked' }
    | { type: 'on_order_import_card_clicked' }

export const Layout = ({ onMsg, installationId }: Props) => (
    <Screen
        padding="controller_tabs_fullscreen"
        background="cardsArtwork"
        onNavigateBack={null}
    >
        <Column spacing={0} alignY="end" fill>
            <Actions variant="column">
                <Button
                    variant="primary"
                    size="regular"
                    onClick={() => {
                        postUserEvent({
                            installationId: installationId,
                            type: 'CardOrderFlowEnteredEvent',
                            state: 'new',
                        })
                        onMsg({ type: 'on_order_new_card_clicked' })
                    }}
                >
                    <FormattedMessage
                        id="card.page.order_card_button"
                        defaultMessage="Order new Gnosis Pay Card"
                    />
                </Button>
                <Button
                    variant="secondary"
                    size="regular"
                    onClick={() => {
                        postUserEvent({
                            installationId: installationId,
                            type: 'CardOrderFlowEnteredEvent',
                            state: 'existing',
                        })
                        onMsg({ type: 'on_order_import_card_clicked' })
                    }}
                >
                    <FormattedMessage
                        id="card.page.import_card_button"
                        defaultMessage="Import existing Gnosis Pay Card"
                    />
                </Button>
            </Actions>
        </Column>
    </Screen>
)
