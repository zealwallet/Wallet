import React from 'react'
import { FormattedMessage } from 'react-intl'

import { BridgeRoute } from '@zeal/domains/Currency/domains/Bridge'

export const HeaderTitle = () => (
    <FormattedMessage
        id="currency.bridge.bridge_status.title"
        defaultMessage="Bridge"
    />
)

export const HeaderSubtitle = ({
    bridgeRoute,
}: {
    bridgeRoute: BridgeRoute
}) => (
    <FormattedMessage
        id="currency.bridge.bridge_status.subtitle"
        defaultMessage="Using {name}"
        values={{
            name: bridgeRoute.displayName,
        }}
    />
)
