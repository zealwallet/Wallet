import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const ThreeDotVertical = ({ size, color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 24 24"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                d="M12 19.25C11.5858 19.25 11.25 18.9142 11.25 18.5C11.25 18.0858 11.5858 17.75 12 17.75C12.4142 17.75 12.75 18.0858 12.75 18.5C12.75 18.9142 12.4142 19.25 12 19.25ZM12 13.25C11.5858 13.25 11.25 12.9142 11.25 12.5C11.25 12.0858 11.5858 11.75 12 11.75C12.4142 11.75 12.75 12.0858 12.75 12.5C12.75 12.9142 12.4142 13.25 12 13.25ZM12 7.25C11.5858 7.25 11.25 6.91421 11.25 6.5C11.25 6.08579 11.5858 5.75 12 5.75C12.4142 5.75 12.75 6.08579 12.75 6.5C12.75 6.91421 12.4142 7.25 12 7.25Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </SvgIcon>
    )
}
