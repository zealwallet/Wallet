import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const BoldCrossMedium = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            color={color && colors[color]}
            height={size}
            viewBox="0 0 24 24"
            width={size}
            fill="none"
        >
            <Path
                d="M8.70711 7.29289C8.31658 6.90237 7.68342 6.90237 7.29289 7.29289C6.90237 7.68342 6.90237 8.31658 7.29289 8.70711L10.5859 12.0001L7.29314 15.2929C6.90261 15.6834 6.90261 16.3166 7.29314 16.7071C7.68366 17.0976 8.31683 17.0976 8.70735 16.7071L12.0001 13.4143L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L13.4143 12.0001L16.7074 8.70711C17.0979 8.31658 17.0979 7.68342 16.7074 7.29289C16.3168 6.90237 15.6837 6.90237 15.2931 7.29289L12.0001 10.5859L8.70711 7.29289Z"
                fill="currentColor"
            />
        </Svg>
    )
}
