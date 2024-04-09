import React from 'react'
import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native'

import { colors } from '@zeal/uikit/colors'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: colors.backgroundOverlay,
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { cursor: 'default', outlineWidth: 0 }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },
})

type Props = {
    onClick: (event: GestureResponderEvent) => void
    children?: React.ReactNode
}

export const Overlay = ({ onClick, children }: Props) => {
    return (
        <Pressable onPress={onClick} style={[styles.container]}>
            {children}
        </Pressable>
    )
}
