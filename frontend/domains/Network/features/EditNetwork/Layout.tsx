import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { BoldNetwork } from '@zeal/uikit/Icon/BoldNetwork'
import { Checkbox } from '@zeal/uikit/Icon/Checkbox'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { LightEdit } from '@zeal/uikit/Icon/LightEdit'
import { NotSelected } from '@zeal/uikit/Icon/NotSelected'
import { SolidInterfacePlus } from '@zeal/uikit/Icon/SolidInterfacePlus'
import { SolidZeal } from '@zeal/uikit/Icon/SolidZeal'
import { ListItem as UIListItem } from '@zeal/uikit/ListItem'
import { Popup } from '@zeal/uikit/Popup'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import {
    CustomNetwork,
    Network,
    NetworkRPC,
    NetworkRPCMap,
    PredefinedNetwork,
    TestNetwork,
} from '@zeal/domains/Network'
import { ListItem } from '@zeal/domains/Network/components/ListItem'
import { getNetworkRPC } from '@zeal/domains/Network/helpers/getNetworkRPC'

export type Props = {
    network: Network
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_predefined_network_info_click' }
    | { type: 'on_add_custom_rpc_click' }
    | { type: 'on_edit_custom_rpc_click'; rpcUrl: string }
    | { type: 'on_select_rpc_click'; network: Network; networkRPC: NetworkRPC }

export const Layout = ({ network, networkRPCMap, onMsg }: Props) => {
    const networkRPC = getNetworkRPC({ network, networkRPCMap })

    return (
        <Popup.Layout onMsg={onMsg}>
            <Column spacing={12}>
                <Group variant="default">
                    <ListItem
                        fullHeight
                        aria-current={false}
                        network={network}
                    />
                </Group>

                <Column spacing={8}>
                    <GroupHeader
                        left={({ color, textVariant, textWeight }) => (
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedMessage
                                    id="editNetwork.networkRPC"
                                    defaultMessage="Network RPC"
                                />
                            </Text>
                        )}
                        right={null}
                    />

                    <Group variant="default">
                        {(() => {
                            switch (network.type) {
                                case 'predefined':
                                case 'testnet':
                                    return (
                                        <PredefinedNetworkDefaultRPC
                                            network={network}
                                            networkRPC={networkRPC}
                                            onMsg={onMsg}
                                        />
                                    )

                                case 'custom':
                                    return (
                                        <CustomNetworkDefaultRPC
                                            network={network}
                                            networkRPC={networkRPC}
                                            onMsg={onMsg}
                                        />
                                    )

                                default:
                                    return notReachable(network)
                            }
                        })()}
                    </Group>

                    <Group variant="default">
                        {networkRPC.available.length === 0 ? (
                            <UIListItem
                                onClick={() => {
                                    onMsg({
                                        type: 'on_add_custom_rpc_click',
                                    })
                                }}
                                aria-current={false}
                                size="regular"
                                avatar={({ size }) => (
                                    <SolidInterfacePlus
                                        size={size}
                                        color="iconDefault"
                                    />
                                )}
                                primaryText={
                                    <Text
                                        variant="paragraph"
                                        weight="regular"
                                        color="textSecondary"
                                    >
                                        <FormattedMessage
                                            id="editNetwork.addCustomRPC"
                                            defaultMessage="Add custom RPC node"
                                        />
                                    </Text>
                                }
                            />
                        ) : (
                            networkRPC.available.map((url) => (
                                <CustomRPC
                                    key={url}
                                    network={network}
                                    networkRPC={networkRPC}
                                    url={url}
                                    onMsg={onMsg}
                                />
                            ))
                        )}
                    </Group>
                </Column>
            </Column>
        </Popup.Layout>
    )
}

export const PredefinedNetworkDefaultRPC = ({
    network,
    networkRPC,
    onMsg,
}: {
    network: PredefinedNetwork | TestNetwork
    networkRPC: NetworkRPC
    onMsg: (msg: Msg) => void
}) => {
    const isSelected = (() => {
        switch (networkRPC.current.type) {
            case 'default':
                return true
            case 'custom':
                return false
            default:
                return notReachable(networkRPC.current)
        }
    })()

    return (
        <UIListItem
            // fullHeight
            onClick={() => {
                onMsg({
                    type: 'on_select_rpc_click',
                    network,
                    networkRPC: {
                        current: {
                            type: 'default',
                        },
                        available: networkRPC.available,
                    },
                })
            }}
            aria-current={isSelected}
            size="regular"
            avatar={({ size }) => <SolidZeal size={size} />}
            primaryText={
                <FormattedMessage
                    id="editNetwork.zealRPCNode"
                    defaultMessage="Zeal RPC Node"
                />
            }
            primaryTextIcon={({ size }) => (
                <Tertiary
                    color="on_light"
                    size="regular"
                    onClick={(ev) => {
                        ev.stopPropagation()
                        onMsg({
                            type: 'on_predefined_network_info_click',
                        })
                    }}
                >
                    {({ color }) => <InfoCircle size={size} color={color} />}
                </Tertiary>
            )}
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

export const CustomNetworkDefaultRPC = ({
    network,
    networkRPC,
    onMsg,
}: {
    network: CustomNetwork
    networkRPC: NetworkRPC
    onMsg: (msg: Msg) => void
}) => {
    const isSelected = (() => {
        switch (networkRPC.current.type) {
            case 'default':
                return true
            case 'custom':
                return false
            default:
                return notReachable(networkRPC.current)
        }
    })()

    return (
        <UIListItem
            onClick={() => {
                onMsg({
                    type: 'on_select_rpc_click',
                    network,
                    networkRPC: {
                        current: {
                            type: 'default',
                        },
                        available: networkRPC.available,
                    },
                })
            }}
            aria-current={isSelected}
            size="regular"
            avatar={({ size }) => (
                <BoldNetwork size={size} color="iconAccent2" />
            )}
            primaryText={
                <FormattedMessage
                    id="editNetwork.defaultRPC"
                    defaultMessage="Default RPC"
                />
            }
            shortText={network.rpcUrl}
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

export const CustomRPC = ({
    network,
    networkRPC,
    url,
    onMsg,
}: {
    network: Network
    networkRPC: NetworkRPC
    url: string
    onMsg: (msg: Msg) => void
}) => {
    const isSelected = (() => {
        switch (networkRPC.current.type) {
            case 'default':
                return false
            case 'custom':
                return networkRPC.current.url === url
            default:
                return notReachable(networkRPC.current)
        }
    })()

    return (
        <UIListItem
            onClick={() => {
                onMsg({
                    type: 'on_select_rpc_click',
                    network,
                    networkRPC: {
                        current: {
                            type: 'custom',
                            url,
                        },
                        available: networkRPC.available,
                    },
                })
            }}
            aria-current={isSelected}
            size="regular"
            avatar={({ size }) => (
                <BoldNetwork size={size} color="iconAccent2" />
            )}
            primaryText={
                <FormattedMessage
                    id="editNetwork.customRPCNode"
                    defaultMessage="Custom RPC node"
                />
            }
            primaryTextIcon={({ size }) => (
                <Tertiary
                    color="on_light"
                    size="regular"
                    onClick={(ev) => {
                        ev.stopPropagation()
                        onMsg({
                            type: 'on_edit_custom_rpc_click',
                            rpcUrl: url,
                        })
                    }}
                >
                    {({ color }) => <LightEdit size={size} color={color} />}
                </Tertiary>
            )}
            shortText={url}
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
