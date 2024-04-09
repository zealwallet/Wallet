import { FormattedMessage } from 'react-intl'

import { Avatar } from '@zeal/uikit/Avatar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { ChainList } from '@zeal/uikit/Icon/ChainList'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { ListItem } from '@zeal/uikit/ListItem'
import { Popup } from '@zeal/uikit/Popup'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { openExternalURL } from '@zeal/toolkit/Window'

import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { EditNetwork } from '@zeal/domains/Network/features/EditNetwork'

type Props = {
    networkRPCMap: NetworkRPCMap
    state: State
    onMsg: (msg: Msg) => void
}

const CHAIN_LIST_URL = 'https://chainlist.org/'

export type State =
    | { type: 'closed' }
    | { type: 'add_network_tips' }
    | { type: 'edit_network_details'; network: Network }

type Msg = { type: 'close' } | MsgOf<typeof EditNetwork>

export const Modal = ({ networkRPCMap, state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'add_network_tips':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        title={
                            <FormattedMessage
                                id="networks.filter.add_modal.add_networks"
                                defaultMessage="Add networks"
                            />
                        }
                    />

                    <Column spacing={16}>
                        <Group variant="default">
                            <ListItem
                                onClick={() => openExternalURL(CHAIN_LIST_URL)}
                                aria-current={false}
                                size="regular"
                                avatar={({ size }) => (
                                    <Avatar
                                        backgroundColor="surfaceDefault"
                                        size={size}
                                    >
                                        <ChainList size={size} />
                                    </Avatar>
                                )}
                                primaryText={
                                    <FormattedMessage
                                        id="networks.filter.add_modal.chain_list.title"
                                        defaultMessage="Go to Chainlist"
                                    />
                                }
                                shortText={
                                    <FormattedMessage
                                        id="networks.filter.add_modal.chain_list.subtitle"
                                        defaultMessage="Add any EVM networks"
                                    />
                                }
                                side={{
                                    rightIcon: ({ size }) => (
                                        <ExternalLink
                                            size={size}
                                            color="iconDefault"
                                        />
                                    ),
                                }}
                            />
                        </Group>

                        <Group variant="default">
                            <Column spacing={8}>
                                <Text
                                    color="textPrimary"
                                    weight="regular"
                                    variant="paragraph"
                                >
                                    <FormattedMessage
                                        id="networks.filter.add_modal.dapp_tip.title"
                                        defaultMessage="Or add a network from any dApp"
                                    />
                                </Text>

                                <Text
                                    color="textSecondary"
                                    weight="regular"
                                    variant="paragraph"
                                >
                                    <FormattedMessage
                                        id="networks.filter.add_modal.dapp_tip.subtitle"
                                        defaultMessage="In your favourite dApps, simply switch to the EVM network you want to use and Zeal will ask you if you want to add it to your wallet."
                                    />
                                </Text>
                            </Column>
                        </Group>
                    </Column>
                </Popup.Layout>
            )

        case 'edit_network_details':
            return (
                <EditNetwork
                    network={state.network}
                    networkRPCMap={networkRPCMap}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
