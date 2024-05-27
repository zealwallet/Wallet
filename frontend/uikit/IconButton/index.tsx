import React from 'react'
import {
    GestureResponderEvent,
    Pressable,
    PressableStateCallbackType,
    StyleSheet,
    View,
} from 'react-native'

import { Color } from '@zeal/uikit/colors'
import { Extractor } from '@zeal/uikit/Extractor'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

const styles = StyleSheet.create({
    // @ts-ignore
    pressable: {
        flexShrink: 1,
        justifyContent: 'center',
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    size_default: {
        minHeight: 40,
        minWidth: 40,
    },
    size_small: {
        flexBasis: 'auto',
    },
})

type Size = Extractor<keyof typeof styles, 'size'>

type Props = {
    children: (props: { color: IconColor }) => React.ReactNode
    'aria-label'?: string // TODO Should not be optional
    'aria-pressed'?: boolean
    disabled?: boolean
    variant: Variant
    testID?: string
    onClick: (e: GestureResponderEvent) => void
    size?: Size
}

type State = 'pressed' | 'hovered' | 'default' | 'disabled'
type Variant = 'on_light' | 'on_color'

type IconColor = Extract<
    Color,
    | 'iconPressed'
    | 'iconHover'
    | 'iconDefault'
    | 'iconDisabled'
    | 'textOnColorSecondary'
    | 'textOnColorSecondaryHover'
    | 'textOnColorSecondaryPressed'
    | 'textOnColorSecondaryDisabled'
>

const getIconColor = (
    variant: Variant,
    states: PressableStateCallbackType & { disabled: boolean }
): IconColor => {
    const colorOption: `${Variant}_${State}` = `${variant}_${
        states.disabled
            ? 'disabled'
            : states.pressed
            ? 'pressed'
            : states.hovered
            ? 'hovered'
            : 'default'
    }`

    switch (colorOption) {
        case 'on_light_pressed':
            return 'iconPressed'
        case 'on_light_hovered':
            return 'iconHover'
        case 'on_light_default':
            return 'iconDefault'
        case 'on_light_disabled':
            return 'iconDisabled'

        case 'on_color_pressed':
            return 'textOnColorSecondary'
        case 'on_color_hovered':
            return 'textOnColorSecondaryHover'
        case 'on_color_default':
            return 'textOnColorSecondaryPressed'
        case 'on_color_disabled':
            return 'textOnColorSecondaryDisabled'

        default:
            return notReachable(colorOption)
    }
}

export const IconButton = ({
    'aria-label': ariaLabel,
    'aria-pressed': ariaPressed,
    testID,
    children,
    onClick,
    variant,
    size = 'default',
    disabled = false,
}: Props) => {
    return (
        <Pressable
            style={[styles.pressable, styles[`size_${size}`]]}
            role="button"
            aria-label={ariaLabel}
            aria-pressed={ariaPressed}
            testID={testID}
            onPress={onClick}
        >
            {({ pressed, hovered }) => (
                <View style={[styles.container]}>
                    {children({
                        color: getIconColor(variant, {
                            pressed,
                            hovered,
                            disabled,
                        }),
                    })}
                </View>
            )}
        </Pressable>
    )
}
