import { Avatar as UIAvatar } from '@zeal/uikit/Avatar'
import { CustomMetamask } from '@zeal/uikit/Icon/CustomMetamask'
import { DisconnectedOutline } from '@zeal/uikit/Icon/DisconnectedOutline'
import { IconButton } from '@zeal/uikit/IconButton'
import { TupleAvatarButton } from '@zeal/uikit/TupleAvatarButton'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { Avatar as DAppAvatar } from '@zeal/domains/DApp/components/Avatar'
import { CurrentZWidgetConnectionStateAndNetwork } from '@zeal/domains/Main'
import { NetworkMap } from '@zeal/domains/Network'
import { Avatar as NetworkAvatar } from '@zeal/domains/Network/components/Avatar'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    loadable: LoadableData<
        CurrentZWidgetConnectionStateAndNetwork | null,
        unknown
    >
    installationId: string
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_connection_manager_clicked' }
    | { type: 'on_inactive_zwidget_state_clicked' }

export const Layout = ({
    loadable,
    networkMap,
    installationId,
    onMsg,
}: Props) => {
    switch (loadable.type) {
        case 'error':
        case 'loading':
            return null

        case 'loaded': {
            if (loadable.data) {
                const { state, networkHexId } = loadable.data

                return (
                    <TupleAvatarButton
                        left={({ border, size, backgroundColor }) => {
                            switch (state.type) {
                                case 'not_interacted':
                                case 'disconnected':
                                    return (
                                        <UIAvatar
                                            size={size}
                                            border={border || undefined}
                                            backgroundColor={backgroundColor}
                                        >
                                            <DisconnectedOutline
                                                size={24}
                                                color="iconPressed"
                                            />
                                        </UIAvatar>
                                    )
                                case 'connected':
                                    return (
                                        <NetworkAvatar
                                            size={size}
                                            border={border || undefined}
                                            currentNetwork={{
                                                type: 'specific_network',
                                                network:
                                                    networkMap[networkHexId],
                                            }}
                                        />
                                    )

                                case 'connected_to_meta_mask':
                                    return (
                                        <UIAvatar
                                            size={size}
                                            border={border || undefined}
                                            backgroundColor="backgroundAlertWarning"
                                        >
                                            <CustomMetamask size={24} />
                                        </UIAvatar>
                                    )

                                default:
                                    return notReachable(state)
                            }
                        }}
                        right={({ size, backgroundColor, border }) => (
                            <DAppAvatar
                                size={size}
                                border={border || undefined}
                                backgroundColor={backgroundColor}
                                dApp={state.dApp}
                            />
                        )}
                        onClick={() =>
                            onMsg({ type: 'on_connection_manager_clicked' })
                        }
                    />
                )
            } else {
                return (
                    <IconButton
                        variant="on_light"
                        onClick={() => {
                            postUserEvent({
                                type: 'ConnectionManagerOpenInNoWeb3SiteEvent',
                                installationId,
                            })
                            return onMsg({
                                type: 'on_inactive_zwidget_state_clicked',
                            })
                        }}
                    >
                        {({ color }) => (
                            <DisconnectedOutline size={24} color={color} />
                        )}
                    </IconButton>
                )
            }
        }

        default:
            return notReachable(loadable)
    }
}
