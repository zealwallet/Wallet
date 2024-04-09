import React from 'react'
import { Circle, ClipPath, Defs, G, Path, Rect, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const Radio = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        color={color && colors[color]}
        height={size}
        viewBox="0 0 16 16"
        width={size}
        fill="none"
    >
        <G clipPath="url(#clip0_1164_7412)">
            <Path
                d="M0.5 8.5C0.5 4.36481 3.86481 1 8 1C12.1352 1 15.5 4.36481 15.5 8.5C15.5 12.6352 12.1352 16 8 16C3.86481 16 0.5 12.6352 0.5 8.5Z"
                stroke="currentColor"
            />
            <Circle cx="7.99995" cy="8.49922" r="4.8" fill="currentColor" />
        </G>
        <Defs>
            <ClipPath id="clip0_1164_7412">
                <Rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(0 0.5)"
                />
            </ClipPath>
        </Defs>
    </Svg>
)
