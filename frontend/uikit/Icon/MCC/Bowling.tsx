import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Bowling = ({ size, color }: Props) => {
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
                d="M16 25C20.9706 25 25 20.9706 25 16C25 11.0294 20.9706 7 16 7C11.0294 7 7 11.0294 7 16C7 20.9706 11.0294 25 16 25ZM12 13C12.8284 13 13.5 12.3284 13.5 11.5C13.5 10.6716 12.8284 10 12 10C11.1716 10 10.5 10.6716 10.5 11.5C10.5 12.3284 11.1716 13 12 13ZM17.5 12C17.5 12.8284 16.8284 13.5 16 13.5C15.1716 13.5 14.5 12.8284 14.5 12C14.5 11.1716 15.1716 10.5 16 10.5C16.8284 10.5 17.5 11.1716 17.5 12ZM13.5 16.5C14.3284 16.5 15 15.8284 15 15C15 14.1716 14.3284 13.5 13.5 13.5C12.6716 13.5 12 14.1716 12 15C12 15.8284 12.6716 16.5 13.5 16.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
