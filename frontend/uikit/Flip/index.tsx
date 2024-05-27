import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    withTiming,
} from 'react-native-reanimated'

import { notReachable } from '@zeal/toolkit'

export type Side = 'front' | 'back'
export type RotateAxis = 'X' | 'Y'

type Props = {
    perspective?: number
    side: Side
    rotate?: RotateAxis
    front: React.ReactElement
    back: React.ReactElement
}

export const Flip = ({
    perspective = 1200,
    rotate = 'Y',
    side: sideType,
    front,
    back,
}: Props) => {
    const side = sideToNumber(sideType)
    const rotatePosition = useDerivedValue(
        () => interpolate(side, [0, 1], [180, 360]),
        [side]
    )

    const rotateValue = useDerivedValue(() => {
        return withTiming(rotatePosition.value, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
        })
    }, [rotatePosition])

    const rotationFlip = useDerivedValue(() => {
        switch (rotate) {
            case 'Y':
                return {
                    rotateY: `${rotateValue.value}deg`,
                }
            case 'X':
                return {
                    rotateX: `${rotateValue.value}deg`,
                }
            /* istanbul ignore next */
            default:
                return notReachable(rotate)
        }
    }, [rotate, rotateValue])

    const rotationFlipBack = useDerivedValue(() => {
        switch (rotate) {
            case 'Y':
                return {
                    rotateY: '180deg',
                }
            case 'X':
                return {
                    rotateX: '180deg',
                }
            /* istanbul ignore next */
            default:
                return notReachable(rotate)
        }
    }, [rotate])

    const opacityFront = useDerivedValue(() => {
        return withTiming(side, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
        })
    }, [side])

    const opacityBack = useDerivedValue(() => {
        return withTiming(side === 0 ? 1 : 0, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
        })
    }, [side])

    const animatedStyleFront = useAnimatedStyle(() => {
        return {
            opacity: opacityFront.value,
            transform: [{ perspective }, { ...rotationFlip.value }],
        }
    }, [opacityFront, perspective, rotationFlip])

    const animatedStyleBack = useAnimatedStyle(() => {
        return {
            opacity: opacityBack.value,
            display: opacityBack.value === 0 ? 'none' : 'flex',
            transform: [
                { perspective },
                { ...rotationFlipBack.value },
                { ...rotationFlip.value },
            ],
        }
    }, [opacityBack, perspective, rotationFlip, rotationFlipBack])

    return (
        <View>
            <View style={{ opacity: 0 }}>{front}</View>
            <Animated.View style={StyleSheet.absoluteFill}>
                <Animated.View
                    style={[
                        styles.container,
                        StyleSheet.absoluteFill,
                        animatedStyleFront,
                    ]}
                >
                    {front}
                </Animated.View>
                <Animated.View
                    style={[
                        styles.container,
                        StyleSheet.absoluteFill,
                        animatedStyleBack,
                    ]}
                >
                    {back}
                </Animated.View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

const sideToNumber = (side: Side): number => {
    switch (side) {
        case 'front':
            return 1
        case 'back':
            return 0
        /* istanbul ignore next */
        default:
            return notReachable(side)
    }
}
