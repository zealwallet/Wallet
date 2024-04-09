import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { styles as textStyles } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

type Props = {
    children: React.ReactNode
} & (
    | {
          disabled?: false
          selected?: boolean
          errored?: boolean
          onClick: () => void
      }
    | { disabled: true }
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    base: {
        flexGrow: 1,
        textAlign: 'center',
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderColor: colors.borderDefault,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5,
        ...textStyles.variant_paragraph,
        ...textStyles.weight_medium,
        ...textStyles.color_textPrimary,
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

    hover: {
        borderColor: colors.actionPrimaryHovered,
        color: colors.actionPrimaryHovered,
    },

    active: {
        borderColor: colors.actionPrimaryPressed,
        color: colors.textPrimary,
    },

    error: {
        borderColor: colors.borderError,
    },
    selected: {
        color: colors.actionPrimaryPressed,
        borderColor: colors.actionGhostDefault,
        backgroundColor: colors.surfaceGhost,
    },

    disabled: {
        backgroundColor: colors.actionSecondaryDisabled,
        borderColor: 'transparent',
        color: colors.textDisabled,
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

export const SelectorButton = (props: Props) => {
    return (
        <Pressable
            role="radio"
            style={[styles.container]}
            disabled={props.disabled}
            aria-checked={!props.disabled && props.selected}
            onPress={props.disabled ? noop : props.onClick}
        >
            {({ pressed, hovered }) => (
                <Text
                    numberOfLines={1}
                    style={
                        props.disabled
                            ? [styles.base, styles.disabled]
                            : [
                                  styles.base,
                                  pressed && styles.active,
                                  hovered && styles.hover,
                                  props.selected && styles.selected,
                                  props.errored && styles.error,
                              ]
                    }
                >
                    {props.children}
                </Text>
            )}
        </Pressable>
    )
}
