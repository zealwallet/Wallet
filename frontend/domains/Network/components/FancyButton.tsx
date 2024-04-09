import React from 'react'

import { FancyButton as UIFancyButton } from '@zeal/uikit/FancyButton'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { Network } from '@zeal/domains/Network'
import { Avatar } from '@zeal/domains/Network/components/Avatar'
import { Name } from '@zeal/domains/Network/components/Name'

type Props = {
    fill?: true
    network: Network
    rounded: boolean
    onClick: null | (() => void)
}

// TODO Check with Chris if we can kill this and use TagButton instead with some special variants

const getFancyButtonColor = (
    network: Network
): React.ComponentProps<typeof UIFancyButton>['color'] => {
    switch (network.type) {
        case 'predefined':
            switch (network.name) {
                case 'Ethereum':
                case 'Arbitrum':
                case 'zkSync':
                case 'BSC':
                case 'Polygon':
                case 'PolygonZkevm':
                case 'Fantom':
                case 'Optimism':
                case 'Base':
                case 'Gnosis':
                case 'Avalanche':
                case 'Aurora':
                    return network.name
                case 'Celo':
                case 'Cronos':
                    return 'Ethereum'

                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }
        case 'custom':
        case 'testnet':
            return 'Ethereum'

        default:
            return notReachable(network)
    }
}

export const FancyButton = ({ fill, network, rounded, onClick }: Props) => {
    const currentNetwork = { type: 'specific_network' as const, network }

    return (
        <UIFancyButton
            fill={fill}
            rounded={rounded}
            color={getFancyButtonColor(network)}
            left={({ color, textVariant, textWeight }) => (
                <Row spacing={4}>
                    <Avatar currentNetwork={currentNetwork} size={12} />
                    <Text
                        color={color}
                        variant={textVariant}
                        weight={textWeight}
                    >
                        <Name currentNetwork={currentNetwork} />
                    </Text>
                </Row>
            )}
            right={
                !onClick
                    ? null
                    : ({ color }) => <LightArrowDown2 size={16} color={color} />
            }
            onClick={onClick}
        />
    )
}
