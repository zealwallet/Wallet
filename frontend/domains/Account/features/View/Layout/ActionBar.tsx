import { ExpandOutline } from '@zeal/uikit/Icon/ExpandOutline'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Manager } from '@zeal/domains/DApp/domains/ConnectionState/features/Manager'
import { Mode } from '@zeal/domains/Main'
import { NetworkMap } from '@zeal/domains/Network'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    mode: Mode
    installationId: string
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_open_fullscreen_view_click' } | MsgOf<typeof Manager>

export const ActionBar = ({
    mode,
    networkMap,
    installationId,
    onMsg,
}: Props) => {
    switch (mode) {
        case 'fullscreen':
            return null
        case 'popup':
            return (
                <Row spacing={4}>
                    <IconButton
                        variant="on_light"
                        onClick={() => {
                            postUserEvent({
                                type: 'ExpandedViewEnteredEvent',
                                location: 'portfolio',
                                installationId,
                            })
                            return onMsg({
                                type: 'on_open_fullscreen_view_click',
                            })
                        }}
                    >
                        {({ color }) => (
                            <ExpandOutline size={24} color={color} />
                        )}
                    </IconButton>
                    <Spacer />
                    <Manager
                        installationId={installationId}
                        networkMap={networkMap}
                        onMsg={onMsg}
                    />
                </Row>
            )

        default:
            return notReachable(mode)
    }
}
