import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const LightDownload = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 24 24"
        fill="none"
        width={size}
        color={color && colors[color]}
        height={size}
    >
        <Path
            d="M12.1413 15.0088L12.1413 0.960937"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M15.5439 11.5938L12.1419 15.0098L8.73995 11.5937"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M17.5461 6.48437H18.6346C21.0088 6.48438 22.9326 8.40821 22.9326 10.7835L22.9326 16.4815C22.9326 18.8499 21.0135 20.769 18.6451 20.769L5.64845 20.769C3.27428 20.769 1.34928 18.844 1.34928 16.4699L1.34928 10.7707C1.34928 8.40354 3.26962 6.48437 5.63678 6.48437L6.73578 6.48437"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)
