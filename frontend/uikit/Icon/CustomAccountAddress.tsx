import React from 'react'
import Svg, { Path } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const CustomAccountAddress = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 22 22"
        fill="none"
        width={size}
        height={size}
        color={color && colors[color]}
    >
        <Path
            d="M10.9993 3.92871C9.2241 3.92871 7.78502 5.3678 7.78502 7.143C7.78502 8.9182 9.2241 10.3573 10.9993 10.3573C12.7745 10.3573 14.2136 8.9182 14.2136 7.143C14.2136 5.3678 12.7745 3.92871 10.9993 3.92871Z"
            fill="currentColor"
        />
        <Path
            d="M7.57073 12.0716C5.79553 12.0716 4.35645 13.5107 4.35645 15.2859V16.3044C4.35645 16.95 4.82435 17.5005 5.46154 17.6045C9.1291 18.2033 12.8695 18.2033 16.5371 17.6045C17.1743 17.5005 17.6422 16.95 17.6422 16.3044V15.2859C17.6422 13.5107 16.2031 12.0716 14.4279 12.0716H14.1357C13.9776 12.0716 13.8204 12.0966 13.6701 12.1457L12.9282 12.3879C11.6748 12.7972 10.3238 12.7972 9.07038 12.3879L8.32851 12.1457C8.17818 12.0966 8.02104 12.0716 7.8629 12.0716H7.57073Z"
            fill="currentColor"
        />
    </Svg>
)
