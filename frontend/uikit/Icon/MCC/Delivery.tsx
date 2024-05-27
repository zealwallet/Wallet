import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Delivery = ({ size, color }: Props) => {
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
                d="M8.5 8C8.22386 8 8 8.22386 8 8.5V10.5C8 10.7761 8.22386 11 8.5 11H9H23H23.5C23.7761 11 24 10.7761 24 10.5V8.5C24 8.22386 23.7761 8 23.5 8H8.5ZM9 23.5V12.5H23V23.5C23 23.7761 22.7761 24 22.5 24H9.5C9.22386 24 9 23.7761 9 23.5ZM13.5 14C13.2239 14 13 14.2239 13 14.5V15.5C13 15.7761 13.2239 16 13.5 16H18.5C18.7761 16 19 15.7761 19 15.5V14.5C19 14.2239 18.7761 14 18.5 14H13.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
