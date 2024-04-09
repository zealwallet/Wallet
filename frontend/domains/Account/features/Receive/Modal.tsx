import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { GroupList } from '@zeal/uikit/GroupList'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { ListItem as NetworkListItem } from '@zeal/domains/Network/components/ListItem'
import {
    PREDEFINED_NETWORKS,
    TEST_NETWORKS,
} from '@zeal/domains/Network/constants'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'supported_networks_list' }

type Msg = { type: 'close' }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'supported_networks_list':
            return (
                <UIModal>
                    <Screen background="light" padding="form">
                        <ActionBar
                            left={
                                <IconButton
                                    variant="on_light"
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    {({ color }) => (
                                        <BackIcon size={24} color={color} />
                                    )}
                                </IconButton>
                            }
                        />
                        <Column spacing={16} shrink>
                            <Text
                                variant="title3"
                                weight="semi_bold"
                                color="textPrimary"
                            >
                                <FormattedMessage
                                    id="accountDetails.networks"
                                    defaultMessage="Networks"
                                />
                            </Text>
                            <GroupList
                                data={[
                                    ...PREDEFINED_NETWORKS,
                                    ...TEST_NETWORKS,
                                ].filter((k) => k.isZealRPCSupported)}
                                renderItem={({ item: network }) => (
                                    <NetworkListItem
                                        key={network.hexChainId}
                                        aria-current={false}
                                        network={network}
                                    />
                                )}
                            />
                        </Column>
                    </Screen>
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
