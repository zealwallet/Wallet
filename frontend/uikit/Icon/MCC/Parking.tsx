import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Parking = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 8C8.44772 8 8 8.44772 8 9V23C8 23.5523 8.44772 24 9 24H23C23.5523 24 24 23.5523 24 23V9C24 8.44772 23.5523 8 23 8H9ZM14.5 10H12.5V21.5C12.5 21.7761 12.7239 22 13 22H14C14.2761 22 14.5 21.7761 14.5 21.5V18H16.5C18.5 18 20.5 17 20.5 14C20.5 11 18.5 10 16.5 10H14.5ZM16.5 12H14.5V16H16.5C17.5 16 18.5 15.5 18.5 14C18.5 12.5 17.5 12 16.5 12Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
