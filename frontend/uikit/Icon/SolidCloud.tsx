import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const SolidCloud = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 28 28"
            fill="none"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                d="M15.0881 5.4917C12.8581 5.4917 10.8996 6.64835 9.77761 8.3917C9.2164 8.24331 8.62756 8.16439 8.02129 8.16439C4.23558 8.16439 1.16666 11.2333 1.16666 15.019C1.16666 18.8047 4.23558 21.8737 8.02129 21.8737H21.6114C24.4964 21.8737 26.8352 19.5349 26.8352 16.6498C26.8352 13.7648 24.4964 11.426 21.6114 11.426C21.5367 11.426 21.4624 11.4276 21.3884 11.4307C21.1958 8.11839 18.4487 5.4917 15.0881 5.4917Z"
                fill="currentColor"
            />
        </Svg>
    )
}
