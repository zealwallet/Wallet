import { FormattedMessage, useIntl } from 'react-intl'

import { Content } from '@zeal/uikit/Content'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { DAppSiteInfo } from '@zeal/domains/DApp'
import { SimulatedSignMessage } from '@zeal/domains/RPCRequest/domains/SignMessageSimulation'

type Props = {
    dApp: DAppSiteInfo
    simulatedSignMessage: SimulatedSignMessage
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_permit_info_icon_clicked'
}

export const Header = ({ simulatedSignMessage, dApp, onMsg }: Props) => {
    const { formatMessage } = useIntl()
    switch (simulatedSignMessage.type) {
        case 'PermitSignMessage':
        case 'DaiPermitSignMessage':
        case 'Permit2SignMessage':
            return (
                <Content.Header
                    title={
                        <Row spacing={4}>
                            <Text
                                variant="title3"
                                weight="semi_bold"
                                color="textPrimary"
                            >
                                <FormattedMessage
                                    id="simulatedTransaction.PermitSignMessage.title"
                                    defaultMessage="Permit"
                                />
                            </Text>
                            <IconButton
                                variant="on_light"
                                aria-label={formatMessage({
                                    id: 'approval.approval_info',
                                    defaultMessage: 'Permit information',
                                })}
                                onClick={() =>
                                    onMsg({
                                        type: 'on_permit_info_icon_clicked',
                                    })
                                }
                            >
                                {({ color }) => (
                                    <InfoCircle size={16} color={color} />
                                )}
                            </IconButton>
                        </Row>
                    }
                />
            )

        case 'UnknownSignMessage':
            return (
                <Content.Header
                    title={
                        <FormattedMessage
                            id="simulatedTransaction.UnknownSignMessage.title"
                            defaultMessage="Sign"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="rpc.sign.subtitle"
                            defaultMessage="For {name}"
                            values={{
                                name: dApp.title || dApp.hostname,
                            }}
                        />
                    }
                />
            )

        default:
            return notReachable(simulatedSignMessage)
    }
}
