import React, { useEffect } from 'react'

import { Column } from '@zeal/uikit/Column'
import { ZealSplashScreenLogo } from '@zeal/uikit/Icon/ZealSplashScreenLogo'
import { Screen } from '@zeal/uikit/Screen'

import { useLiveRef } from '@zeal/toolkit'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'on_get_started' }

export const AppSplashScreen = ({ onMsg }: Props) => {
    const onMsgLive = useLiveRef(onMsg)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onMsgLive.current({
                type: 'on_get_started',
            })
        }, 1000)
        return () => clearTimeout(timeoutId)
    }, [onMsgLive])

    return (
        <Screen padding="main" background="splashScreen">
            <Column spacing={0} alignX="center" alignY="center" fill>
                <ZealSplashScreenLogo />
            </Column>
        </Screen>
    )
}
