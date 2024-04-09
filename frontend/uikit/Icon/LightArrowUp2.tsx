import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'

type Props = {
    size: number
    color?: Color
}

export const LightArrowUp2 = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 24 24"
        fill="none"
        width={size}
        height={size}
        color={color && colors[color]}
    >
        <Path
            d="M5 15.5L12 8.5L19 15.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)
