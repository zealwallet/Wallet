import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Cellular = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            width={size}
            height={size}
            fill="none"
            viewBox="0 0 32 32"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 8C10 7.44772 10.4477 7 11 7H21C21.5523 7 22 7.44772 22 8V24C22 24.5523 21.5523 25 21 25H11C10.4477 25 10 24.5523 10 24V8ZM12 10H20V21H12V10ZM16 24C16.5523 24 17 23.5523 17 23C17 22.4477 16.5523 22 16 22C15.4477 22 15 22.4477 15 23C15 23.5523 15.4477 24 16 24Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
