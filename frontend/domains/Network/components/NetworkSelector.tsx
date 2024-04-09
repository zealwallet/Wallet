import React from 'react'

import { AvatarSize } from '@zeal/uikit/Avatar'
import { NetworkSelector as NetworkSelectorIcon } from '@zeal/uikit/Icon/NetworkSelector'
import { IconButton } from '@zeal/uikit/IconButton'

import { notReachable } from '@zeal/toolkit'

import { CurrentNetwork } from '@zeal/domains/Network'

import { Avatar } from './Avatar'

type Props = {
    currentNetwork: CurrentNetwork
    size: AvatarSize
    variant: React.ComponentProps<typeof IconButton>['variant']
    onClick: React.ComponentProps<typeof IconButton>['onClick']
}

export const NetworkSelector = ({
    currentNetwork,
    size,
    variant,
    onClick,
}: Props) => {
    return (
        <IconButton variant={variant} onClick={onClick}>
            {({ color }) => {
                switch (currentNetwork.type) {
                    case 'all_networks':
                        return <NetworkSelectorIcon size={size} color={color} />
                    case 'specific_network':
                        return (
                            <Avatar
                                currentNetwork={currentNetwork}
                                size={size}
                            />
                        )
                    /* istanbul ignore next */
                    default:
                        return notReachable(currentNetwork)
                }
            }}
        </IconButton>
    )
}
