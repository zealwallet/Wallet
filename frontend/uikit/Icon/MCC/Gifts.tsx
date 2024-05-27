import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Gifts = ({ size, color }: Props) => {
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
                d="M12.5 8C10.5623 8 9 9.33913 9 11C9 11.364 9.04811 11.698 9.13748 12.0002H9C8.44772 12.0002 8 12.448 8 13.0002V14.0002C8 14.5524 8.44772 15.0002 9 15.0002V15.0014H15V12.0009H17V15.0014H23V15.0002C23.5523 15.0002 24 14.5524 24 14.0001V13.0002C24 12.448 23.5523 12.0002 23 12.0002H22.8625C22.9519 11.698 23 11.364 23 11C23 9.33913 21.4377 8 19.5 8C17.9428 8 16.7846 8.79165 16 10.0671C15.2154 8.79165 14.0572 8 12.5 8ZM15 16.5014H9V23C9 23.5523 9.44772 24 10 24H15V16.5014ZM17 24V16.5014H23V23C23 23.5523 22.5523 24 22 24H17ZM12 12C11.3569 12 11 11.5 11 11C11 10.5 11.5 10 12.5 10C13.5 10 15 10.5 15 12H12ZM21 11C21 11.5 20.6431 12 20 12H17C17 10.5 18.5 10 19.5 10C20.5 10 21 10.5 21 11Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
