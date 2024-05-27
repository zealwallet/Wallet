import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const Clock = ({ size, color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 20 20"
            height={size}
            width={size}
            fill="none"
            color={color && colors[color]}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.3333 18.3337C5.73333 18.3337 2 14.6087 2 10.0003C2 5.40033 5.73333 1.66699 10.3333 1.66699C14.9417 1.66699 18.6667 5.40033 18.6667 10.0003C18.6667 14.6087 14.9417 18.3337 10.3333 18.3337ZM12.992 13.0917C13.092 13.1501 13.2003 13.1834 13.317 13.1834C13.5253 13.1834 13.7337 13.0751 13.8503 12.8751C14.0253 12.5834 13.9337 12.2001 13.6337 12.0167L10.667 10.2501V6.40006C10.667 6.05007 10.3837 5.77506 10.042 5.77506C9.70033 5.77506 9.41699 6.05007 9.41699 6.40006V10.6084C9.41699 10.8251 9.53366 11.0251 9.72533 11.1417L12.992 13.0917Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
