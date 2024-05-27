import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const TollRoad = ({ size, color }: Props) => {
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
                d="M19.5 7H17V12.5H20.5694L19.5 7ZM12.5 7H15V12.5H11.4306L12.5 7ZM10.4583 17.5H15V25H9L10.4583 17.5ZM23 25H17V17.5H21.5417L23 25ZM8.5 14C8.22386 14 8 14.2239 8 14.5V15.5C8 15.7761 8.22386 16 8.5 16H8.8L8.5 17.5H9.5L10.4 16H21.6L22.5 17.5H23.5L23.2 16H23.5C23.7761 16 24 15.7761 24 15.5V14.5C24 14.2239 23.7761 14 23.5 14H8.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
