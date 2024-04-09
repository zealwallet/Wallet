import React from 'react'
import {
    GestureResponderEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { Extractor } from '@zeal/uikit/Extractor'
import { styles as textStyles } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

declare module 'react-native' {
    interface PressableStateCallbackType {
        hovered?: boolean
        focused?: boolean
    }
}

const labelStyles = StyleSheet.create({
    base: {
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
    },
    variant_tertiary: {
        color: colors.textSecondary,
    },
    hover_variant_tertiary: {
        color: colors.textPrimary,
    },
    active_variant_tertiary: {
        color: colors.actionPrimaryPressed,
    },
    disabled_variant_tertiary: {
        color: colors.textDisabled,
    },

    variant_secondary: {
        color: colors.textPrimary,
    },
    hover_variant_secondary: {
        color: colors.textPrimary,
    },
    active_variant_secondary: {
        color: colors.textPrimary,
    },
    disabled_variant_secondary: {
        color: colors.textDisabled,
    },

    variant_primary: {
        color: colors.textOnPrimary,
    },
    hover_variant_primary: {
        color: colors.textOnPrimary,
    },
    active_variant_primary: {
        color: colors.textOnPrimary,
    },
    disabled_variant_primary: {
        color: colors.textDisabled,
    },

    variant_warning: {
        color: colors.textStatusWarningOnColor,
    },
    hover_variant_warning: {
        color: colors.textStatusWarningOnColorHover,
    },
    active_variant_warning: {
        color: colors.textStatusWarningOnColor,
    },
    disabled_variant_warning: {
        color: colors.textStatusWarningOnColorDisabled,
    },

    size_compressed: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_medium,
    },

    size_regular: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_medium,
    },

    size_small: {
        ...textStyles.variant_caption1,
        ...textStyles.weight_medium,
    },
})

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexBasis: 0,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { outlineStyle: 'none' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },
    base: {
        flexGrow: 1,
        flexBasis: 0,
        overflow: 'hidden',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'transparent',
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { cursor: 'pointer' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },
    variant_tertiary: {},
    hover_variant_tertiary: {},
    active_variant_tertiary: {},
    disabled_variant_tertiary: {
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { cursor: 'not-allowed' } as any
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },

    variant_secondary: {
        borderColor: colors.borderDefault,
        backgroundColor: colors.actionSecondaryDefault,
    },
    hover_variant_secondary: {
        borderColor: colors.actionSecondaryHovered,
        backgroundColor: colors.actionSecondaryHovered,
    },
    active_variant_secondary: {
        borderColor: colors.actionSecondaryPressed,
        backgroundColor: colors.actionSecondaryPressed,
    },
    disabled_variant_secondary: {
        borderColor: colors.actionSecondaryDisabled,
        backgroundColor: colors.actionSecondaryDisabled,
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { cursor: 'not-allowed' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },

    variant_primary: {
        backgroundColor: colors.actionPrimaryDefault,
    },
    hover_variant_primary: {
        backgroundColor: colors.actionPrimaryHovered,
    },
    active_variant_primary: {
        backgroundColor: colors.actionPrimaryPressed,
    },
    disabled_variant_primary: {
        backgroundColor: colors.actionPrimaryDisabled,
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { cursor: 'not-allowed' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },

    variant_warning: {
        backgroundColor: colors.backgroundAlertWarning,
    },
    hover_variant_warning: {
        backgroundColor: colors.backgroundAlertWarningHover,
    },
    active_variant_warning: {
        backgroundColor: colors.backgroundAlertWarningClicked,
    },
    disabled_variant_warning: {
        backgroundColor: colors.backgroundAlertWarning,
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { cursor: 'not-allowed' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },

    size_compressed: {
        height: 40,
        padding: 12,
    },

    size_regular: {
        height: 42,
        paddingVertical: 12,
        paddingHorizontal: 18,
    },

    size_small: {
        height: 31,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
})

type Props = {
    'aria-label'?: string
    variant: Extractor<keyof typeof styles, 'variant'>
    size: Extractor<keyof typeof styles, 'size'>
    disabled?: boolean
    onClick?: (e: GestureResponderEvent) => void
    children: React.ReactNode
}

export const Button = ({
    size,
    variant,
    disabled,
    onClick,
    children,
    'aria-label': ariaLabel,
}: Props) => {
    return (
        <Pressable
            style={[styles.container]}
            aria-label={ariaLabel}
            role="button"
            disabled={disabled}
            onPress={onClick}
        >
            {({ pressed, hovered }) => (
                <View
                    style={[
                        styles.base,
                        styles[`variant_${variant}`],
                        styles[`size_${size}`],
                        hovered && styles[`hover_variant_${variant}`],
                        pressed && styles[`active_variant_${variant}`],
                        disabled && styles[`disabled_variant_${variant}`],
                    ]}
                >
                    <Text
                        numberOfLines={1}
                        style={[
                            labelStyles.base,
                            labelStyles[`variant_${variant}`],
                            labelStyles[`size_${size}`],
                            hovered && labelStyles[`hover_variant_${variant}`],
                            pressed && labelStyles[`active_variant_${variant}`],
                            disabled &&
                                labelStyles[`disabled_variant_${variant}`],
                        ]}
                    >
                        {children}
                    </Text>
                </View>
            )}
        </Pressable>
    )
}
