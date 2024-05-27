import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const OutlineSearch = ({ size, color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 24 24"
            fill="none"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3854 15.446C11.7351 17.5687 7.85569 17.4016 5.3989 14.9448C2.76287 12.3088 2.76287 8.03494 5.3989 5.3989C8.03494 2.76287 12.3088 2.76287 14.9448 5.3989C17.4016 7.85569 17.5687 11.7351 15.446 14.3854L20.6017 19.541C20.8946 19.8339 20.8946 20.3088 20.6017 20.6017C20.3088 20.8946 19.8339 20.8946 19.541 20.6017L14.3854 15.446ZM6.45956 13.8842C4.40931 11.8339 4.40931 8.50982 6.45956 6.45956C8.50982 4.40931 11.8339 4.40931 13.8842 6.45956C15.9329 8.50831 15.9344 11.8291 13.8887 13.8797C13.8872 13.8812 13.8857 13.8827 13.8842 13.8842C13.8827 13.8857 13.8812 13.8872 13.8797 13.8887C11.8291 15.9344 8.50831 15.9329 6.45956 13.8842Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
