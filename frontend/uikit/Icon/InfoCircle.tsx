import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const InfoCircle = ({ size, color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 18 18"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.4375 9C2.4375 5.37563 5.37563 2.4375 9 2.4375C12.6244 2.4375 15.5625 5.37563 15.5625 9C15.5625 12.6244 12.6244 15.5625 9 15.5625C5.37563 15.5625 2.4375 12.6244 2.4375 9ZM9.75 6C9.75 6.41421 9.41421 6.75 9 6.75C8.58579 6.75 8.25 6.41421 8.25 6C8.25 5.58579 8.58579 5.25 9 5.25C9.41421 5.25 9.75 5.58579 9.75 6ZM9 8.0625C9.31066 8.0625 9.5625 8.31434 9.5625 8.625V12.375C9.5625 12.6857 9.31066 12.9375 9 12.9375C8.68934 12.9375 8.4375 12.6857 8.4375 12.375V8.625C8.4375 8.31434 8.68934 8.0625 9 8.0625Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
