import React from 'react'
import {
    GestureResponderEvent,
    Pressable,
    PressableStateCallbackType,
    StyleSheet,
    View,
} from 'react-native'

import {
    Color as TextColor,
    Variant as TextVariant,
    Weight as TextWeight,
} from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

declare module 'react-native' {
    interface PressableStateCallbackType {
        hovered?: boolean
        focused?: boolean
    }
}

const styles = StyleSheet.create({
    pressable: {
        flexDirection: 'row',
        maxWidth: '100%',
        flexShrink: 1,
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
    container: {
        columnGap: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 1,
    },
    // @ts-ignore
    disabled: {
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
})

type Variant =
    | 'on_light'
    | 'on_dark'
    | 'on_color'
    | 'critical'
    | 'warning'
    | 'success'
    | 'neutral'

type ButtonState = 'pressed' | 'hovered' | 'default'

type Props = {
    'aria-label'?: string
    size: 'xl' | 'large' | 'regular' | 'small'
    color: Variant
    disabled?: boolean
    children: (props: {
        color: TextColor
        textVariant: TextVariant
        textWeight: TextWeight
    }) => React.ReactNode
    onClick?: (e: GestureResponderEvent) => void
}

export type Msg = { type: 'close' }

const getTextColor = ({
    states,
    variant,
}: {
    variant: Variant
    states: PressableStateCallbackType
}): TextColor => {
    const { pressed, hovered } = states
    const buttonState = pressed ? 'pressed' : hovered ? 'hovered' : 'default'
    const colorOption: `${Variant}_${ButtonState}` = `${variant}_${buttonState}` // TODO @resetko-zeal add disabled to the equation

    switch (colorOption) {
        case 'on_light_pressed':
            return 'actionPrimaryPressed'
        case 'on_light_hovered':
            return 'textPrimary'
        case 'on_light_default':
            return 'textSecondary'
        case 'on_dark_pressed':
            return 'darkActionSecondaryPressed'
        case 'on_dark_hovered':
            return 'darkActionSecondaryHover'
        case 'on_dark_default':
            return 'darkActionSecondaryDefault'
        case 'critical_pressed':
            return 'textStatusCriticalOnColorPressed'
        case 'critical_hovered':
            return 'textStatusCriticalOnColorHover'
        case 'critical_default':
            return 'textStatusCriticalOnColor'
        case 'success_pressed':
            return 'textStatusSuccessOnColorPressed'
        case 'success_hovered':
            return 'textStatusSuccessOnColorHover'
        case 'success_default':
            return 'textStatusSuccessOnColor'
        case 'neutral_pressed':
            return 'textStatusNeutralOnColorPressed'
        case 'neutral_hovered':
            return 'textStatusNeutralOnColorHover'
        case 'neutral_default':
            return 'textStatusNeutralOnColor'
        case 'warning_pressed':
            return 'textStatusWarningOnColorPressed'
        case 'warning_hovered':
            return 'textStatusWarningOnColorHover'
        case 'warning_default':
            return 'textStatusWarningOnColor'

        case 'on_color_pressed':
            return 'textOnColorSecondary'
        case 'on_color_hovered':
            return 'textOnColorSecondaryHover'
        case 'on_color_default':
            return 'textOnColorSecondaryPressed'

        default:
            return notReachable(colorOption)
    }
}

export const Tertiary = ({
    'aria-label': ariaLabel,
    disabled,
    color,
    onClick,
    size,
    children,
}: Props) => {
    return (
        <Pressable
            role="button"
            aria-label={ariaLabel}
            onPress={onClick}
            disabled={disabled}
            style={[styles.pressable, disabled && styles.disabled]}
        >
            {({ hovered, pressed }) => (
                <View style={styles.container}>
                    {children({
                        color: getTextColor({
                            states: { hovered, pressed },
                            variant: color,
                        }),
                        textVariant: (() => {
                            switch (size) {
                                case 'xl':
                                    return 'title3'
                                case 'large':
                                    return 'callout'
                                case 'regular':
                                    return 'paragraph'
                                case 'small':
                                    return 'caption1'
                                default:
                                    return notReachable(size)
                            }
                        })(),
                        textWeight: (() => {
                            switch (size) {
                                case 'xl':
                                    return 'medium'
                                case 'large':
                                    return 'medium'
                                case 'regular':
                                    return 'regular'
                                case 'small':
                                    return 'regular'
                                default:
                                    return notReachable(size)
                            }
                        })(),
                    })}
                </View>
            )}
        </Pressable>
    )
}
