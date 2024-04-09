import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Color, colors } from '@zeal/uikit/colors'
import { Extractor } from '@zeal/uikit/Extractor'
import { styles as textStyles } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

const styles = StyleSheet.create({
    base: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 2,
    },
    variant_bright: {
        backgroundColor: colors.surfaceDefault,
    },
    hover_variant_bright: {
        borderColor: colors.borderDefault,
        borderStyle: 'solid',
        borderWidth: 1,
    },
    icon_base: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon_left: {
        marginLeft: -4,
    },
    icon_right: {
        marginRight: -4,
    },
    text_variant_bright: {
        ...textStyles.variant_caption1,
        ...textStyles.weight_regular,
        ...textStyles.color_textPrimary,
    },
    disabled_variant_bright: {
        ...textStyles.color_textDisabled,
    },
})

type Variant = Extractor<keyof typeof styles, 'variant'>

type Props = {
    variant: Variant

    disabled?: boolean

    leftIcon?: (p: { size: number; color: Color }) => React.ReactNode
    rightIcon?: (p: { size: number; color: Color }) => React.ReactNode

    onClick: () => void

    children: React.ReactNode
}

type State = 'disabled' | 'pressed' | 'hovered' | 'default'

type ColorOption = `${Variant}_${State}`

const ICON_SIZE = 16

export const TagButton = ({
    children,
    variant,
    onClick,
    leftIcon,
    rightIcon,
    disabled,
}: Props) => {
    return (
        <Pressable role="button" disabled={disabled} onPress={onClick}>
            {({ pressed, hovered }) => {
                const iconColor = (() => {
                    const option: ColorOption = `${variant}_${
                        disabled
                            ? 'disabled'
                            : pressed
                            ? 'pressed'
                            : hovered
                            ? 'hovered'
                            : 'default'
                    }`

                    switch (option) {
                        case 'bright_disabled':
                            return 'iconDisabled'
                        case 'bright_pressed':
                            return 'iconHover'
                        case 'bright_hovered':
                            return 'iconHover'
                        case 'bright_default':
                            return 'iconDefault'
                        default:
                            return notReachable(option)
                    }
                })()

                return (
                    <View style={[styles.base, styles[`variant_${variant}`]]}>
                        {leftIcon && (
                            <View style={[styles.icon_base, styles.icon_left]}>
                                {leftIcon({
                                    size: ICON_SIZE,
                                    color: iconColor,
                                })}
                            </View>
                        )}

                        <Text
                            style={[
                                styles[`text_variant_${variant}`],
                                disabled &&
                                    styles[`disabled_variant_${variant}`],
                            ]}
                        >
                            {children}
                        </Text>

                        {rightIcon && (
                            <View style={[styles.icon_base, styles.icon_right]}>
                                {rightIcon({
                                    size: ICON_SIZE,
                                    color: iconColor,
                                })}
                            </View>
                        )}
                    </View>
                )
            }}
        </Pressable>
    )
}
