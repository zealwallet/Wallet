import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const ArrowLeft2 = ({ color, size }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 28 28"
            fill="none"
            color={color && colors[color]}
            width={size}
            height={size}
        >
            <Path
                d="M18.084 22.1663L9.91732 13.9997L18.084 5.83301"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    )
}
