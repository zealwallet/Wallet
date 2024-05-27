import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const Swap = ({ size, color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 14 14"
            fill="none"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                d="M10.2278 12.443V3.3645"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M12.9448 9.71094L10.2263 12.442L7.50781 9.71094"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M3.60768 1.55469V10.6332"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M0.889648 4.2858L3.60817 1.55469L6.32669 4.2858"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    )
}
