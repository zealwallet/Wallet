import { useIntl } from 'react-intl'

import { Refresh } from '@zeal/uikit/Icon/Refresh'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'

import { CurrentNetwork } from '@zeal/domains/Network'
import { NetworkSelector } from '@zeal/domains/Network/components/NetworkSelector'

type Props = {
    currentNetwork: CurrentNetwork
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_refresh_button_clicked' }
    | { type: 'on_network_filter_button_clicked' }

export const RefreshAndNetworkFilter = ({ currentNetwork, onMsg }: Props) => {
    const { formatMessage } = useIntl()
    return (
        <Row spacing={0}>
            <IconButton
                variant="on_color"
                aria-label={formatMessage({
                    id: 'account.widget.refresh',
                    defaultMessage: 'Refresh',
                })}
                onClick={(e) => {
                    e.stopPropagation()
                    onMsg({ type: 'on_refresh_button_clicked' })
                }}
            >
                {({ color }) => <Refresh size={24} color={color} />}
            </IconButton>

            <NetworkSelector
                variant="on_color"
                size={24}
                currentNetwork={currentNetwork}
                onClick={(e) => {
                    e.stopPropagation()
                    onMsg({ type: 'on_network_filter_button_clicked' })
                }}
            />
        </Row>
    )
}
