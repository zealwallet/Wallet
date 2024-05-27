import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Gas = ({ size, color }: Props) => {
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
                d="M17.5 24.9699C17.5 24.9699 22.75 24.699 22.75 19.1906C22.75 13.6823 19.3147 9.73913 14.5837 7C14.5536 11.3043 9.25 14.2843 9.25 19.2508C9.25 24.2174 14.5 24.9699 14.5 24.9699C14.5 24.9699 12.5 23.8963 12.5 22C12.5 20.1037 14 19 14 16C14 16 16 18.5 16 19.5C16 19.5 17 17.7692 17 13.5C17 13.5 20 16 20 20C20 24 17.5 24.9699 17.5 24.9699Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
