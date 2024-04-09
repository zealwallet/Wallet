import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const Rocket = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            color={color && colors[color]}
            height={size}
            viewBox="0 0 48 48"
            width={size}
        >
            <Path
                d="M18.3805 12.7C14.3005 17.28 11.5005 23.86 11.2405 24.48L6.72052 22.54C5.42052 21.98 5.10052 20.28 6.10052 19.28L12.1205 13.26C13.0605 12.32 14.4205 11.9 15.7405 12.16L18.3805 12.7ZM21.3605 33.02C21.9605 33.62 22.8405 33.78 23.6005 33.42C25.9205 32.34 30.9005 29.8 34.1205 26.58C43.3005 17.4 43.3805 9.92001 42.8405 6.72001C42.7005 5.92001 42.0605 5.28001 41.2605 5.14001C38.0605 4.60001 30.5805 4.68001 21.4005 13.86C18.1805 17.08 15.6605 22.06 14.5605 24.38C14.2005 25.14 14.3805 26.04 14.9605 26.62L21.3605 33.02ZM35.3005 29.62C30.7205 33.7 24.1405 36.5 23.5205 36.76L25.4605 41.28C26.0205 42.58 27.7205 42.9 28.7205 41.9L34.7405 35.88C35.6805 34.94 36.1005 33.58 35.8405 32.26L35.3005 29.62ZM17.8805 34.82C18.2805 36.94 17.5805 38.9 16.2405 40.24C14.7005 41.78 9.92052 42.92 6.82052 43.52C5.44052 43.78 4.22052 42.56 4.48052 41.18C5.08052 38.08 6.20052 33.3 7.76052 31.76C9.10052 30.42 11.0605 29.72 13.1805 30.12C15.5205 30.56 17.4405 32.48 17.8805 34.82ZM26.0005 18C26.0005 15.8 27.8005 14 30.0005 14C32.2005 14 34.0005 15.8 34.0005 18C34.0005 20.2 32.2005 22 30.0005 22C27.8005 22 26.0005 20.2 26.0005 18Z"
                fill="currentColor"
            />
        </Svg>
    )
}
