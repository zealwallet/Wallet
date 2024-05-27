import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Tick = ({ size, color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 20 20"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                fill="currentColor"
                fillRule="evenodd"
                d="M16.006 5.853a.833.833 0 0 1 0 1.178l-6.993 6.993a1.25 1.25 0 0 1-1.78-.013L3.986 10.67A.833.833 0 1 1 5.18 9.507l2.953 3.04 6.693-6.694a.833.833 0 0 1 1.179 0Z"
                clipRule="evenodd"
            />
        </SvgIcon>
    )
}
