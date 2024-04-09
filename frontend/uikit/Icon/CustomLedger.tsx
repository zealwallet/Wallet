import React from 'react'
import { Circle, Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const CustomLedger = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 12 12"
        fill="none"
        width={size}
        height={size}
        color={color && colors[color]}
    >
        <Circle cx="6" cy="6" r="6" fill="#132736" />
        <Path
            d="M4.28613 2.57129V8.99986H8.48886V8.15508H5.21811V2.57129H4.28613Z"
            fill="white"
        />
    </Svg>
)
