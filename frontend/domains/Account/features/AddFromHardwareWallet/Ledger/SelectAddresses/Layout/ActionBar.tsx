import React from 'react'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const ActionBar = ({ onMsg }: Props) => {
    return (
        <UIActionBar
            left={
                <IconButton
                    variant="on_light"
                    onClick={() => {
                        onMsg({ type: 'close' })
                    }}
                >
                    {({ color }) => <BackIcon size={24} color={color} />}
                </IconButton>
            }
        />
    )
}
