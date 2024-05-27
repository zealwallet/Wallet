import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const LightArrowUp2 = ({ size, color }: Props) => (
    <SvgIcon
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
    </SvgIcon>
)
