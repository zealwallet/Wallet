import React, { ReactNode, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'

import * as Haptics from 'expo-haptics'

import { colors } from '@zeal/uikit/colors'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

type Props = {
    children: ReactNode
    onBackSwipeInvoked: () => void
}

const BACK_THRESHOLD_DISTANCE = 180

const INDICATOR_SIZE = 52
const INDICATOR_ENLARGED_SIZE = 64

const ICON_SIZE = 16
const ICON_ENLARGED_SIZE = 24

export const BackGestureDetector = ({
    onBackSwipeInvoked,
    children,
}: Props) => {
    const liveOnBackSwipeInvoked = useLiveRef(onBackSwipeInvoked)

    const start = useSharedValue({ x: 0, y: 0 })
    const dragProgress = useSharedValue(0)
    const rotation = useSharedValue(0)

    const indicatorDimensions = useSharedValue({
        width: 0,
        height: INDICATOR_SIZE,
    })

    const iconOpacity = useSharedValue(0)
    const iconSize = useSharedValue(ICON_SIZE)

    const indicatorLeft = useSharedValue(-INDICATOR_SIZE)

    const hapticTriggered = useSharedValue(false)

    const indicatorStyle = useAnimatedStyle(() => {
        return {
            justifyContent: 'center',
            alignItems: 'center',
            width: indicatorDimensions.value.width,
            height: indicatorDimensions.value.height,
            borderRadius: indicatorDimensions.value.height,
            backgroundColor: colors.surfaceDefault,
            position: 'absolute',
            left: indicatorLeft.value,
            top: start.value.y - INDICATOR_SIZE / 2,
            ...(() => {
                switch (ZealPlatform.OS) {
                    case 'ios':
                        return {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.2,
                            shadowRadius: 12,
                        }
                    case 'android':
                        return {
                            elevation: 16,
                        }
                    case 'web':
                        return {}
                    /* istanbul ignore next */
                    default:
                        return notReachable(ZealPlatform.OS)
                }
            })(),
        }
    }, [indicatorDimensions, indicatorLeft, start])

    const iconStyle = useAnimatedStyle(() => {
        return {
            opacity: iconOpacity.value,
            transform: [
                { scale: iconSize.value / ICON_SIZE },
                { rotate: `${rotation.value}deg` },
            ],
        }
    }, [iconOpacity.value, iconSize.value, rotation.value])

    const gesture = useMemo(
        () =>
            Gesture.Pan()
                .onBegin((event) => {
                    start.value = {
                        x: event.x,
                        y: event.y,
                    }
                    dragProgress.value = 0
                    indicatorDimensions.value = {
                        width: INDICATOR_SIZE,
                        height: INDICATOR_SIZE,
                    }
                    iconOpacity.value = 0
                    iconSize.value = ICON_SIZE
                    hapticTriggered.value = false
                })
                .onUpdate((event) => {
                    const distance = event.x - start.value.x
                    dragProgress.value = Math.max(0, distance)

                    if (
                        distance >= BACK_THRESHOLD_DISTANCE &&
                        !hapticTriggered.value
                    ) {
                        hapticTriggered.value = true
                        runOnJS(Haptics.selectionAsync)()
                    }

                    rotation.value = interpolate(
                        distance,
                        [0, BACK_THRESHOLD_DISTANCE],
                        [-360, 0],
                        Extrapolation.CLAMP
                    )

                    const sizeStartDistance = BACK_THRESHOLD_DISTANCE * 0.9
                    indicatorDimensions.value = {
                        width: interpolate(
                            distance,
                            [sizeStartDistance, BACK_THRESHOLD_DISTANCE],
                            [INDICATOR_SIZE, INDICATOR_ENLARGED_SIZE],
                            Extrapolation.CLAMP
                        ),
                        height: interpolate(
                            distance,
                            [sizeStartDistance, BACK_THRESHOLD_DISTANCE],
                            [INDICATOR_SIZE, INDICATOR_ENLARGED_SIZE],
                            Extrapolation.CLAMP
                        ),
                    }

                    indicatorLeft.value = interpolate(
                        distance,
                        [0, BACK_THRESHOLD_DISTANCE],
                        [-INDICATOR_SIZE, 8],
                        Extrapolation.CLAMP
                    )

                    iconOpacity.value = interpolate(
                        distance,
                        [30, 50],
                        [0, 1],
                        Extrapolation.CLAMP
                    )
                    iconSize.value = interpolate(
                        distance,
                        [BACK_THRESHOLD_DISTANCE - 20, BACK_THRESHOLD_DISTANCE],
                        [ICON_SIZE, ICON_ENLARGED_SIZE],
                        Extrapolation.CLAMP
                    )
                })

                .onEnd((event) => {
                    if (event.x - start.value.x > BACK_THRESHOLD_DISTANCE) {
                        runOnJS(liveOnBackSwipeInvoked.current)()
                        indicatorDimensions.value = {
                            width: withTiming(INDICATOR_SIZE, {
                                duration: 100,
                            }),
                            height: withTiming(INDICATOR_SIZE, {
                                duration: 100,
                            }),
                        }
                        indicatorLeft.value = withTiming(8, { duration: 100 })
                        iconOpacity.value = withTiming(0, { duration: 100 })
                        iconSize.value = withTiming(ICON_SIZE, {
                            duration: 100,
                        })
                    } else {
                        indicatorDimensions.value = {
                            width: withTiming(INDICATOR_SIZE, {
                                duration: 100,
                            }),
                            height: withTiming(INDICATOR_SIZE, {
                                duration: 100,
                            }),
                        }
                        indicatorLeft.value = withTiming(-INDICATOR_SIZE, {
                            duration: 100,
                        })
                        dragProgress.value = withTiming(0, { duration: 100 })
                        iconOpacity.value = withTiming(0, { duration: 100 })
                        iconSize.value = withTiming(ICON_SIZE, {
                            duration: 100,
                        })
                    }
                })
                .enabled(
                    (() => {
                        switch (ZealPlatform.OS) {
                            case 'ios':
                            case 'android':
                                return true
                            case 'web':
                                return false
                            /* istanbul ignore next */
                            default:
                                return notReachable(ZealPlatform.OS)
                        }
                    })()
                ),
        [
            dragProgress,
            hapticTriggered,
            iconOpacity,
            iconSize,
            indicatorDimensions,
            indicatorLeft,
            liveOnBackSwipeInvoked,
            rotation,
            start,
        ]
    )

    return (
        <GestureDetector gesture={gesture} userSelect="auto">
            <View style={[StyleSheet.absoluteFill]}>
                {children}
                <Animated.View style={indicatorStyle}>
                    <Animated.View style={iconStyle}>
                        <BackIcon size={ICON_SIZE} color="surfaceDark" />
                    </Animated.View>
                </Animated.View>
            </View>
        </GestureDetector>
    )
}
