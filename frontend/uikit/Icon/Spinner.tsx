import React from 'react'
import Svg, { Path } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const Spinner = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            fill="none"
            viewBox="0 0 16 16"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                d="M14 8C14 8.55228 14.4477 9 15 9C15.5523 9 16 8.55228 16 8H14ZM8 14C4.68629 14 2 11.3137 2 8H0C0 12.4183 3.58172 16 8 16V14ZM2 8C2 4.68629 4.68629 2 8 2V0C3.58172 0 0 3.58172 0 8H2ZM8 2C11.3137 2 14 4.68629 14 8H16C16 3.58172 12.4183 0 8 0V2Z"
                fill="currentColor"
            />
        </Svg>
    )
}
