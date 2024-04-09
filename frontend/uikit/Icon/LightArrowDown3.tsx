import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const LightArrowDown3 = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 16 16"
        fill="none"
        width={size}
        height={size}
        color={color && colors[color]}
    >
        <Path
            d="M8.18294 13.1665V3.1665"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M12.1992 9.1333L8.18317 13.1666L4.1665 9.1333"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)
