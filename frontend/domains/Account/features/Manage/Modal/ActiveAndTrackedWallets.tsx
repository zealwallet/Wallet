import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { SolidWallet } from '@zeal/uikit/Icon/SolidWallet'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const ActiveAndTrackedWallets = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                title={
                    <FormattedMessage
                        id="active_and_tracked_wallets.title"
                        defaultMessage="Active and tracked wallets"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="active_and_tracked_wallets.subtitle"
                        defaultMessage="You can only make transactions on active wallets. You can only view portfolio and activity on tracked wallets."
                    />
                }
                icon={({ size, color }) => (
                    <SolidWallet size={size} color={color} />
                )}
            />
        </Popup.Layout>
    )
}
