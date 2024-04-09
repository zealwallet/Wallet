import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const Plus = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 28 28"
        fill="none"
        width={size}
        height={size}
        color={color && colors[color]}
    >
        <Path
            d="M14 23V5"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
        />
        <Path
            d="M5 14L23 14"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
        />
    </Svg>
)
