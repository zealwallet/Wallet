import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Charity = ({ size, color }: Props) => {
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
                d="M7 13.5C7 13.5 7 10 10 10C13 10 14 14 14 14C14 14 16 13.5 18 8C18 8 20.75 9.5 21 13C20.75 16.5 19 18 19 18C19 18 22 20 25 18C25 22 20 24 20 24C18 20 13.9349 22.3667 11.5 20.5C9.06515 18.6333 10.1585 14.9219 9.5 14C8.84151 13.0781 7 13.5 7 13.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
