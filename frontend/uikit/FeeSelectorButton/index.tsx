import React, { ReactNode, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Color, colors } from '@zeal/uikit/colors'
import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { styles as textStyles } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

const styles = StyleSheet.create({
    pressable: {
        flexGrow: 1,
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

    skeletonPressable: {
        flex: 1,
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

    container: {
        flexGrow: 1,
        backgroundColor: 'transparent',
        padding: 8,
        borderWidth: 1,
        borderColor: colors.borderDefault,
        borderRadius: 4,
        minHeight: 106,
    },

    containerHover: {
        borderColor: colors.actionPrimaryHovered,
    },

    containerActive: {
        borderColor: colors.actionPrimaryPressed,
    },

    error: { borderColor: colors.borderError },

    selected: {
        borderColor: colors.actionGhostDefault,
        backgroundColor: colors.surfaceGhost,
    },

    disabled: {
        backgroundColor: colors.actionSecondaryDisabled,
        borderColor: 'transparent',
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

    title: {
        ...textStyles.base,
        ...textStyles.variant_paragraph,
        ...textStyles.weight_medium,
        ...textStyles.color_textSecondary,
    },

    amount: {
        ...textStyles.base,
        ...textStyles.variant_paragraph,
        ...textStyles.weight_medium,
        ...textStyles.color_textPrimary,
    },

    time: {
        ...textStyles.base,
        ...textStyles.variant_paragraph,
        ...textStyles.weight_medium,
        ...textStyles.color_textSecondary,
    },
    icon: { color: colors.iconDisabled },

    hoverColor: {
        color: colors.actionPrimaryHovered,
    },
})

type Props = {
    title: ReactNode
    amount: ReactNode
    time: ReactNode
    icon: (props: { color: Color }) => ReactNode
    tabindex: number
} & (
    | {
          disabled?: false
          selected?: boolean
          errored?: boolean
          onClick: () => void
      }
    | { disabled: true }
)

export const FeeSelectorButton = (props: Props) => {
    const [labelId] = useState(`FeeSelectorButton_label_${uuid()}`)

    return (
        <Pressable
            role="radio"
            style={styles.pressable}
            disabled={props.disabled}
            aria-checked={!props.disabled && props.selected}
            aria-labelledby={labelId}
            onPress={props.disabled ? noop : props.onClick}
        >
            {({ pressed, hovered }) => (
                <View
                    style={[
                        styles.container,
                        styles.pressable,
                        'errored' in props && props.errored && styles.error,
                        'selected' in props &&
                            props.selected &&
                            styles.selected,
                        props.disabled && styles.disabled,
                        pressed && styles.containerActive,
                        !pressed && hovered && styles.containerHover,
                    ]}
                >
                    <Column spacing={12} alignY="stretch">
                        <Row spacing={8} alignX="stretch">
                            <Text
                                id={labelId}
                                style={[
                                    styles.title,
                                    hovered && !pressed && styles.hoverColor,
                                ]}
                            >
                                {props.title}
                            </Text>

                            {props.icon({
                                color:
                                    hovered && !pressed
                                        ? 'actionPrimaryHovered'
                                        : 'iconDisabled',
                            })}
                        </Row>

                        <Column spacing={4}>
                            <Text
                                id={labelId}
                                style={[
                                    styles.amount,
                                    hovered && !pressed && styles.hoverColor,
                                ]}
                            >
                                {props.amount}
                            </Text>
                            <Text
                                id={labelId}
                                style={[
                                    styles.time,
                                    hovered && !pressed && styles.hoverColor,
                                ]}
                            >
                                {props.time || '? sec'}
                            </Text>
                        </Column>
                    </Column>
                </View>
            )}
        </Pressable>
    )
}

export const FeeSelectorButtonSkeleton = () => {
    return (
        <Pressable
            style={[styles.skeletonPressable, styles.container]}
            disabled
        >
            <Column spacing={20} alignY="stretch">
                <Row spacing={4}>
                    <Skeleton variant="default" height={16} width="100%" />
                </Row>

                <Column spacing={8} alignY="stretch">
                    <Skeleton variant="default" height={16} width={55} />
                    <Skeleton variant="default" height={16} width={35} />
                </Column>
            </Column>
        </Pressable>
    )
}
