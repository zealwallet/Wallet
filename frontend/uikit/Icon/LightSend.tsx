import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const LightSend = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        color={color && colors[color]}
        fill="none"
    >
        <Path
            d="M16.0825 8.17463L10.359 13.9592L3.84944 9.88767C2.91675 9.30414 3.11077 7.88744 4.16572 7.57893L19.6212 3.05277C20.5873 2.76963 21.4826 3.67283 21.1956 4.642L16.6231 20.0868C16.3098 21.1432 14.9012 21.332 14.3232 20.3953L10.356 13.9602"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)
