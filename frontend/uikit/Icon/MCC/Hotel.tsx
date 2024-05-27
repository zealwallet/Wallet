import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Hotel = ({ size, color }: Props) => {
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
                d="M7 10.5C7 10.2239 7.22386 10 7.5 10H8.5C8.77614 10 9 10.2239 9 10.5V17H24.5C24.7761 17 25 17.2239 25 17.5V18.5V19.5V22.5C25 22.7761 24.7761 23 24.5 23H23.5C23.2239 23 23 22.7761 23 22.5V20H9V22.5C9 22.7761 8.77614 23 8.5 23H7.5C7.22386 23 7 22.7761 7 22.5V19.5V18.5V17.5V10.5ZM12.25 15.5C13.2165 15.5 14 14.7165 14 13.75C14 12.7835 13.2165 12 12.25 12C11.2835 12 10.5 12.7835 10.5 13.75C10.5 14.7165 11.2835 15.5 12.25 15.5ZM16.5 12.5C15.6716 12.5 15 13.1716 15 14C15 14.8284 15.6716 15.5 16.5 15.5H22.5C23.3284 15.5 24 14.8284 24 14C24 13.1716 23.3284 12.5 22.5 12.5H16.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
