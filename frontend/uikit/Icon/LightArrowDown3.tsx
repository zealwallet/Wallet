import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const LightArrowDown3 = ({ size, color }: Props) => (
    <SvgIcon
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
    </SvgIcon>
)
