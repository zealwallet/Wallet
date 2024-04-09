import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { CloseSquare } from '@zeal/uikit/Icon/CloseSquare'
import { Popup } from '@zeal/uikit/Popup'
import { Text } from '@zeal/uikit/Text'

import { Network } from '@zeal/domains/Network'

type Props = {
    network: Network
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const SpeedUpsIsNotSupportedPopup = ({ onMsg, network }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size }) => (
                    <CloseSquare size={size} color="iconStatusCritical" />
                )}
                title={
                    <FormattedMessage
                        id="transaction.speedup_popup.not_supported.title"
                        defaultMessage="Not supported"
                    />
                }
            />
            <Text variant="callout" weight="medium" color="textPrimary">
                <FormattedMessage
                    id="transaction.speedup_popup.not_supported.subtitle"
                    defaultMessage="Transaction speed ups are not supported on {network}"
                    values={{
                        network: network.name,
                    }}
                />
            </Text>
            <Popup.Actions>
                <Button
                    variant="secondary"
                    size="regular"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="action.close"
                        defaultMessage="Close"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
