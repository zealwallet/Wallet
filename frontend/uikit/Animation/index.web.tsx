import React, { useLayoutEffect, useRef } from 'react'
import { View } from 'react-native'

import lottie from 'lottie-web'

import { useLiveRef } from '@zeal/toolkit'
import { keys } from '@zeal/toolkit/Object'

import radialProgress from './radial-progress.json'
import success from './success.json'

// We can use Lottie with rn-reanimated for animations on all platforms, but that requires Lottie-rn 6. Expo is still on Lottie 5.
// TODO: remove this web specific code when Expo upgrades to Lottie 6.

type AnimationName = 'success' | 'radial-progress'

type AnimationEvent = 'complete'

const ANIMATION_EVENTS: Record<AnimationEvent, unknown> = {
    complete: true,
}

type Props = {
    animation: AnimationName
    durationMs?: number
    onAnimationEvent?: (event: AnimationEvent) => void
    size: number
    loop: boolean
}

const ANIMATION_NAME_TO_DATA: Record<AnimationName, any> = {
    success,
    'radial-progress': radialProgress,
}

const AnimationStyled = React.forwardRef<
    View,
    {
        size: number
    }
>(({ size }, ref) => {
    return <View ref={ref} style={{ width: size, height: size }} />
})

export const Animation = ({
    size,
    animation,
    durationMs,
    onAnimationEvent,
}: Props) => {
    const ref = useRef<View>(null)
    const onAnimationEventRef = useLiveRef(onAnimationEvent)

    useLayoutEffect(() => {
        if (ref.current) {
            const animationData = ANIMATION_NAME_TO_DATA[animation]
            const item = lottie.loadAnimation({
                animationData,
                // View is a div on the Web
                container: ref.current as unknown as Element,
                loop: false,
            })

            if (durationMs) {
                item.setSpeed((item.getDuration() * 1000) / durationMs)
            }

            const events = keys(ANIMATION_EVENTS)

            events.forEach((eventName) => {
                item.addEventListener(eventName, () => {
                    if (onAnimationEventRef.current) {
                        onAnimationEventRef.current(eventName)
                    }
                })
            })

            return () => {
                events.forEach((eventName) => {
                    item.removeEventListener(eventName)
                })
                item.destroy()
            }
        }
    }, [animation, onAnimationEventRef, durationMs])

    return <AnimationStyled size={size} ref={ref} />
}
