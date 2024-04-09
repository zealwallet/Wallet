import React from 'react'
import { Circle, G, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const Step = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        color={color && colors[color]}
        height={size}
        viewBox="0 0 16 17"
        fill="none"
        width={size}
    >
        <G>
            <Circle
                id="Ellipse 1254"
                cx="8"
                cy="8.5"
                r="8"
                fill="currentColor"
            />
        </G>
    </Svg>
)
