import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CardWidget as UICardWidget } from '@zeal/uikit/CardWidget'
import { Column } from '@zeal/uikit/Column'
import { Flip, Side as UISide } from '@zeal/uikit/Flip'
import { Setting } from '@zeal/uikit/Icon/Setting'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { Card } from '@zeal/domains/Card'
import { CopyDetailsButton } from '@zeal/domains/Card/components/CopyDetailsButton'
import { formatCardNumber } from '@zeal/domains/Card/helpers/formatCardNumber'
import { FormattedFiatCurrency2 } from '@zeal/domains/Money/components/FormattedFiatCurrency'

type Props = {
    side: Side
    card: Card
    onMsg: (msg: Msg) => void
}

export type Side = UISide

type Msg = { type: 'on_card_settings_clicked' }

export const CardWidget = ({ card, side, onMsg }: Props) => {
    const front = (
        <UICardWidget side="front">
            <Column spacing={0} alignX="end" alignY="start">
                <IconButton
                    variant="on_color"
                    onClick={() => {
                        onMsg({ type: 'on_card_settings_clicked' })
                    }}
                >
                    {() => <Setting size={24} color="textOnDark" />}
                </IconButton>
            </Column>
            <Column spacing={0} alignX="start" alignY="start" fill>
                <Text
                    variant="homeScreenTitle"
                    color="textOnDarkPrimary"
                    weight="regular"
                >
                    <FormattedFiatCurrency2
                        money={card.balance}
                        minimumFractionDigits={0}
                    />
                </Text>
            </Column>
            <Row spacing={0}>
                {card.details?.pan && (
                    <Text
                        color="darkActionSecondaryDefault"
                        variant="callout"
                        weight="regular"
                    >
                        {formatCardNumber(card.details?.pan)}
                    </Text>
                )}
            </Row>
        </UICardWidget>
    )
    const back = (
        <UICardWidget side="back">
            <Column spacing={0} alignX="end" alignY="start">
                <IconButton
                    variant="on_color"
                    onClick={() => {
                        onMsg({ type: 'on_card_settings_clicked' })
                    }}
                >
                    {() => <Setting size={24} color="textOnDark" />}
                </IconButton>
            </Column>
            <Column fill spacing={0} alignX="start" alignY="end">
                <Column spacing={12}>
                    <Column spacing={0}>
                        <Text
                            variant="footnote"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="cards.card_number"
                                defaultMessage="Card number"
                            />
                        </Text>
                        <CopyDetailsButton card={card} />
                    </Column>
                    <Row shrink spacing={8}>
                        <Column shrink spacing={0}>
                            <Text
                                variant="footnote"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="cards.card_exp_date"
                                    defaultMessage="Expiry date"
                                />
                            </Text>
                            <Text
                                color="darkActionSecondaryDefault"
                                variant="footnote"
                                weight="regular"
                            >
                                {card.details?.expiryMonth}/
                                {card.details?.expiryYear}
                            </Text>
                        </Column>

                        <Column shrink spacing={0}>
                            <Text
                                variant="footnote"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="cards.card_exp_date"
                                    defaultMessage="CVV"
                                />
                            </Text>
                            <Text
                                color="darkActionSecondaryDefault"
                                variant="footnote"
                                weight="regular"
                            >
                                {card.details?.cvv}
                            </Text>
                        </Column>
                    </Row>
                </Column>
            </Column>
        </UICardWidget>
    )
    return <Flip side={side} front={front} back={back} />
}
