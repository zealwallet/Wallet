import React, { ReactNode, useEffect, useRef, useState } from 'react'
import {
    Animated,
    Easing,
    Pressable,
    StyleSheet,
    Text as NativeText,
    View,
} from 'react-native'

import { uuid } from '@zeal/toolkit/Crypto'
import { RangeInt } from '@zeal/toolkit/Range'

import { colors } from '../colors'
import { Column } from '../Column'
import { Row } from '../Row'
import { styles as textStyles, Text } from '../Text'

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surfaceDefault,
        overflow: 'hidden',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    roundedContainer: {
        borderRadius: 8,
    },

    bar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    },

    bar_default_neutral: {
        backgroundColor: colors.backgroundAlertNeutral,
    },
    bar_hovered_neutral: {
        backgroundColor: colors.backgroundAlertNeutralHover,
    },
    bar_pressed_neutral: {
        backgroundColor: colors.backgroundAlertNeutralClicked,
    },
    bar_default_success: {
        backgroundColor: colors.backgroundAlertSuccess,
    },
    bar_hovered_success: {
        backgroundColor: colors.backgroundAlertSuccessHover,
    },
    bar_pressed_success: {
        backgroundColor: colors.backgroundAlertSuccessClicked,
    },
    bar_default_critical: {
        backgroundColor: colors.backgroundAlertCritical,
    },
    bar_hovered_critical: {
        backgroundColor: colors.backgroundAlertCriticalHover,
    },
    bar_pressed_critical: {
        backgroundColor: colors.backgroundAlertCriticalClicked,
    },
    bar_default_warning: {
        backgroundColor: colors.backgroundAlertWarning,
    },
    bar_hovered_warning: {
        backgroundColor: colors.backgroundAlertWarningHover,
    },
    bar_pressed_warning: {
        backgroundColor: colors.backgroundAlertWarningClicked,
    },

    title_neutral: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusNeutralOnColor,
    },
    title_success: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusSuccessOnColor,
    },
    title_critical: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusCriticalOnColor,
    },
    title_warning: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusWarningOnColor,
    },
})

type Variant = 'neutral' | 'success' | 'critical' | 'warning'

type Props = {
    variant: Variant
    progress: RangeInt<0, 100>
    initialProgress: RangeInt<0, 100> | null
    title: ReactNode
    subtitle?: ReactNode
    rounded?: true
    right?: ReactNode
    onClick?: () => void
}

export const Progress = ({
    title,
    right,
    progress,
    initialProgress,
    subtitle,
    variant,
    rounded,
    onClick,
}: Props) => {
    const [labelId] = useState(uuid())
    const [descriptionId] = useState(uuid())
    const [width, setWidth] = useState<number>(0)

    const current = useRef(
        new Animated.Value(initialProgress ?? progress)
    ).current

    useEffect(() => {
        Animated.timing(current, {
            toValue: progress,
            duration: 700,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start()

        return () => current.stopAnimation()
    }, [progress, current])

    return (
        <Pressable
            onLayout={(e) => {
                setWidth(e.nativeEvent.layout.width)
            }}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            role={onClick ? 'button' : 'progressbar'}
            disabled={!onClick}
            onPress={onClick}
            style={[styles.container, rounded && styles.roundedContainer]}
        >
            {({ pressed, hovered }) => (
                <>
                    <Animated.View
                        style={[
                            styles.bar,
                            styles[
                                `bar_${
                                    pressed
                                        ? 'pressed'
                                        : hovered
                                        ? 'hovered'
                                        : 'default'
                                }_${variant}`
                            ],
                            {
                                right: current.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: [width, 0],
                                }),
                            },
                        ]}
                    />

                    <Column spacing={8}>
                        <Row spacing={4} alignX="stretch">
                            <View>
                                <NativeText
                                    id={labelId}
                                    style={styles[`title_${variant}`]}
                                >
                                    {title}
                                </NativeText>
                            </View>

                            {right}
                        </Row>

                        {subtitle && (
                            <Text
                                id={descriptionId}
                                variant="paragraph"
                                weight="regular"
                                color="textPrimary"
                            >
                                {subtitle}
                            </Text>
                        )}
                    </Column>
                </>
            )}
        </Pressable>
    )
}
