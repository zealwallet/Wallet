import React, { useCallback, useMemo } from 'react'

import AnimatedLottieView from 'lottie-react-native'

import { notReachable, useLiveRef } from '@zeal/toolkit'

type AnimationName = 'success' | 'radial-progress'

type AnimationEvent = 'complete'

type Props = {
    animation: AnimationName
    durationMs?: number
    loop: boolean
    onAnimationEvent?: (event: AnimationEvent) => void
    size: number
}

const InternalComponent = React.memo(
    ({ size, animation, durationMs, loop, onAnimationEvent }: Props) => {
        const animationJSON = useMemo(() => {
            switch (animation) {
                case 'radial-progress':
                    return require('./radial-progress.json')
                case 'success':
                    return require('./success.json')
                default:
                    return notReachable(animation)
            }
        }, [animation])

        return (
            <AnimatedLottieView
                style={{ width: size, height: size }}
                autoPlay
                loop={loop}
                source={animationJSON}
                duration={durationMs}
                onAnimationFinish={(canceled) => {
                    if (!canceled) {
                        onAnimationEvent && onAnimationEvent('complete')
                    }
                }}
            />
        )
    }
)

export const Animation = ({
    onAnimationEvent,
    animation,
    durationMs,
    loop,
    size,
}: Props) => {
    const liveOnAnimationEvent = useLiveRef(onAnimationEvent)
    const memoOnAnimationEvent = useCallback(
        (e: AnimationEvent) => {
            liveOnAnimationEvent.current && liveOnAnimationEvent.current(e)
        },
        [liveOnAnimationEvent]
    )
    return (
        <InternalComponent
            onAnimationEvent={memoOnAnimationEvent}
            animation={animation}
            size={size}
            loop={loop}
            durationMs={durationMs}
        />
    )
}
