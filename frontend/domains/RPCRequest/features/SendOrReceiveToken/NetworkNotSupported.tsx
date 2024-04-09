import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { ClockCircled } from '@zeal/uikit/Icon/ClockCircled'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const NetworkNotSupported = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size, color }) => (
                    <ClockCircled size={size} color={color} />
                )}
                title={
                    <FormattedMessage
                        id="rpc.send_token.network_not_supported.title"
                        defaultMessage="Network coming soon"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="rpc.send_token.network_not_supported.subtitle"
                        defaultMessage="We’re working to enable transactions on this network. Thank you for your patience 🙏"
                    />
                }
            />
        </Popup.Layout>
    )
}
