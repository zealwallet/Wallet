import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const BoldNetwork = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        color={color && colors[color]}
        height={size}
        viewBox="0 0 24 24"
        width={size}
        fill="none"
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.7688 8.42312C14.5151 7.87739 14.9998 6.99529 14.9998 5.99998C14.9998 4.34314 13.6566 3 11.9998 3C10.3429 3 8.9998 4.34314 8.9998 5.99998C8.9998 6.99557 9.48477 7.87789 10.2314 8.42358L6.87621 15.1339C6.59902 15.0494 6.30481 15.0039 5.99998 15.0039C4.34314 15.0039 3 16.347 3 18.0039C3 19.6607 4.34314 21.0039 5.99998 21.0039C7.48649 21.0039 8.72048 19.9227 8.9585 18.5038H15.0415C15.2795 19.9227 16.5135 21.0039 18 21.0039C19.6568 21.0039 21 19.6607 21 18.0039C21 16.347 19.6568 15.0039 18 15.0039C17.6953 15.0039 17.4012 15.0493 17.1242 15.1338L13.7688 8.42312ZM11.1258 8.87068L7.77033 15.5817C8.38815 16.034 8.82646 16.717 8.95848 17.5038H15.0415C15.1735 16.7169 15.612 16.0338 16.23 15.5815L12.8745 8.87045C12.5977 8.95467 12.304 8.99997 11.9998 8.99997C11.6958 8.99997 11.4024 8.95475 11.1258 8.87068Z"
            fill="currentColor"
        />
    </Svg>
)
