import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Telephony = ({ size, color }: Props) => {
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
                d="M17 7C16.4477 7 16 7.44772 16 8V9H12C11.4477 9 11 9.44772 11 10V21C11 21.5523 11.4477 22 12 22H17C17.5523 22 18 21.5523 18 21V10V8C18 7.44772 17.5523 7 17 7ZM9 21H10V21.5C10 22.6046 10.8954 23.5 12 23.5H17C18.1046 23.5 19 22.6046 19 21.5V21H23C23.5523 21 24 21.4477 24 22V24C24 24.5523 23.5523 25 23 25H9C8.44772 25 8 24.5523 8 24V22C8 21.4477 8.44772 21 9 21ZM21.5 22C21.2239 22 21 22.2239 21 22.5V23C21 23.2761 21.2239 23.5 21.5 23.5H22.5C22.7761 23.5 23 23.2761 23 23V22.5C23 22.2239 22.7761 22 22.5 22H21.5ZM12 11.5C12 11.2239 12.2239 11 12.5 11H16.5C16.7761 11 17 11.2239 17 11.5V15.5C17 15.7761 16.7761 16 16.5 16H12.5C12.2239 16 12 15.7761 12 15.5V11.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
