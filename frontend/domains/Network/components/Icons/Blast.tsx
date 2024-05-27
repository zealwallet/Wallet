import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

type Props = {
    size: number
}

export const Blast = ({ size }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 120 120"
            width={size}
            height={size}
            fill="none"
        >
            <Circle cx="60" cy="60" r="60" fill="black" />
            <Path
                d="M23 43.883L85.4678 44.1696L85.7544 45.0292L82.3158 54.4854H57.6725L55.0936 60.7895V62.2222H79.7368L80.0234 62.7953L76.0117 74.5439H41.0526L40.7661 73.6842L47.6433 51.6199L39.6199 45.8889L27.5848 84H73.4328L84.8947 78.269L88.9064 64.8012L81.4561 59.0702L93.2047 53.0526L96.9298 40.731L89.193 35H34.7485L23 43.883Z"
                fill="#FFFF00"
            />
        </Svg>
    )
}
