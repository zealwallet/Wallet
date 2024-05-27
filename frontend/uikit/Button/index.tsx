import React from 'react'
import {
    GestureResponderEvent,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { Text, TextStyles } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

declare module 'react-native' {
    interface PressableStateCallbackType {
        hovered?: boolean
        focused?: boolean
    }
}

type State = 'idle' | 'hover' | 'pressed' | 'disabled'
type Variant = 'primary' | 'secondary' | 'warning' | 'tertiary'
type Size = 'compressed' | 'regular' | 'small'

const getTextStyles = ({
    size,
    state,
    variant,
}: {
    state: State
    variant: Variant
    size: Size
}): TextStyles => {
    const textVariant = ((): TextStyles['variant'] => {
        switch (size) {
            case 'regular':
            case 'compressed':
                return 'paragraph'
            case 'small':
                return 'caption1'

            default:
                return notReachable(size)
        }
    })()

    const weight: TextStyles['weight'] = 'medium' as const

    const color = ((): TextStyles['color'] => {
        const colorOption: `${Variant}_${State}` =
            `${variant}_${state}` as const

        switch (colorOption) {
            case 'primary_disabled':
                return 'textDisabled'
            case 'primary_hover':
            case 'primary_idle':
            case 'primary_pressed':
                return 'textOnPrimary'

            case 'secondary_disabled':
                return 'textDisabled'
            case 'secondary_hover':
            case 'secondary_idle':
            case 'secondary_pressed':
                return 'textPrimary'

            case 'tertiary_disabled':
                return 'textDisabled'
            case 'tertiary_hover':
                return 'textPrimary'
            case 'tertiary_idle':
                return 'textSecondary'
            case 'tertiary_pressed':
                return 'actionPrimaryPressed'

            case 'warning_disabled':
                return 'textStatusWarningOnColorDisabled'
            case 'warning_hover':
                return 'textStatusWarningOnColorHover'
            case 'warning_idle':
            case 'warning_pressed':
                return 'textStatusWarningOnColor'
            default:
                return notReachable(colorOption)
        }
    })()

    return {
        variant: textVariant,
        weight,
        color,
    }
}

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
        padding: 12,
    },

    size_regular: {
        paddingVertical: 12,
        paddingHorizontal: 18,
    },

    size_small: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
})

type Props = {
    'aria-label'?: string
    variant: Variant
    size: Size
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
            {({ pressed, hovered }) => {
                const state: State = disabled
                    ? 'disabled'
                    : pressed
                    ? 'pressed'
                    : hovered
                    ? 'hover'
                    : 'idle'

                const textStylesProps = getTextStyles({
                    size,
                    state,
                    variant,
                })
                return (
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
                            ellipsis
                            color={textStylesProps.color}
                            variant={textStylesProps.variant}
                            weight={textStylesProps.weight}
                        >
                            {children}
                        </Text>
                    </View>
                )
            }}
        </Pressable>
    )
}
