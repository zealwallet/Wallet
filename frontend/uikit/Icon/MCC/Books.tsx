import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Books = ({ size, color }: Props) => {
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
                d="M22 7C22.2761 7 22.5 7.22386 22.5 7.5V20C22.5 20.2761 22.2761 20.5 22 20.5H12.5C11.6716 20.5 11 21.1716 11 22C11 22.8284 11.6716 23.5 12.5 23.5H22C22.2761 23.5 22.5 23.7239 22.5 24V24.5C22.5 24.7761 22.2761 25 22 25H11.5C10.3954 25 9.5 24.1046 9.5 23V9C9.5 7.89543 10.3954 7 11.5 7H22ZM12 22C12 21.7239 12.2239 21.5 12.5 21.5H21.5C21.7761 21.5 22 21.7239 22 22C22 22.2761 21.7761 22.5 21.5 22.5H12.5C12.2239 22.5 12 22.2761 12 22ZM13 10C12.7239 10 12.5 10.2239 12.5 10.5V12.5C12.5 12.7761 12.7239 13 13 13H19.5C19.7761 13 20 12.7761 20 12.5V10.5C20 10.2239 19.7761 10 19.5 10H13Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
