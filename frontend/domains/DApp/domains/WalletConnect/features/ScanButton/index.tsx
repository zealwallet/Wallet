import { LightScan } from '@zeal/uikit/Icon/LightScan'
import { IconButton } from '@zeal/uikit/IconButton'

import { noop, notReachable } from '@zeal/toolkit'

import { WalletConnectInstanceLoadable } from '@zeal/domains/DApp/domains/WalletConnect/api/fetchWalletConnectInstance'

import { Flow } from './Flow'

type Props = {
    walletConnectInstanceLoadable: WalletConnectInstanceLoadable
}

export const ScanButton = ({ walletConnectInstanceLoadable }: Props) => {
    switch (walletConnectInstanceLoadable.type) {
        case 'loading':
        case 'error':
            return (
                <IconButton variant="on_color" onClick={noop} disabled>
                    {({ color }) => <LightScan size={24} color={color} />}
                </IconButton>
            )

        case 'loaded':
            switch (walletConnectInstanceLoadable.data.type) {
                case 'not_available':
                    return null

                case 'available':
                    return (
                        <Flow
                            walletConnectInstance={
                                walletConnectInstanceLoadable.data
                                    .walletConnectInstance
                            }
                        />
                    )

                default:
                    return notReachable(walletConnectInstanceLoadable.data)
            }

        default:
            notReachable(walletConnectInstanceLoadable)
    }
}
