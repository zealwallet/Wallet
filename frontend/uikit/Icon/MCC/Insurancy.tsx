import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Insurancy = ({ size, color }: Props) => {
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
                d="M16 11.5C16 11.5 14.5 9 12 9C9.5 9 8 11 8 13C8 15 10 17 10 17L15.6464 22.6464C15.8417 22.8417 16.1583 22.8417 16.3536 22.6464L22 17C22 17 24 15 24 13C24 11 22.5 9 20 9C17.5 9 16 11.5 16 11.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
