import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const BoldTickSmall = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 24 24"
            height={size}
            width={size}
            color={color && colors[color]}
            fill="none"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.4571 8.79289C16.8476 9.18342 16.8476 9.81658 16.4571 10.2071L11.4571 15.2071C11.0666 15.5976 10.4334 15.5976 10.0429 15.2071L7.54289 12.7071C7.15237 12.3166 7.15237 11.6834 7.54289 11.2929C7.93342 10.9024 8.56658 10.9024 8.95711 11.2929L10.75 13.0858L15.0429 8.79289C15.4334 8.40237 16.0666 8.40237 16.4571 8.79289Z"
                fill="currentColor"
            />
        </Svg>
    )
}
