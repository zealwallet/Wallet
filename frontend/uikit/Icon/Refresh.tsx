import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const Refresh = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            width={size}
            height={size}
            fill="none"
            viewBox="0 0 24 24"
        >
            <Path
                fill="currentColor"
                d="M5.644 7.502a.874.874 0 0 1-.568-1.217L7.01 2.166a.874.874 0 0 1 1.583.002l.854 1.83a.884.884 0 0 1 .095-.032 9.497 9.497 0 1 1-6.76 6.879.874.874 0 0 1 1.696.424 7.749 7.749 0 1 0 5.719-5.666l.861 1.845a.874.874 0 0 1-1.015 1.215l-4.4-1.16Z"
            />
        </SvgIcon>
    )
}
