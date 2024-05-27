import React, { ReactNode, useEffect } from 'react'
import { BackHandler } from 'react-native'

import { BackGestureDetector } from '@zeal/uikit/GestureDetectors/BackGestureDetector'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

type Props = {
    children: ReactNode
    enableSwipeIos?: boolean
    onNavigateBack: () => void
}

export const BackNavigator = ({
    children,
    onNavigateBack,
    enableSwipeIos = true,
}: Props) => {
    const liveNavigateBack = useLiveRef(onNavigateBack)

    useEffect(() => {
        switch (ZealPlatform.OS) {
            case 'ios':
            case 'web':
                return
            case 'android': {
                const androidBackHandler = BackHandler.addEventListener(
                    'hardwareBackPress',
                    () => {
                        liveNavigateBack.current()
                        return true
                    }
                )

                return () => androidBackHandler.remove()
            }
            /* istanbul ignore next */
            default:
                return notReachable(ZealPlatform.OS)
        }
    }, [liveNavigateBack])

    switch (ZealPlatform.OS) {
        case 'ios':
            return enableSwipeIos ? (
                <BackGestureDetector onBackSwipeInvoked={onNavigateBack}>
                    {children}
                </BackGestureDetector>
            ) : (
                children
            )
        case 'android':
            return children
        case 'web':
            return children
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}
