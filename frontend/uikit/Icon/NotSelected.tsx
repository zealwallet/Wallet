import React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'

type Props = {
    size: number
    color?: Color
}

export const NotSelected = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 20 20"
        width={size}
        height={size}
        color={color && colors[color]}
        fill="none"
    >
        <G clipPath="url(#clip0_5576_513896)">
            <Path
                d="M0.5 10C0.5 4.76198 4.76198 0.5 10 0.5C15.238 0.5 19.5 4.76198 19.5 10C19.5 15.238 15.238 19.5 10 19.5C4.76198 19.5 0.5 15.238 0.5 10Z"
                stroke="currentColor"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_5576_513896">
                <Rect width="20" height="20" fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
