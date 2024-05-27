import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color: Color
    size: number
}

export const TickSquare = ({ color, size }: Props) => {
    return (
        <SvgIcon
            fill="none"
            viewBox="0 0 20 20"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.334 0.75H5.665C2.644 0.75 0.75 2.889 0.75 5.916V14.084C0.75 17.111 2.635 19.25 5.665 19.25H14.333C17.364 19.25 19.25 17.111 19.25 14.084V5.916C19.25 2.889 17.364 0.75 14.334 0.75Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M6.43945 10.0019L8.81345 12.3749L13.5595 7.62891"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    )
}
