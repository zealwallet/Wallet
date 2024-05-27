import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Laundry = ({ size, color }: Props) => {
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
                d="M9.875 7H22.125C22.6082 7 23 7.40294 23 7.9V24.1C23 24.5971 22.6082 25 22.125 25H9.875C9.39175 25 9 24.5971 9 24.1V7.9C9 7.40294 9.39175 7 9.875 7ZM21 10C21 10.5523 20.5523 11 20 11C19.4477 11 19 10.5523 19 10C19 9.44772 19.4477 9 20 9C20.5523 9 21 9.44772 21 10ZM17 11C17.5523 11 18 10.5523 18 10C18 9.44772 17.5523 9 17 9C16.4477 9 16 9.44772 16 10C16 10.5523 16.4477 11 17 11ZM16 13C18.7614 13 21 15.2386 21 18C21 20.7614 18.7614 23 16 23C13.2386 23 11 20.7614 11 18C11 15.2386 13.2386 13 16 13ZM16 21.4C17.9882 21.4 19.6 19.7882 19.6 17.8C18.6253 16.8253 17.3913 17.3227 16.1335 17.8298C14.8265 18.3567 13.4939 18.8939 12.4 17.8C12.4 19.7882 14.0118 21.4 16 21.4Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
