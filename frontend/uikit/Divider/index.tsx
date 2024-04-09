import React from 'react'
import { StyleSheet, View } from 'react-native'

import { colors } from '@zeal/uikit/colors'

type Props = {
    variant: 'default' | 'secondary'
}

export const styles = StyleSheet.create({
    base: {
        width: '100%',
        height: 1,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
    },

    default: {
        borderColor: 'transparent',
    },

    secondary: {
        borderColor: colors.borderSecondary,
    },
})

export const Divider = ({ variant }: Props) => {
    return <View style={[styles.base, styles[variant]]} />
}
