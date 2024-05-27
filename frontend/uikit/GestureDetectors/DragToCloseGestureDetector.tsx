import React, { useMemo } from 'react'
import {
    Gesture,
    GestureDetector,
    PanGesture,
} from 'react-native-gesture-handler'
import {
    interpolateColor,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'

import * as Haptics from 'expo-haptics'

import { colors } from '@zeal/uikit/colors'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

type Props = {
    children: React.ReactNode
    gesture: PanGesture
}

export const DragToCloseGestureDetector = ({ children, gesture }: Props) => {
    return <GestureDetector gesture={gesture}>{children}</GestureDetector>
}

const ANIMATION_DURATION = 200
const CLOSE_POPUP_HEIGHT_DRAG_THRESHOLD = 0.35
export const useDragToCloseGesture = (
    modalHeight: number,
    onClose: () => void
) => {
    const translateY = useSharedValue(0)
    const opacity = useSharedValue(1)
    const hapticTriggered = useSharedValue(false)

    const backgroundTransition = useAnimatedStyle(
        () => ({
            backgroundColor: interpolateColor(
                opacity.value,
                [0, 1],
                [colors.backgroundOverlayClosed, colors.backgroundOverlay]
            ),
        }),
        [opacity]
    )

    const popupTransform = useAnimatedStyle(
        () => ({
            transform: [{ translateY: translateY.value }],
        }),
        [translateY]
    )

    const handlePopupGesture = useMemo(
        () =>
            Gesture.Pan()
                .onUpdate((event) => {
                    if (event.translationY > 0) {
                        translateY.value = event.translationY
                        opacity.value = 1 - event.translationY / modalHeight
                    }
                    const closingThreshold =
                        modalHeight * CLOSE_POPUP_HEIGHT_DRAG_THRESHOLD
                    if (
                        translateY.value > closingThreshold &&
                        !hapticTriggered.value
                    ) {
                        hapticTriggered.value = true
                        runOnJS(Haptics.selectionAsync)()
                    }
                })
                .onEnd((event) => {
                    hapticTriggered.value = false
                    const closingThreshold =
                        modalHeight * CLOSE_POPUP_HEIGHT_DRAG_THRESHOLD
                    if (translateY.value > closingThreshold) {
                        translateY.value = withTiming(modalHeight, {
                            duration: ANIMATION_DURATION,
                        })
                        opacity.value = withTiming(
                            0,
                            {
                                duration: ANIMATION_DURATION,
                            },
                            () => runOnJS(onClose)()
                        )
                    } else {
                        translateY.value = withTiming(0, {
                            duration: ANIMATION_DURATION,
                        })
                        opacity.value = withTiming(1, {
                            duration: ANIMATION_DURATION,
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
        [hapticTriggered, modalHeight, onClose, opacity, translateY]
    )

    return {
        backgroundTransition,
        popupTransform,
        handlePopupGesture,
    }
}
