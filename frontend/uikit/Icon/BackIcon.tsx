import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}
export const BackIcon = ({ color, size }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 24 24"
            color={color && colors[color]}
            width={size}
            height={size}
        >
            <Path
                fill="none"
                d="M16 4L8 12L16 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    )
}
