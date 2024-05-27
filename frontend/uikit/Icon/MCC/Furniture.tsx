import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Furniture = ({ size, color }: Props) => {
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
                d="M8 13.5C8 11.8431 9.34315 10.5 11 10.5H21C22.6569 10.5 24 11.8431 24 13.5H23C21.6193 13.5 20.5 14.6193 20.5 16V16.5H11.47V16C11.47 14.6193 10.3507 13.5 8.97 13.5L8 13.5ZM10 21H22V22.5C22 22.7761 22.2239 23 22.5 23H23.5C23.7761 23 24 22.7761 24 22.5V21H24.5C24.7761 21 25 20.7761 25 20.5V16C25 15.4477 24.5523 15 24 15H23C22.4477 15 22 15.4477 22 16V18H10V16C10 15.4477 9.55228 15 9 15H8C7.44772 15 7 15.4477 7 16V20.5C7 20.7761 7.22386 21 7.5 21H8V22.5C8 22.7761 8.22386 23 8.5 23H9.5C9.77614 23 10 22.7761 10 22.5V21Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
