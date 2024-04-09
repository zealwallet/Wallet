import React from 'react'
import { Path, Rect, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const ProgressShield = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            color={color && colors[color]}
            height={size}
            viewBox="0 0 24 24"
            width={size}
            fill="none"
        >
            <Rect width="24" height="24" rx="12" fill="currentColor" />
            <Path
                d="M12.8705 6.30631C12.335 5.98383 11.665 5.98384 11.1295 6.30631L10.7423 6.53948C9.80272 7.10523 8.74793 7.4524 7.65602 7.55527L7.41206 7.57826C6.9305 7.62363 6.5625 8.02792 6.5625 8.51162V9.74454C6.5625 11.8285 7.40856 13.8232 8.90688 15.2716L11.3484 17.6319C11.7118 17.9832 12.2882 17.9832 12.6516 17.6319L15.0931 15.2716C16.5914 13.8232 17.4375 11.8285 17.4375 9.74454V8.51162C17.4375 8.02792 17.0695 7.62363 16.5879 7.57826L16.344 7.55527C15.2521 7.4524 14.1973 7.10523 13.2577 6.53948L12.8705 6.30631Z"
                fill="white"
            />
        </Svg>
    )
}
