import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const SolidStatusKey = ({ size, color }: Props) => {
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
                d="M1.25 12C1.25 8.82436 3.82436 6.25 7 6.25C9.18057 6.25 11.0762 7.46371 12.0508 9.25H21C21.9665 9.25 22.75 10.0335 22.75 11V13.5C22.75 13.9142 22.4142 14.25 22 14.25H19.75V16C19.75 16.4142 19.4142 16.75 19 16.75H16.5C16.0858 16.75 15.75 16.4142 15.75 16V14.25H12.2929C11.4174 16.3068 9.37807 17.75 7 17.75C3.82436 17.75 1.25 15.1756 1.25 12ZM7 10C5.89543 10 5 10.8954 5 12C5 13.1046 5.89543 14 7 14C8.10457 14 9 13.1046 9 12C9 10.8954 8.10457 10 7 10Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
