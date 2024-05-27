import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Alcohol = ({ size, color }: Props) => {
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
                d="M11 7H13C13.2761 7 13.5 7.20351 13.5 7.45455V9H10.5V7.45455C10.5 7.20351 10.7239 7 11 7ZM10.5 10H13.5V12.2908C14.9659 12.8841 16 14.3213 16 16V24.5C16 24.7761 15.7761 25 15.5 25H8.5C8.22386 25 8 24.7761 8 24.5V16C8 14.3213 9.03408 12.8841 10.5 12.2908V10ZM14 17H10V23H14V17ZM23.5 24H21.75V20.8897C23.0439 20.5012 24 19.1309 24 17.5C24 15.567 22.6569 14 21 14C19.3431 14 18 15.567 18 17.5C18 19.1309 18.9561 20.5012 20.25 20.8897V24H18.5V25H23.5V24Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
