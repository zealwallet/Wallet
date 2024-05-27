import React from 'react'
import {
    GestureResponderEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'

import { Color, colors } from '@zeal/uikit/colors'
import { Column } from '@zeal/uikit/Column'
import { styles as textStyles } from '@zeal/uikit/Text'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    base: {
        height: 68,
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'transparent',
        backgroundColor: colors.actionSecondaryDefault,
    },
    text: {
        ...textStyles.variant_caption2,
        textAlign: 'center',
        color: colors.textSecondary,
    },
    hover: {
        borderColor: colors.actionSecondaryOnGreyHovered,
        backgroundColor: colors.actionSecondaryOnGreyHovered,
    },
    hover_text: {
        color: colors.textPrimary,
    },
    active: {
        borderColor: colors.actionSecondaryOnGreyPressed,
        backgroundColor: colors.actionSecondaryOnGreyPressed,
    },
    icon: {
        padding: 4,
    },
})

type IconColor = Extract<Color, 'textPrimary'>

type Props = {
    children: (props: { color: IconColor; size: number }) => React.ReactNode
    title: React.ReactNode
    onClick: (e: GestureResponderEvent) => void
    'aria-label': string
}

const ICON_SIZE = 24

export const ActionButton = ({
    onClick,
    children,
    title,
    'aria-label': ariaLabel,
}: Props) => {
    return (
        <Pressable
            style={[styles.container]}
            aria-label={ariaLabel}
            role="button"
            onPress={onClick}
        >
            {({ pressed, hovered }) => (
                <View
                    style={[
                        styles.base,
                        hovered && styles.hover,
                        pressed && styles.active,
                    ]}
                >
                    <Column spacing={0} alignX="center">
                        <View style={[styles.icon]}>
                            {children({
                                color: 'textPrimary',
                                size: ICON_SIZE,
                            })}
                        </View>
                        <Text
                            style={[styles.text, hovered && styles.hover_text]}
                        >
                            {title}
                        </Text>
                    </Column>
                </View>
            )}
        </Pressable>
    )
}
