import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const BoldCrossSquare = ({ size, color }: Props) => {
    return (
        <Svg
            color={color && colors[color]}
            style={{ flexShrink: 0 }}
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.67 2H16.34C19.73 2 22 4.38 22 7.92V16.091C22 19.621 19.73 22 16.34 22H7.67C4.28 22 2 19.621 2 16.091V7.92C2 4.38 4.28 2 7.67 2ZM8.29289 8.29289C8.68342 7.90237 9.31658 7.90237 9.70711 8.29289L12.0001 10.5858L14.293 8.29289C14.6835 7.90237 15.3167 7.90237 15.7072 8.29289C16.0978 8.68342 16.0978 9.31658 15.7072 9.70711L13.4143 12.0001L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L12.0001 13.4143L9.70723 15.7071C9.3167 16.0976 8.68354 16.0976 8.29302 15.7071C7.90249 15.3166 7.90249 14.6834 8.29302 14.2929L10.5858 12.0001L8.29289 9.70711C7.90237 9.31658 7.90237 8.68342 8.29289 8.29289Z"
                fill="currentColor"
            />
        </Svg>
    )
}
