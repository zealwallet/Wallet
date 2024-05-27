import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const NetworkSelector = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            height={size}
            width={size}
            fill="none"
            viewBox="0 0 24 24"
        >
            <Path
                fill="currentColor"
                d="M2 6a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Z"
            />
            <Path
                fill="currentColor"
                d="M5 12a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"
            />
            <Path
                fill="currentColor"
                d="M9 18a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Z"
            />
        </SvgIcon>
    )
}
