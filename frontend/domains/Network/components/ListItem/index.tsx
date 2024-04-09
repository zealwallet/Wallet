import React from 'react'

import { ListItem as UIListItem } from '@zeal/uikit/ListItem'

import { Network } from '@zeal/domains/Network'
import { Avatar } from '@zeal/domains/Network/components/Avatar'
import { Name } from '@zeal/domains/Network/components/Name'

type Props = {
    network: Network
    onClick?: () => void
    'aria-current': boolean
    fullHeight?: boolean
}

export const ListItem = ({
    'aria-current': selected,
    network,
    onClick,
}: Props) => {
    const currentNetwork = { type: 'specific_network' as const, network }
    return (
        <UIListItem
            onClick={onClick}
            aria-current={selected}
            size="regular"
            avatar={({ size }) => (
                <Avatar currentNetwork={currentNetwork} size={size} />
            )}
            primaryText={<Name currentNetwork={currentNetwork} />}
        />
    )
}
