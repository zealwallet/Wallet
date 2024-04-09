import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const BoldAdd = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        color={color && colors[color]}
        fill="none"
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.75 3C12.1977 3 11.75 3.44772 11.75 4V11L4.75 11C4.19772 11 3.75 11.4477 3.75 12C3.75 12.5523 4.19772 13 4.75 13H11.75V20C11.75 20.5523 12.1977 21 12.75 21C13.3023 21 13.75 20.5523 13.75 20V13H20.75C21.3023 13 21.75 12.5523 21.75 12C21.75 11.4477 21.3023 11 20.75 11L13.75 11V4C13.75 3.44772 13.3023 3 12.75 3Z"
            fill="currentColor"
        />
    </Svg>
)
