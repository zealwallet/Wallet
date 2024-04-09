import React from 'react'
import { StyleSheet, View } from 'react-native'

import { colors } from '@zeal/uikit/colors'

export const styles = StyleSheet.create({
    caption: {
        backgroundColor: colors.surfaceDefault,
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 8,
        position: 'relative',
    },
})

type Props = {
    children?: React.ReactNode
}

export const Caption = ({ children }: Props) => {
    return <View style={styles.caption}>{children}</View>
}
