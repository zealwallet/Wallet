import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { Rocket } from '@zeal/uikit/Icon/Rocket'
import { Popup } from '@zeal/uikit/Popup'
import { Row } from '@zeal/uikit/Row'
import { Skeleton as UISkeleton } from '@zeal/uikit/Skeleton'
import { Text } from '@zeal/uikit/Text'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const Skeleton = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size, color }) => <Rocket size={size} color={color} />}
                title={
                    <FormattedMessage
                        id="transaction.speed_up_popup.title"
                        defaultMessage="Speed up transaction?"
                    />
                }
            />
            <Column spacing={12}>
                <Row spacing={0} alignX="stretch" alignY="center">
                    <Text variant="callout" weight="medium" color="textPrimary">
                        <FormattedMessage
                            id="transaction.speed_up_popup.seed_up_fee_title"
                            defaultMessage="Network speed up fee"
                        />
                    </Text>

                    <UISkeleton variant="default" height={12} width={48} />
                </Row>
                <Column spacing={8}>
                    <UISkeleton variant="default" height={12} width="85%" />
                    <UISkeleton variant="default" height={12} width="75%" />
                    <UISkeleton variant="default" height={12} width="65%" />
                </Column>
            </Column>
            <Popup.Actions>
                <Button
                    variant="secondary"
                    size="regular"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="transaction.cancel_popup.cancel"
                        defaultMessage="No, wait"
                    />
                </Button>

                <Button variant="primary" size="regular" disabled>
                    <FormattedMessage
                        id="transaction.speed_up_popup.confirm"
                        defaultMessage="Yes, speed up"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
