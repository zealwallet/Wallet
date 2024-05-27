import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Media = ({ size, color }: Props) => {
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
                d="M11 22.3403C11 23.1405 11.8931 23.6165 12.5574 23.1705L22.0161 16.8201C22.6067 16.4236 22.6061 15.5547 22.015 15.1589L12.5563 8.8263C11.8919 8.38147 11 8.85768 11 9.65726V22.3403Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
