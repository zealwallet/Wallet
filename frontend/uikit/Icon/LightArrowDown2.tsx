import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const LightArrowDown2 = ({ size, color }: Props) => (
    <SvgIcon
        viewBox="0 0 24 24"
        fill="none"
        width={size}
        height={size}
        color={color && colors[color]}
    >
        <Path
            d="M19 8.5L12 15.5L5 8.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </SvgIcon>
)
