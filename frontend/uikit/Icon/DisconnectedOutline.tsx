import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const DisconnectedOutline = ({ size, color }: Props) => (
    <SvgIcon
        viewBox="0 0 24 24"
        width={size}
        height={size}
        color={color && colors[color]}
        fill="none"
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.96967 5.03025C3.67678 4.73736 3.67678 4.26249 3.96967 3.96959C4.26256 3.6767 4.73744 3.6767 5.03033 3.96959L20.0303 18.9696C20.3232 19.2625 20.3232 19.7374 20.0303 20.0303C19.7374 20.3231 19.2626 20.3231 18.9697 20.0303L14.2982 15.3588L12.7071 16.9499C11.3262 18.3307 9.18694 18.4909 7.63009 17.4305L5.03033 20.0303L3.96967 18.9696L6.56947 16.3698C5.50918 14.813 5.66943 12.6738 7.05023 11.293L8.64133 9.70192L3.96967 5.03025ZM9.70199 10.7626L8.11089 12.3537C7.13458 13.33 7.13458 14.9129 8.11089 15.8892C9.08721 16.8655 10.6701 16.8655 11.6464 15.8892L13.2375 14.2981L9.70199 10.7626Z"
            fill="currentColor"
        />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.9497 9.70733C21.5118 8.14524 21.5118 5.61258 19.9497 4.05048C18.3876 2.48838 15.855 2.48838 14.2929 4.05048L12.1716 6.1718L17.8284 11.8287L19.9497 9.70733ZM15.3535 5.11114L14.2929 6.1718L17.8284 9.70733L18.8891 8.64667C19.8654 7.67036 19.8654 6.08745 18.8891 5.11114C17.9128 4.13483 16.3299 4.13483 15.3535 5.11114Z"
            fill="currentColor"
        />
    </SvgIcon>
)
