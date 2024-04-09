import React from 'react'
import {
    GestureResponderEvent,
    Pressable,
    PressableStateCallbackType,
    StyleSheet,
    View,
} from 'react-native'

import { Color } from '@zeal/uikit/colors'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

const styles = StyleSheet.create({
    // @ts-ignore
    pressable: {
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
})

type Props = {
    children: (props: { color: IconColor }) => React.ReactNode
    'aria-label'?: string // TODO Should not be optional
    'aria-pressed'?: boolean
    variant: Variant
    testID?: string
    onClick: (e: GestureResponderEvent) => void
}

type State = 'pressed' | 'hovered' | 'default'
type Variant = 'on_light' | 'on_color'

type IconColor = Extract<
    Color,
    | 'iconPressed'
    | 'iconHover'
    | 'iconDefault'
    | 'textOnColorSecondary'
    | 'textOnColorSecondaryHover'
    | 'textOnColorSecondaryPressed'
>

const getIconColor = (
    variant: Variant,
    states: PressableStateCallbackType
): IconColor => {
    const colorOption: `${Variant}_${State}` = `${variant}_${
        states.pressed ? 'pressed' : states.hovered ? 'hovered' : 'default'
    }`

    switch (colorOption) {
        case 'on_light_pressed':
            return 'iconPressed'
        case 'on_light_hovered':
            return 'iconHover'
        case 'on_light_default':
            return 'iconDefault'

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

export const IconButton = ({
    'aria-label': ariaLabel,
    'aria-pressed': ariaPressed,
    testID,
    children,
    onClick,
    variant,
}: Props) => {
    return (
        <Pressable
            style={[styles.pressable]}
            role="button"
            aria-label={ariaLabel}
            aria-pressed={ariaPressed}
            testID={testID}
            onPress={onClick}
        >
            {({ pressed, hovered }) => (
                <View style={[styles.container]}>
                    {children({
                        color: getIconColor(variant, { pressed, hovered }),
                    })}
                </View>
            )}
        </Pressable>
    )
}
