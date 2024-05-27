import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    color?: Color
    size: number
}

export const ArrowDown = ({ color, size }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 15 15"
            color={color && colors[color]}
            width={size}
            height={size}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.56418 4.69113C3.73503 4.52027 4.01204 4.52027 4.18289 4.69113L7.95687 8.4651L11.7308 4.69113C11.9017 4.52027 12.1787 4.52027 12.3496 4.69113C12.5204 4.86198 12.5204 5.13899 12.3496 5.30985L8.26623 9.39318C8.09537 9.56403 7.81836 9.56403 7.64751 9.39318L3.56418 5.30985C3.39332 5.13899 3.39332 4.86198 3.56418 4.69113Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
