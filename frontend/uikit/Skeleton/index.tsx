import React, { useEffect, useState } from 'react'
import { LayoutChangeEvent, StyleSheet, View } from 'react-native'
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated'

import { LinearGradient } from 'expo-linear-gradient'

import { Extractor } from '../Extractor'

const styles = StyleSheet.create({
    container: {
        borderRadius: 999,
        overflow: 'hidden',
    },
    variant_default: { backgroundColor: '#e4e7eb' },
    variant_transparent: {},
    splash: {
        width: '100%',
        height: '100%',
        borderRadius: 999,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
})

type Variant = Extractor<keyof typeof styles, 'variant'>

type Props = {
    variant: Variant
    height?: number
    width: number | `${number}%`
}

const DEFAULT_SKELETON_HEIGHT = 8

export const Skeleton = ({
    variant,
    height = DEFAULT_SKELETON_HEIGHT,
    width,
}: Props) => {
    const [measuredWidth, setMeasuredWidth] = useState<number | null>(null)

    return (
        <View
            onLayout={(event: LayoutChangeEvent) =>
                setMeasuredWidth(event.nativeEvent.layout.width)
            }
            style={[
                styles.container,
                styles[`variant_${variant}`],
                {
                    height: height,
                    minHeight: height,
                    width: width,
                    minWidth: width,
                },
            ]}
        >
            {measuredWidth && <Splash width={measuredWidth} />}
        </View>
    )
}

const Splash = ({ width }: { width: number }) => {
    const animationProgress = useSharedValue(0)

    const translateX = useDerivedValue(
        () =>
            withRepeat(
                withTiming(
                    interpolate(
                        animationProgress.value,
                        [0, 1],
                        [-width, width]
                    ),
                    {
                        duration: 750,
                        easing: Easing.bezier(0.15, 0.5, 0.5, 1),
                    }
                ),
                0 // Repeat indefinitely
            ),
        [animationProgress, width]
    )

    const animatedStyles = useAnimatedStyle(
        () => ({
            transform: [{ translateX: translateX.value }],
        }),
        [translateX]
    )

    useEffect(() => {
        animationProgress.value = 1
    }, [width, animationProgress])

    return (
        <Animated.View style={[styles.splash, animatedStyles]}>
            <LinearGradient
                style={StyleSheet.absoluteFill}
                colors={[
                    'rgba(255,255,255,0)',
                    '#f9f9fa',
                    'rgba(255,255,255,0)',
                ]}
                end={{ x: 1, y: 0 }}
            />
        </Animated.View>
    )
}
