import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const Logo = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            color={color && colors[color]}
            viewBox="0 0 12 12"
            width={size}
            height={size}
        >
            <Path
                d="M0 12H12V6.6H2.4C1.07452 6.6 0 7.67452 0 9V12Z"
                fill="currentColor"
            />
            <Path
                d="M12 0H0V5.4H9.6C10.9255 5.4 12 4.32548 12 3V0Z"
                fill="currentColor"
            />
        </Svg>
    )
}
