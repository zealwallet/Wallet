import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { ListItemButton } from '@zeal/uikit/ListItem'

import { Network } from '@zeal/domains/Network'
import { Avatar } from '@zeal/domains/Network/components/Avatar'
import { Name } from '@zeal/domains/Network/components/Name'

type Props = {
    network: Network
    onClick: () => void
}

export type Msg = { type: 'close' }

export const InputButton = ({ network, onClick }: Props) => {
    return (
        <ListItemButton
            onClick={onClick}
            avatar={({ size }) => (
                <Avatar
                    currentNetwork={{
                        type: 'specific_network',
                        network: network,
                    }}
                    size={size}
                />
            )}
            primaryText={
                <Name
                    currentNetwork={{
                        type: 'specific_network',
                        network: network,
                    }}
                />
            }
            side={{
                rightIcon: ({ size }) => (
                    <LightArrowDown2 size={size} color="iconDefault" />
                ),
            }}
        />
    )
}
