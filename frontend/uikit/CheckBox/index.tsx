import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { Checkbox } from '@zeal/uikit/Icon/Checkbox'
import { NotSelected } from '@zeal/uikit/Icon/NotSelected'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

declare module 'react-native' {
    interface PressableStateCallbackType {
        hovered?: boolean
        focused?: boolean
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        minHeight: 40,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: colors.actionSecondaryDefault,
    },
    disabled: {
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
    pressed: {
        backgroundColor: colors.actionSecondaryPressed,
    },
    hovered: {
        backgroundColor: colors.actionSecondaryHovered,
    },
})

type Props = {
    title: React.ReactNode
    disabled?: boolean
    checked: boolean
    onClick: () => void
}

export const CheckBox = ({ checked, onClick, disabled, title }: Props) => (
    <Pressable
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onPress={disabled ? noop : onClick}
        style={({ pressed, hovered }) => [
            styles.container,
            pressed && styles.pressed,
            hovered && styles.hovered,
            disabled && styles.disabled,
        ]}
    >
        <Text
            variant="paragraph"
            weight="regular"
            color={disabled ? 'textDisabled' : 'textPrimary'}
        >
            {title}
        </Text>
        <View>
            {checked ? (
                <Checkbox size={20} color="iconAccent2" />
            ) : (
                <NotSelected size={20} color="iconDefault" />
            )}
        </View>
    </Pressable>
)
