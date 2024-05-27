import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Purchase = ({ size, color }: Props) => {
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
                d="M11.5 10.5H23.4925C24.0489 10.5 24.3633 10.9329 24.2014 11.4456L21.7986 19.0544C21.6337 19.5766 21.0442 20 20.4975 20H10.5025C9.94882 20 9.5 19.5545 9.5 19.0013V10.499C9.5 9.94266 9.05228 9.5 8.5 9.5C7.94386 9.5 7.5 9.05228 7.5 8.5C7.5 7.94386 7.95191 7.5 8.50937 7.5H9.5C10.6123 7.5 11.5 8.39762 11.5 9.50488V10.5V10.5ZM11 24.5C11.8284 24.5 12.5 23.8284 12.5 23C12.5 22.1716 11.8284 21.5 11 21.5C10.1716 21.5 9.5 22.1716 9.5 23C9.5 23.8284 10.1716 24.5 11 24.5ZM18 24.5C18.8284 24.5 19.5 23.8284 19.5 23C19.5 22.1716 18.8284 21.5 18 21.5C17.1716 21.5 16.5 22.1716 16.5 23C16.5 23.8284 17.1716 24.5 18 24.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
