import React, { useEffect } from 'react'

import { FontSource, loadAsync } from 'expo-font'

import { FontFamily } from '@zeal/uikit/Text'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import {
    LoadableData,
    useLoadableData,
} from '@zeal/toolkit/LoadableData/LoadableData'

type Props = {
    children: React.ReactNode
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_fonts_loading_finished'
    result: Extract<
        LoadableData<unknown, unknown>,
        { type: 'loaded' | 'error' }
    >
}

const fetchFonts = async () => {
    const fontsMap: Record<FontFamily, FontSource> = {
        'Lexend-Bold': require('@zeal/assets/fonts/Lexend-Bold.ttf'),
        'Lexend-Medium': require('@zeal/assets/fonts/Lexend-Medium.ttf'),
        'Lexend-Regular': require('@zeal/assets/fonts/Lexend-Regular.ttf'),
        'Lexend-SemiBold': require('@zeal/assets/fonts/Lexend-SemiBold.ttf'),
    }
    return loadAsync(fontsMap)
}

export const FontsLoader = ({ children, onMsg }: Props) => {
    const liveMsg = useLiveRef(onMsg)
    const [fonts] = useLoadableData(fetchFonts, {
        type: 'loading',
        params: undefined,
    })

    useEffect(() => {
        switch (fonts.type) {
            case 'loading':
                break
            case 'error':
            case 'loaded':
                liveMsg.current({
                    type: 'on_fonts_loading_finished',
                    result: fonts,
                })
                break

            default:
                notReachable(fonts)
        }
    }, [fonts, liveMsg])

    return <>{children}</>
}
