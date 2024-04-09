import React from 'react'

import { Checkbox } from '@zeal/uikit/Icon/Checkbox'
import { NotSelected } from '@zeal/uikit/Icon/NotSelected'
import { ListItem } from '@zeal/uikit/ListItem'

import { Avatar as DAppAvatar } from '@zeal/domains/DApp/components/Avatar'
import { Connected } from '@zeal/domains/DApp/domains/ConnectionState'

type Props = {
    connection: Connected
    isSelected: boolean
    onClick: () => void
}

export type Msg = { type: 'close' }

export const ConnectedListItem = ({
    connection,
    isSelected,
    onClick,
}: Props) => {
    const { dApp } = connection
    return (
        <ListItem
            onClick={onClick}
            aria-current={false}
            size="regular"
            avatar={({ size }) => (
                <DAppAvatar size={size} dApp={connection.dApp} />
            )}
            primaryText={dApp.title || dApp.hostname}
            shortText={dApp.title ? dApp.hostname : null}
            side={{
                rightIcon: ({ size }) =>
                    isSelected ? (
                        <Checkbox size={size} color="iconAccent2" />
                    ) : (
                        <NotSelected size={size} color="iconDefault" />
                    ),
            }}
        />
    )
}
