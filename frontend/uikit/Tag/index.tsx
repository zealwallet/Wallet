import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Extractor } from '@zeal/uikit/Extractor'

import { Color, colors } from '../colors'

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        columnGap: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 50,
        paddingVertical: 5,
        paddingHorizontal: 12,
        alignItems: 'center',
        minWidth: 0,
        justifyContent: 'center',
        flexShrink: 0,
    },

    border_borderDefault: {
        borderColor: colors.borderDefault,
    },

    border_borderFocus: {
        borderColor: colors.borderFocus,
    },

    border_borderError: {
        borderColor: colors.borderError,
    },

    border_borderSecondary: {
        borderColor: colors.borderSecondary,
    },

    border_borderTransparent: {
        borderColor: 'transparent',
    },
})

type BorderColor = Extractor<keyof typeof styles, 'border'>

type Props = {
    borderColor?: BorderColor
    children: React.ReactNode
    bg: Color
}

export const Tag = ({ borderColor, children, bg }: Props) => (
    <View
        style={[
            styles.container,
            styles[`border_${borderColor ?? 'borderTransparent'}`],
            { backgroundColor: colors[bg] },
        ]}
    >
        {children}
    </View>
)
