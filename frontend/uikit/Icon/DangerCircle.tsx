import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const DangerCircle = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 20 20"
        width={size}
        height={size}
        color={color && colors[color]}
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 10C0 4.481 4.48 0 10 0C15.53 0 20 4.481 20 10C20 15.521 15.53 20 10 20C4.48 20 0 15.521 0 10ZM9.11914 6.20813C9.11914 5.72913 9.51914 5.32812 9.99914 5.32812C10.4791 5.32812 10.8691 5.72913 10.8691 6.20813V10.6281C10.8691 11.1091 10.4791 11.4981 9.99914 11.4981C9.51914 11.4981 9.11914 11.1091 9.11914 10.6281V6.20813ZM10.0109 14.6797C9.52086 14.6797 9.13086 14.2797 9.13086 13.7997C9.13086 13.3197 9.52086 12.9297 10.0009 12.9297C10.4909 12.9297 10.8809 13.3197 10.8809 13.7997C10.8809 14.2797 10.4909 14.6797 10.0109 14.6797Z"
            fill="currentColor"
        />
    </Svg>
)
