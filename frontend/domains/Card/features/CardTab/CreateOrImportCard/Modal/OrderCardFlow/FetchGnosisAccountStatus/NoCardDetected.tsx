import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BoldCrossMedium } from '@zeal/uikit/Icon/BoldCrossMedium'
import { Screen } from '@zeal/uikit/Screen'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_no_card_detected_try_different_card_click' }

export const NoCardDetected = ({ onMsg }: Props) => {
    return (
        <Screen
            padding="form"
            background="default"
            onNavigateBack={() => {
                onMsg({ type: 'on_no_card_detected_try_different_card_click' })
            }}
        >
            <Header
                icon={({ size }) => (
                    <BoldCrossMedium size={size} color="textPrimary" />
                )}
                title={
                    <FormattedMessage
                        id="card.import.no_cards_found"
                        defaultMessage="No card detected"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="card.import.no_cards_found.subtitle"
                        defaultMessage="There is no Gnosis Pay card connected to this wallet. Please check the wallet address and try again."
                    />
                }
            />
            <Column spacing={0} alignY="end" fill>
                <Actions>
                    <Button
                        variant="primary"
                        size="regular"
                        onClick={() => {
                            onMsg({
                                type: 'on_no_card_detected_try_different_card_click',
                            })
                        }}
                    >
                        <FormattedMessage
                            id="card.import.no_cards_found.cta"
                            defaultMessage="Try another wallet"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}
