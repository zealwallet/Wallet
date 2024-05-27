import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors } from '@zeal/uikit/colors'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

const styles = StyleSheet.create({
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingLeft: 12,
        paddingRight: 16,
        borderRadius: 24,
        backgroundColor: colors.backgroundDark,
    },
    toastContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 64,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
})

type ToastContainerProps = {
    children: React.ReactNode
}

type ToastProps = {
    children: React.ReactNode
}

type ToastTextProps = {
    children: React.ReactNode
}

export const ToastContainer = ({ children }: ToastContainerProps) => {
    const originalInsent = useSafeAreaInsets()
    const insent = (() => {
        switch (ZealPlatform.OS) {
            case 'web':
                return {
                    bottom: 80,
                }
            case 'ios':
                return {
                    bottom: originalInsent.bottom + 64,
                }
            case 'android':
                return {
                    bottom: originalInsent.bottom + 72,
                }
            /* istanbul ignore next */
            default:
                return notReachable(ZealPlatform.OS)
        }
    })()

    return <View style={[styles.toastContainer, insent]}>{children}</View>
}

export const Toast = ({ children }: ToastProps) => {
    return <View style={styles.toast}>{children}</View>
}

export const ToastText = ({ children }: ToastTextProps) => (
    <Text variant="paragraph" weight="regular" color="textOnDarkPrimary">
        {children}
    </Text>
)
