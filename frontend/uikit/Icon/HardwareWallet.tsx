import React from 'react'
import Svg, { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'

type Props = {
    color?: Color
    size: number
}

export const HardwareWallet = ({ color, size }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 28 28"
        fill="none"
        color={color && colors[color]}
        width={size}
        height={size}
    >
        <Path
            d="M18.167 9.0026V2.33594H9.83366V9.0026H8.16699V20.6693C8.16699 23.431 10.4053 25.6693 13.167 25.6693H14.8337C17.5954 25.6693 19.8337 23.431 19.8337 20.6693V9.0026H18.167ZM13.167 5.66927H11.5003V4.0026H13.167V5.66927ZM16.5003 5.66927H14.8337V4.0026H16.5003V5.66927Z"
            fill="currentColor"
        />
    </Svg>
)
