import React from 'react'
import { StyleSheet, View } from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { Text } from '@zeal/uikit/Text'

const styles = StyleSheet.create({
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: colors.surfaceDefault,
        elevation: 5,
        shadowColor: 'rgba(8, 3, 21, 0.12)',
        shadowOffset: { width: 4, height: 8 },
        shadowRadius: 17,
    },
    toastContainer: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
})

type Props = { children: React.ReactNode }
export const Toast = ({ children }: Props) => {
    return <View style={[styles.toast]}>{children}</View>
}

export const ToastContainer = ({ children }: Props) => {
    return <View style={[styles.toastContainer]}>{children}</View>
}

export const ToastText = ({ children }: Props) => (
    <Text variant="paragraph" weight="regular" color="textSecondary">
        {children}
    </Text>
)
