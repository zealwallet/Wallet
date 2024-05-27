import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Medicine = ({ size, color }: Props) => {
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
                d="M14.5 8C14.2239 8 14 8.22386 14 8.5V14H8.5C8.22386 14 8 14.2239 8 14.5V17.5C8 17.7761 8.22386 18 8.5 18H14V23.5C14 23.7761 14.2239 24 14.5 24H17.5C17.7761 24 18 23.7761 18 23.5V18H23.5C23.7761 18 24 17.7761 24 17.5V14.5C24 14.2239 23.7761 14 23.5 14H18V8.5C18 8.22386 17.7761 8 17.5 8H14.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
