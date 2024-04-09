import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const BoldSwapHorizon = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 24 24"
            width={size}
            height={size}
            color={color && colors[color]}
            fill="none"
        >
            <Path
                d="M5.98669 10.5L0.666687 15.8333L5.98669 21.1667V17.1667H15.3334V14.5H5.98669V10.5ZM24.6667 7.83333L19.3467 2.5V6.5H10V9.16667H19.3467V13.1667L24.6667 7.83333Z"
                fill="currentColor"
            />
        </Svg>
    )
}
