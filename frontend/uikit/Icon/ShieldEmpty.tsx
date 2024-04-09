import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const ShieldEmpty = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 48 48"
            fill="none"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                d="M41.6013 12.0522C41.6013 10.5224 40.5948 9.14764 39.1052 8.65734L25.8398 4.2074C25.0346 3.93087 24.169 3.93087 23.3839 4.2074L10.1588 8.83385C8.68929 9.34572 7.6828 10.7166 7.70293 12.2463L7.78345 25.5256C7.80358 29.546 9.33344 33.4488 12.0711 36.469C13.3191 37.8615 14.9094 39.0382 16.9425 40.0972L24.1489 43.8235C24.3703 43.9412 24.632 44 24.8735 44C25.1151 44 25.3567 43.9412 25.5781 43.8235L32.7241 39.9992C34.7371 38.9205 36.3273 37.7242 37.5552 36.3121C40.2526 33.2507 41.7221 29.3479 41.7019 25.3275L41.6013 12.0522Z"
                fill="currentColor"
            />
        </Svg>
    )
}
