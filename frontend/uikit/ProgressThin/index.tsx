import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'

import { RangeInt } from '@zeal/toolkit/Range'

import { colors } from '../colors'
import { Extractor } from '../Extractor'

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        padding: 2,
    },

    container: {
        backgroundColor: colors.borderSecondary,
        width: '100%',
        height: 4,
        borderRadius: 4,
        overflow: 'hidden',
    },

    bar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
    },

    background_neutral: { backgroundColor: colors.backgroundStatusNeutral },
    background_warning: { backgroundColor: colors.backgroundStatusWarning },
    background_critical: { backgroundColor: colors.backgroundStatusCritical },
    background_success: { backgroundColor: colors.backgroundStatusSuccess },
    background_primary: { backgroundColor: colors.iconAccent2 },
})

type Background = Extractor<keyof typeof styles, 'background'>

type Props = {
    initialProgress: RangeInt<0, 100> | null
    progress: RangeInt<0, 100>
    background: Background
    animationTimeMs: number
}

export const ProgressThin = ({
    initialProgress,
    progress,
    background,
    animationTimeMs,
}: Props) => {
    const current = useRef(
        new Animated.Value(initialProgress ?? progress)
    ).current

    useEffect(() => {
        current.setValue(initialProgress ?? progress)
        Animated.timing(current, {
            toValue: progress,
            duration: animationTimeMs,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start()

        return () => current.stopAnimation()
    }, [progress, current, animationTimeMs, initialProgress])

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.bar,
                        styles[`background_${background}`],
                        {
                            width: current.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%'],
                            }),
                        },
                    ]}
                />
            </View>
        </View>
    )
}
