import React, { useEffect, useRef } from 'react'
import { Animated, Easing, View } from 'react-native'

import { Color } from '../colors'
import { Spinner as SpinnerIcon } from '../Icon/Spinner'

type Props = {
    size: number
    color?: Color
    'aria-label'?: string
}

export const Spinner = ({ size, color, 'aria-label': ariaLabel }: Props) => {
    const rotation = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const startRotation = () => {
            rotation.setValue(0)
            Animated.timing(rotation, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => startRotation())
        }

        startRotation()

        return () => rotation.stopAnimation()
    }, [rotation])

    const animatedStyles = {
        transform: [
            {
                rotate: rotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                }),
            },
        ],
    }

    return (
        <View aria-label={ariaLabel} style={{ height: size, width: size }}>
            <Animated.View style={[animatedStyles]}>
                <SpinnerIcon size={size} color={color} />
            </Animated.View>
        </View>
    )
}
