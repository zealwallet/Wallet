import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const BoldCrossRound = ({ size, color }: Props) => {
    return (
        <Svg
            color={color && colors[color]}
            style={{ flexShrink: 0 }}
            viewBox="0 0 40 40"
            width={size}
            height={size}
            fill="none"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40ZM12.5858 12.5858C13.3668 11.8047 14.6332 11.8047 15.4142 12.5858L20.0001 17.1717L24.586 12.5858C25.3671 11.8047 26.6334 11.8047 27.4145 12.5858C28.1955 13.3668 28.1955 14.6332 27.4145 15.4142L22.8285 20.0001L27.4142 24.5858C28.1953 25.3668 28.1953 26.6332 27.4142 27.4142C26.6332 28.1953 25.3668 28.1953 24.5858 27.4142L20.0001 22.8285L15.4145 27.4142C14.6334 28.1953 13.3671 28.1953 12.586 27.4142C11.805 26.6332 11.805 25.3668 12.586 24.5858L17.1717 20.0001L12.5858 15.4142C11.8047 14.6332 11.8047 13.3668 12.5858 12.5858Z"
                fill="currentColor"
            />
        </Svg>
    )
}
